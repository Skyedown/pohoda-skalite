import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeOrder } from './utils/sanitize.js';
import { generateCustomerEmail } from './templates/customerEmail.js';
import { generateRestaurantEmail } from './templates/restaurantEmail.js';
import { connectToMongoDB, isMongoConnected } from './utils/db.js';
import { getMapyCzUrlForAddress } from './utils/geocoding.js';
import {
  connectToRabbitMQ,
  publishOrder,
  closeRabbitMQ,
} from './utils/messageQueue.js';
import { Order } from './models/Order.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Restaurant contact info - uses VITE_ prefixed variables (same as frontend)
const RESTAURANT_EMAIL =
  process.env.VITE_RESTAURANT_EMAIL || 'objednavky@pizzapohoda.sk';
const RESTAURANT_PHONE = process.env.VITE_RESTAURANT_PHONE || '+421918175571;';

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin settings file path
const ADMIN_SETTINGS_FILE = path.join(__dirname, 'data', 'adminSettings.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default settings object
const createDefaultSettings = () => ({
  mode: 'off',
  waitTimeMinutes: 60,
  customNote: '',
  disabledReason:
    'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
  disabledProductTypes: [],
  cardPaymentDeliveryEnabled: false,
  cardPaymentPickupEnabled: false,
});

// Initialize admin settings file if it doesn't exist
if (!fs.existsSync(ADMIN_SETTINGS_FILE)) {
  fs.writeFileSync(
    ADMIN_SETTINGS_FILE,
    JSON.stringify(createDefaultSettings(), null, 2),
  );
}

// Get admin settings
app.get('/api/admin-settings', (req, res) => {
  try {
    // Prevent caching
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Create file if it doesn't exist
    if (!fs.existsSync(ADMIN_SETTINGS_FILE)) {
      fs.writeFileSync(
        ADMIN_SETTINGS_FILE,
        JSON.stringify(createDefaultSettings(), null, 2),
      );
    }

    const data = fs.readFileSync(ADMIN_SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);

    // Migration: ensure disabledReason exists (only if undefined, allow empty string)
    if (settings.disabledReason === undefined) {
      settings.disabledReason =
        'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.';
      fs.writeFileSync(ADMIN_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    }

    res.json(settings);
  } catch (error) {
    console.error('Error reading admin settings:', error);
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

// Update admin settings
app.post('/api/admin-settings', (req, res) => {
  try {
    const {
      mode,
      waitTimeMinutes,
      customNote,
      disabledReason,
      disabledProductTypes,
      cardPaymentDeliveryEnabled,
      cardPaymentPickupEnabled,
    } = req.body;

    // Validate input
    const validModes = ['off', 'disabled', 'waitTime', 'customNote'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    if (typeof waitTimeMinutes !== 'number' || waitTimeMinutes < 0) {
      return res.status(400).json({ error: 'Invalid waitTimeMinutes' });
    }

    if (typeof customNote !== 'string') {
      return res.status(400).json({ error: 'Invalid customNote' });
    }

    if (customNote.length > 500) {
      return res
        .status(400)
        .json({ error: 'Custom note too long (max 500 characters)' });
    }

    if (typeof disabledReason !== 'string') {
      return res.status(400).json({ error: 'Invalid disabledReason' });
    }

    if (disabledReason.length > 500) {
      return res
        .status(400)
        .json({ error: 'Disabled reason too long (max 500 characters)' });
    }

    // Validate disabledProductTypes
    const validProductTypes = ['pizza', 'burger', 'langos', 'sides'];
    if (disabledProductTypes && Array.isArray(disabledProductTypes)) {
      if (
        !disabledProductTypes.every((type) => validProductTypes.includes(type))
      ) {
        return res.status(400).json({ error: 'Invalid product type' });
      }
    }

    // Validate card payment flags
    if (
      typeof cardPaymentDeliveryEnabled !== 'boolean' &&
      cardPaymentDeliveryEnabled !== undefined
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid cardPaymentDeliveryEnabled' });
    }
    if (
      typeof cardPaymentPickupEnabled !== 'boolean' &&
      cardPaymentPickupEnabled !== undefined
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid cardPaymentPickupEnabled' });
    }

    const settings = {
      mode,
      waitTimeMinutes,
      customNote,
      disabledReason,
      disabledProductTypes: disabledProductTypes || [],
      cardPaymentDeliveryEnabled: !!cardPaymentDeliveryEnabled,
      cardPaymentPickupEnabled: !!cardPaymentPickupEnabled,
    };

    // Ensure data directory exists before writing
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(ADMIN_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving admin settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Send order confirmation emails
app.post('/api/send-order-emails', async (req, res) => {
  console.log(
    '🚀 Received order email request at:',
    new Date().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' }),
  );

  try {
    const { order } = req.body;

    if (!order || !order.delivery || !order.delivery.email) {
      console.error('❌ Invalid order data received');
      return res.status(400).json({ error: 'Invalid order data' });
    }

    console.log('📦 Order details:', {
      email: order.delivery.email,
      total: order.pricing.total,
      items: order.items.length,
    });

    // Sanitize order data to prevent XSS and injection attacks
    const sanitizedOrder = sanitizeOrder(order);

    // Generate customer email content
    const customerEmailContent = generateCustomerEmail(
      sanitizedOrder,
      RESTAURANT_EMAIL,
      RESTAURANT_PHONE,
    );

    // Generate restaurant email content
    const restaurantEmailContent = generateRestaurantEmail(sanitizedOrder);

    // Send email to customer
    const customerEmail = {
      to: order.delivery.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk',
        name: 'Pizza Pohoda',
      },
      replyTo: 'objednavky@pizzapohoda.sk',
      subject: 'Potvrdenie objednávky - Pizza Pohoda',
      html: customerEmailContent,
    };

    // Generate unique order ID from timestamp in Europe/Bratislava timezone
    const orderDate = new Date(order.timestamp);
    const orderId = orderDate
      .toLocaleString('sk-SK', {
        timeZone: 'Europe/Bratislava',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/[^\d]/g, ''); // Format: YYYYMMDDHHMMSS

    // Send email to restaurant
    const restaurantEmail = {
      to: RESTAURANT_EMAIL,
      from: {
        email: 'noreply@pizzapohoda.sk',
        name: 'Pizza Pohoda',
      },
      subject: `Nová objednávka #${orderId}`,
      html: restaurantEmailContent,
    };

    // Send both emails
    console.log('📧 Attempting to send emails...');
    console.log('   From:', customerEmail.from);
    console.log('   To Customer:', customerEmail.to);
    console.log('   To Restaurant:', restaurantEmail.to);

    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(restaurantEmail),
    ]);

    console.log('✅ Emails sent successfully!');

    // Resolve Mapy.cz URL for delivery orders
    let mapyCzUrl: string | null = null;
    if (
      order.deliveryMethod === 'delivery' &&
      order.delivery?.street &&
      order.delivery?.city
    ) {
      try {
        console.log('📍 Resolving GPS coordinates for delivery address...');
        mapyCzUrl = await getMapyCzUrlForAddress({
          country: 'Slovensko',
          city: order.delivery.city,
          street: order.delivery.street,
          houseNumber: undefined, // Can be extracted from street if needed
        });

        if (mapyCzUrl) {
          console.log('✅ Mapy.cz URL generated:', mapyCzUrl);
        } else {
          console.warn('⚠️ Could not resolve GPS coordinates for address');
        }
      } catch (geoError) {
        console.error('❌ Error resolving Mapy.cz URL:', geoError);
      }
    }

    // Save order to MongoDB
    let savedOrderId = null;
    let published = false;

    if (isMongoConnected()) {
      try {
        console.log('💾 Saving customer order to MongoDB...');

        // Map customer order format to Order model format
        const orderData = {
          items: order.items.map((item: Record<string, unknown>) => ({
            product: {
              id: item.id || (item.product as Record<string, unknown>)?.id,
              name:
                item.name || (item.product as Record<string, unknown>)?.name,
              price:
                item.basePrice ||
                (item.product as Record<string, unknown>)?.price,
              type:
                item.type || (item.product as Record<string, unknown>)?.type,
            },
            quantity: item.quantity,
            extras: item.extras || [],
            totalPrice: item.totalPrice,
            requiredOption: item.requiredOption || undefined,
            removedIngredients: item.removedIngredients || [],
          })),
          delivery: {
            method: order.deliveryMethod || order.delivery?.method,
            fullName: order.delivery?.fullName,
            street: order.delivery?.street,
            city: order.delivery?.city,
            phone: order.delivery?.phone,
            email: order.delivery?.email,
            notes: order.delivery?.notes,
            mapyCzUrl: mapyCzUrl || undefined,
          },
          payment: {
            method: order.paymentMethod || order.payment?.method,
          },
          pricing: order.pricing,
          printed: false,
          createdBy: 'customer',
        };

        const savedOrder = await Order.create(orderData);
        savedOrderId = savedOrder._id;
        console.log('✅ Order saved to MongoDB:', savedOrder._id);

        // Publish to RabbitMQ for the printer
        published = await publishOrder({
          _id: savedOrder._id.toString(),
        });

        if (published) {
          console.log('📤 Order published to RabbitMQ:', savedOrder._id);
        } else {
          console.warn('⚠️ Order NOT published to RabbitMQ:', savedOrder._id);
        }
      } catch (dbError) {
        console.error('❌ Failed to save customer order to MongoDB:', dbError);
      }
    } else {
      console.warn(
        '⚠️ MongoDB not connected — customer order not saved to database',
      );
    }

    res.json({
      success: true,
      message: 'Emails sent successfully',
      orderId: savedOrderId,
      published,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = (error as any)?.response?.body;

    console.error('❌ Error sending emails:', errorMessage);
    console.error(
      '📧 SendGrid Response Body:',
      JSON.stringify(errorResponse, null, 2),
    );
    console.error(
      '📮 From Email:',
      process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk',
    );
    console.error('📨 To Restaurant:', RESTAURANT_EMAIL);

    res.status(500).json({
      error: 'Failed to send emails',
      details: errorMessage,
      sendgridError: errorResponse,
    });
  }
});

// ===== Order Management Endpoints =====

// Submit a new order (save to MongoDB, publish to RabbitMQ)
app.post('/api/orders', async (req, res) => {
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

    // Resolve Mapy.cz URL for delivery orders
    if (
      order.delivery?.method === 'delivery' &&
      order.delivery?.street &&
      order.delivery?.city
    ) {
      try {
        console.log('📍 Resolving GPS coordinates for delivery address...');
        const mapyCzUrl = await getMapyCzUrlForAddress({
          country: 'Slovensko',
          city: order.delivery.city,
          street: order.delivery.street,
          houseNumber: undefined,
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

    // Save order to MongoDB
    const savedOrder = await Order.create({
      items: order.items,
      delivery: order.delivery,
      payment: order.payment,
      pricing: order.pricing,
      printed: false,
      createdBy: order.createdBy || 'customer',
    });

    console.log('✅ Order saved to MongoDB:', savedOrder._id);

    // Publish to RabbitMQ for the printer
    const published = await publishOrder({
      _id: savedOrder._id.toString(),
    });

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

// Get recent orders (last 50)
app.get('/api/orders/recent', async (req, res) => {
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
    res.status(500).json({
      error: 'Failed to fetch orders',
      details: errorMessage,
    });
  }
});

// Reprint order (re-publish to RabbitMQ)
app.post('/api/orders/:id/reprint', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;

    // Verify order exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('🔄 Reprinting order:', id);

    // Publish to RabbitMQ
    const published = await publishOrder({
      _id: id,
    });

    if (!published) {
      console.warn('⚠️ Failed to publish order to RabbitMQ:', id);
      return res.status(500).json({ error: 'Failed to publish to printer' });
    }

    console.log('✅ Order republished to RabbitMQ:', id);

    res.json({
      success: true,
      message: 'Order sent to printer',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error reprinting order:', errorMessage);
    res.status(500).json({
      error: 'Failed to reprint order',
      details: errorMessage,
    });
  }
});

// Update order
app.put('/api/orders/:id', async (req, res) => {
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
    res.status(500).json({
      error: 'Failed to update order',
      details: errorMessage,
    });
  }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn('⚠️ Invalid ObjectId format:', id);
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    console.log('🗑️ Attempting to delete order:', id);

    // Delete the order
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      console.warn('⚠️ Order not found:', id);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('✅ Order deleted successfully:', id);

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error deleting order:', errorMessage);
    res.status(500).json({
      error: 'Failed to delete order',
      details: errorMessage,
    });
  }
});

// Get order stats for date range
app.get('/api/orders/stats', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: 'from and to query params are required (YYYY-MM-DD)' });
    }

    // Parse dates as local timezone (Europe/Bratislava) to avoid UTC offset issues
    const [fromYear, fromMonth, fromDay] = (from as string)
      .split('-')
      .map(Number);
    const [toYear, toMonth, toDay] = (to as string).split('-').map(Number);
    const fromDate = new Date(fromYear, fromMonth - 1, fromDay, 0, 0, 0, 0);
    const toDate = new Date(toYear, toMonth - 1, toDay, 23, 59, 59, 999);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'Europe/Bratislava',
            },
          },
          totalOrders: { $sum: 1 },
          totalValue: { $sum: '$pricing.total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing dates with zeros using local date strings
    const result: { date: string; totalOrders: number; totalValue: number }[] =
      [];
    const current = new Date(fromYear, fromMonth - 1, fromDay);
    const end = new Date(toYear, toMonth - 1, toDay);
    while (current <= end) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      const found = stats.find((s: { _id: string }) => s._id === dateStr);
      result.push({
        date: dateStr,
        totalOrders: found ? found.totalOrders : 0,
        totalValue: found ? found.totalValue : 0,
      });
      current.setDate(current.getDate() + 1);
    }

    res.json(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching order stats:', errorMessage);
    res
      .status(500)
      .json({ error: 'Failed to fetch stats', details: errorMessage });
  }
});

app.get('/api/orders/product-stats', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: 'from and to query params are required (YYYY-MM-DD)' });
    }

    const [fromYear, fromMonth, fromDay] = (from as string)
      .split('-')
      .map(Number);
    const [toYear, toMonth, toDay] = (to as string).split('-').map(Number);
    const fromDate = new Date(fromYear, fromMonth - 1, fromDay, 0, 0, 0, 0);
    const toDate = new Date(toYear, toMonth - 1, toDay, 23, 59, 59, 999);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const stats = await Order.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product.id',
          name: { $first: '$items.product.name' },
          type: { $first: '$items.product.type' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.totalPrice' },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json(stats);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching product stats:', errorMessage);
    res
      .status(500)
      .json({ error: 'Failed to fetch product stats', details: errorMessage });
  }
});

// Initialize services and start server
async function startServer() {
  try {
    await connectToMongoDB();
  } catch {
    console.warn('⚠️ MongoDB connection failed — continuing without database');
  }

  try {
    await connectToRabbitMQ();
  } catch {
    console.warn(
      '⚠️ RabbitMQ connection failed — continuing without message queue',
    );
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});
