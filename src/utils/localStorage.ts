import type { Locale } from '../i18n/types';
import type { CartItem } from '../types';

const CART_STORAGE_KEY = 'pohoda-pizza-cart';

/**
 * Bump when the persisted cart shape changes — a stale cart from an older build
 * would otherwise resurface with missing prices or labels.
 */
const CART_VERSION = 3;

interface StoredCart {
  version: number;
  locale: Locale;
  items: CartItem[];
}

function isValidItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as CartItem;
  return (
    !!candidate.product &&
    typeof candidate.product.id === 'string' &&
    typeof candidate.product.name === 'string' &&
    typeof candidate.product.price === 'number'
  );
}

export const getCartFromStorage = (locale: Locale): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Partial<StoredCart>;

    if (
      parsed.version !== CART_VERSION ||
      parsed.locale !== locale ||
      !Array.isArray(parsed.items)
    ) {
      clearCartFromStorage();
      return [];
    }

    return parsed.items.filter(isValidItem);
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    clearCartFromStorage();
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[], locale: Locale): void => {
  try {
    const payload: StoredCart = {
      version: CART_VERSION,
      locale,
      items: cart,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const clearCartFromStorage = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};
