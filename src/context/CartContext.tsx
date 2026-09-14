import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, LocalizedExtra, LocalizedProduct } from '../types';
import { useLocale } from '../i18n/LocaleContext';
import {
  getCartFromStorage,
  saveCartToStorage,
  clearCartFromStorage,
} from '../utils/localStorage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: LocalizedProduct,
    quantity: number,
    extras?: LocalizedExtra[],
    removedIngredients?: string[],
    removedIngredientsSk?: string[],
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalPriceEur: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { locale } = useLocale();

  // Prices and labels are baked into each line, so a stored cart only stays
  // valid while the visitor is on the same language site.
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return getCartFromStorage(locale);
    } catch (error) {
      console.error('Failed to initialize cart from storage:', error);
      return [];
    }
  });

  useEffect(() => {
    saveCartToStorage(cart, locale);
  }, [cart, locale]);

  const addToCart = (
    product: LocalizedProduct,
    quantity: number,
    extras?: LocalizedExtra[],
    removedIngredients?: string[],
    removedIngredientsSk?: string[],
  ) => {
    if (!product || !product.id || !product.name) {
      console.error('Invalid product added to cart:', product);
      return;
    }

    const extrasPrice =
      extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
    const extrasPriceEur =
      extras?.reduce((sum, extra) => sum + extra.priceEur, 0) || 0;
    const totalPrice = (product.price + extrasPrice) * quantity;
    const totalPriceEur = (product.priceEur + extrasPriceEur) * quantity;

    const newItem: CartItem = {
      product,
      quantity,
      totalPrice,
      totalPriceEur,
      extras,
      extrasPrice,
      removedIngredients,
      removedIngredientsSk,
    };

    setCart((prevCart) => [...prevCart, newItem]);
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item, i) => {
        if (i !== index) return item;

        const extrasPriceEur =
          item.extras?.reduce((sum, extra) => sum + extra.priceEur, 0) || 0;

        return {
          ...item,
          quantity,
          totalPrice: (item.product.price + (item.extrasPrice || 0)) * quantity,
          totalPriceEur: (item.product.priceEur + extrasPriceEur) * quantity,
        };
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
    clearCartFromStorage();
  };

  const getTotalPrice = (): number =>
    cart.reduce((total, item) => total + item.totalPrice, 0);

  const getTotalPriceEur = (): number =>
    cart.reduce((total, item) => total + item.totalPriceEur, 0);

  const getTotalItems = (): number =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalPriceEur,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
