import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Pizza, Extra } from '../types';
import { getCartFromStorage, saveCartToStorage, clearCartFromStorage } from '../utils/localStorage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    pizza: Pizza,
    quantity: number,
    extras?: Extra[],
    requiredOption?: { name: string; selectedValue: string }
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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
  // Initialize cart from localStorage on mount (lazy initialization)
  const [cart, setCart] = useState<CartItem[]>(() => {
    return getCartFromStorage();
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = (
    pizza: Pizza,
    quantity: number,
    extras?: Extra[],
    requiredOption?: { name: string; selectedValue: string }
  ) => {
    const extrasPrice = extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
    const totalPrice = (pizza.price + extrasPrice) * quantity;

    const newItem: CartItem = {
      pizza,
      quantity,
      totalPrice,
      extras,
      extrasPrice,
      requiredOption,
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

    setCart((prevCart) => {
      const newCart = [...prevCart];
      const item = newCart[index];
      item.quantity = quantity;
      item.totalPrice = (item.pizza.price + (item.extrasPrice || 0)) * quantity;
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    clearCartFromStorage();
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
