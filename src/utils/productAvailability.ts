import type { AdminSettings } from './adminSettings';
import type { Product } from '../types';

/**
 * A product is unavailable if its whole category is disabled,
 * or if it was individually disabled (out of stock) in the admin panel.
 */
export function isProductDisabled(
  product: Pick<Product, 'id' | 'type'>,
  settings: Pick<AdminSettings, 'disabledProductTypes' | 'disabledProductIds'>,
): boolean {
  const categoryDisabled = (settings.disabledProductTypes || []).includes(
    product.type,
  );
  const itemDisabled = (settings.disabledProductIds || []).includes(product.id);
  return categoryDisabled || itemDisabled;
}
