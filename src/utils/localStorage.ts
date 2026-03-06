import type { CartItem } from '../types';

const CART_STORAGE_KEY = 'pohoda-pizza-cart';

export const getCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];

    const parsedCart = JSON.parse(storedCart);

    // Validate that we have an array
    if (!Array.isArray(parsedCart)) {
      console.warn('Invalid cart data in localStorage, clearing...');
      clearCartFromStorage();
      return [];
    }

    // Validate each cart item
    const validCart = parsedCart.filter((item) => {
      if (!item || typeof item !== 'object') return false;
      if (!item.product || !item.product.id || !item.product.name) {
        console.warn('Invalid cart item found, removing:', item);
        return false;
      }
      return true;
    });

    return validCart;
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    // Clear corrupted data
    clearCartFromStorage();
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
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
