import { Router } from 'express';
import type { PipelineStage } from 'mongoose';
import { isMongoConnected } from '../utils/db.js';
import { Order } from '../models/Order.js';

const router = Router();

router.get('/api/orders/stats', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { from, to, deliveryMethod, productType } = req.query;

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

    const matchConditions: Record<string, unknown> = {
      createdAt: { $gte: fromDate, $lte: toDate },
    };

    if (deliveryMethod && typeof deliveryMethod === 'string') {
      matchConditions['delivery.method'] = { $in: deliveryMethod.split(',') };
    }

    if (productType && typeof productType === 'string') {
      matchConditions['items.product.type'] = productType;
    }

    const stats = await Order.aggregate([
      { $match: matchConditions },
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

router.get('/api/orders/product-stats', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { from, to, deliveryMethod, productType } = req.query;

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

    const matchConditions: Record<string, unknown> = {
      createdAt: { $gte: fromDate, $lte: toDate },
    };

    if (deliveryMethod && typeof deliveryMethod === 'string') {
      matchConditions['delivery.method'] = { $in: deliveryMethod.split(',') };
    }

    const pipeline: PipelineStage[] = [
      { $match: matchConditions },
      { $unwind: '$items' },
    ];

    if (productType && typeof productType === 'string') {
      pipeline.push({ $match: { 'items.product.type': productType } });
    }

    pipeline.push(
      {
        $group: {
          _id: {
            productId: '$items.product.id',
            deliveryMethod: '$delivery.method',
          },
          name: { $first: '$items.product.name' },
          type: { $first: '$items.product.type' },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' },
        },
      },
      {
        $group: {
          _id: '$_id.productId',
          name: { $first: '$name' },
          type: { $first: '$type' },
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { $sum: '$revenue' },
          byDeliveryMethod: {
            $push: { method: '$_id.deliveryMethod', quantity: '$quantity' },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    );

    const stats = await Order.aggregate(pipeline);
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

export default router;
