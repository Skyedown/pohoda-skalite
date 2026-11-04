import { Order } from '../models/Order.js';

/** The privacy policy promises three years; after that the customer is wiped while items and totals stay for the statistics. */
export const CUSTOMER_RETENTION_MS = 3 * 365 * 24 * 60 * 60 * 1000;

const SWEEP_INTERVAL_MS = 24 * 60 * 60 * 1000;

let sweeper: NodeJS.Timeout | null = null;

export async function anonymiseExpiredOrders(
  now: Date = new Date(),
): Promise<number> {
  const cutoff = new Date(now.getTime() - CUSTOMER_RETENTION_MS);
  const result = await Order.updateMany(
    { createdAt: { $lt: cutoff }, anonymisedAt: null },
    {
      // The village stays: on its own it identifies nobody and feeds the stats.
      $unset: {
        'delivery.fullName': '',
        'delivery.street': '',
        'delivery.houseNumber': '',
        'delivery.phone': '',
        'delivery.email': '',
        'delivery.notes': '',
        'delivery.mapyCzUrl': '',
      },
      $set: { anonymisedAt: now },
    },
    { timestamps: false },
  );
  if (result.modifiedCount > 0) {
    console.log(`🧹 Anonymised ${result.modifiedCount} orders past retention`);
  }
  return result.modifiedCount;
}

/** Runs once when the database is reachable and then daily. */
export function startRetentionSweeper(): void {
  if (sweeper) return;
  const run = () =>
    void anonymiseExpiredOrders().catch((error: unknown) =>
      console.error('❌ Retention sweep failed:', error),
    );
  run();
  sweeper = setInterval(run, SWEEP_INTERVAL_MS);
  sweeper.unref();
}
