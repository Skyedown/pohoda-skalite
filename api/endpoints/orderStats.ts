import { Router } from 'express';
import type { PipelineStage } from 'mongoose';
import { isMongoConnected } from '../utils/db.js';
import { Order } from '../models/Order.js';
import { tenantFilter, toTenant } from '../utils/tenant.js';

const router = Router();

interface ParsedRange {
  fromDate: Date;
  toDate: Date;
  fromParts: [number, number, number];
  toParts: [number, number, number];
}

function parseRange(from: unknown, to: unknown): ParsedRange | null {
  if (typeof from !== 'string' || typeof to !== 'string') return null;

  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
  const [toYear, toMonth, toDay] = to.split('-').map(Number);

  const fromDate = new Date(fromYear, fromMonth - 1, fromDay, 0, 0, 0, 0);
  const toDate = new Date(toYear, toMonth - 1, toDay, 23, 59, 59, 999);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return null;

  return {
    fromDate,
    toDate,
    fromParts: [fromYear, fromMonth, fromDay],
    toParts: [toYear, toMonth, toDay],
  };
}

/**
 * Every stats query is scoped to one storefront — EUR and PLN totals must never
 * be added together.
 */
function buildMatch(
  req: { query: Record<string, unknown> },
  range: ParsedRange,
  includeDeliveryMethod: boolean,
): Record<string, unknown> {
  const { deliveryMethod, productType, paymentMethod, tenant } = req.query;

  const match: Record<string, unknown> = {
    ...tenantFilter(toTenant(tenant)),
    createdAt: { $gte: range.fromDate, $lte: range.toDate },
  };

  if (
    includeDeliveryMethod &&
    deliveryMethod &&
    typeof deliveryMethod === 'string'
  ) {
    match['delivery.method'] = { $in: deliveryMethod.split(',') };
  }

  if (paymentMethod === 'cash' || paymentMethod === 'card') {
    match['payment.method'] = paymentMethod;
  }

  if (productType && typeof productType === 'string') {
    match['items.product.type'] = productType;
  }

  return match;
}

function sumIfPayment(method: 'cash' | 'card', value: unknown) {
  return { $sum: { $cond: [{ $eq: ['$payment.method', method] }, value, 0] } };
}

router.get('/api/orders/stats', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const range = parseRange(req.query.from, req.query.to);
    if (!range) {
      return res
        .status(400)
        .json({ error: 'from and to query params are required (YYYY-MM-DD)' });
    }

    const stats = await Order.aggregate([
      { $match: buildMatch(req, range, true) },
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
          cashOrders: sumIfPayment('cash', 1),
          cashValue: sumIfPayment('cash', '$pricing.total'),
          cardOrders: sumIfPayment('card', 1),
          cardValue: sumIfPayment('card', '$pricing.total'),
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = [];
    const [fromYear, fromMonth, fromDay] = range.fromParts;
    const [toYear, toMonth, toDay] = range.toParts;
    const current = new Date(fromYear, fromMonth - 1, fromDay);
    const end = new Date(toYear, toMonth - 1, toDay);

    while (current <= end) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      const found = stats.find((s: { _id: string }) => s._id === dateStr);
      result.push({
        date: dateStr,
        totalOrders: found?.totalOrders ?? 0,
        totalValue: found?.totalValue ?? 0,
        cashOrders: found?.cashOrders ?? 0,
        cashValue: found?.cashValue ?? 0,
        cardOrders: found?.cardOrders ?? 0,
        cardValue: found?.cardValue ?? 0,
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

    const range = parseRange(req.query.from, req.query.to);
    if (!range) {
      return res
        .status(400)
        .json({ error: 'from and to query params are required (YYYY-MM-DD)' });
    }

    const { productType } = req.query;

    const pipeline: PipelineStage[] = [
      { $match: buildMatch(req, range, true) },
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
