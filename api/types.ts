/**
 * Type definitions for the Pizza Pohoda API
 */

import type { Currency, Tenant } from './utils/tenant.js';

export interface Extra {
  name: string;
  /** Wording the customer saw; falls back to `name` (Slovak) when absent. */
  nameLocalized?: string;
  price: number;
}

export interface OrderItem {
  name: string;
  nameLocalized?: string;
  size: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  extras?: Extra[];
  removedIngredients?: string[];
  removedIngredientsLocalized?: string[];
}

export interface Delivery {
  fullName: string;
  houseNumber?: string;
  city: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface Pricing {
  subtotal: number;
  delivery: number;
  total: number;
}

export interface Order {
  timestamp: string;
  tenant: Tenant;
  currency: Currency;
  items: OrderItem[];
  delivery: Delivery;
  pricing: Pricing;
  paymentMethod: 'cash' | 'card';
  deliveryMethod?: 'delivery' | 'pickup';
}

export type SanitizedOrder = Order;
