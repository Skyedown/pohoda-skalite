import { Settings } from '../models/Settings.js';

/**
 * New menu entries go live switched off, until someone enables them in the
 * admin. Products rather than whole categories, so no category banner shows.
 */
const START_DISABLED_IDS = ['fried-1', 'fried-2', 'pizza-11', 'prilohy-11'];

/**
 * Disables each new product once and records it as introduced, so enabling it
 * in the admin is never undone by a later restart.
 */
export async function disableNewProducts(): Promise<void> {
  for (const id of START_DISABLED_IDS) {
    const result = await Settings.updateOne(
      { key: 'default', introducedProductIds: { $ne: id } },
      { $addToSet: { disabledProductIds: id, introducedProductIds: id } },
    );
    if (result.modifiedCount > 0) {
      console.log(`🆕 "${id}" disabled until enabled in admin`);
    }
  }
}
