import { Router } from 'express';
import { isMongoConnected } from '../utils/db.js';
import {
  getMapyCzUrlForAddress,
  getPostalCodeForCity,
} from '../utils/geocoding.js';
import { publishOrder } from '../utils/messageQueue.js';
import { Order } from '../models/Order.js';

const router = Router();

// Submit a new order
router.post('/api/orders', async (req, res) => {
  console.log(
    '🚀 Received order request at:',
    new Date().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' }),
  );

  try {
    const { order } = req.body;

    if (!order || !order.items || !order.delivery || !order.pricing) {
      console.error('❌ Invalid order data received');
      return res.status(400).json({ error: 'Invalid order data' });
    }

    console.log('📦 Order details:', {
      items: order.items.length,
      total: order.pricing.total,
      createdBy: order.createdBy || 'customer',
    });

    if (!isMongoConnected()) {
      console.error('❌ Database not available');
      return res.status(503).json({ error: 'Database not available' });
    }

    if (
      order.delivery?.method === 'delivery' &&
      order.delivery?.houseNumber &&
      order.delivery?.city
    ) {
      try {
        console.log('📍 Resolving GPS coordinates for delivery address...');
        const mapyCzUrl = await getMapyCzUrlForAddress({
          country: 'Slovensko',
          city: order.delivery.city,
          houseNumber: order.delivery.houseNumber,
          postalCode: getPostalCodeForCity(order.delivery.city),
        });

        if (mapyCzUrl) {
          console.log('✅ Mapy.cz URL generated:', mapyCzUrl);
          order.delivery.mapyCzUrl = mapyCzUrl;
        } else {
          console.warn('⚠️ Could not resolve GPS coordinates for address');
        }
      } catch (geoError) {
        console.error('❌ Error resolving Mapy.cz URL:', geoError);
      }
    }

    const savedOrder = await Order.create({
      items: order.items,
      delivery: order.delivery,
      payment: order.payment,
      pricing: order.pricing,
      printed: false,
      createdBy: order.createdBy || 'customer',
    });

    console.log('✅ Order saved to MongoDB:', savedOrder._id);

    const published = await publishOrder({ _id: savedOrder._id.toString() });

    if (published) {
      console.log('📤 Order published to RabbitMQ:', savedOrder._id);
    } else {
      console.warn('⚠️ Order NOT published to RabbitMQ:', savedOrder._id);
    }

    res.status(201).json({
      success: true,
      orderId: savedOrder._id,
      published,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error saving order:', errorMessage);
    res
      .status(500)
      .json({ error: 'Failed to save order', details: errorMessage });
  }
});

// Get recent orders
router.get('/api/orders/recent', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (from && to) {
      const [fromYear, fromMonth, fromDay] = (from as string)
        .split('-')
        .map(Number);
      const [toYear, toMonth, toDay] = (to as string).split('-').map(Number);
      const fromDate = new Date(fromYear, fromMonth - 1, fromDay, 0, 0, 0, 0);
      const toDate = new Date(toYear, toMonth - 1, toDay, 23, 59, 59, 999);
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        filter.createdAt = { $gte: fromDate, $lte: toDate };
      }
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json({ orders });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching recent orders:', errorMessage);
    res
      .status(500)
      .json({ error: 'Failed to fetch orders', details: errorMessage });
  }
});

// Reprint order
router.post('/api/orders/:id/reprint', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('🔄 Reprinting order:', id);

    const published = await publishOrder({ _id: id });

    if (!published) {
      console.warn('⚠️ Failed to publish order to RabbitMQ:', id);
      return res.status(500).json({ error: 'Failed to publish to printer' });
    }

    console.log('✅ Order republished to RabbitMQ:', id);
    res.json({ success: true, message: 'Order sent to printer' });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error reprinting order:', errorMessage);
    res
      .status(500)
      .json({ error: 'Failed to reprint order', details: errorMessage });
  }
});

// Update order
router.put('/api/orders/:id', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const { order } = req.body;
    if (!order) {
      return res.status(400).json({ error: 'Order data is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        items: order.items,
        delivery: order.delivery,
        payment: order.payment,
        pricing: order.pricing,
      },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error updating order:', errorMessage);
    res
      .status(500)
      .json({ error: 'Failed to update order', details: errorMessage });
  }
});

// Delete order
router.delete('/api/orders/:id', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn('⚠️ Invalid ObjectId format:', id);
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    console.log('🗑️ Attempting to delete order:', id);

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      console.warn('⚠️ Order not found:', id);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('✅ Order deleted successfully:', id);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error deleting order:', errorMessage);
    res
      .status(500)
      .json({ error: 'Failed to delete order', details: errorMessage });
  }
});

export default router;
