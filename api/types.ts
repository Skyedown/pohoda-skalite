/**
 * Type definitions for the Pizza Pohoda API
 */

import type { Currency, Tenant } from './utils/tenant.js';

export interface Extra {
  name: string;
  /** Wording the customer saw; falls back to `name` (Slovak) when absent. */
  nameLocalized?: string;
  price: number;
  priceEur?: number;
}

export interface OrderItem {
  name: string;
  nameLocalized?: string;
  size: string;
  quantity: number;
  basePrice: number;
  basePriceEur?: number;
  totalPrice: number;
  totalPriceEur?: number;
  extras?: Extra[];
  removedIngredients?: string[];
  removedIngredientsLocalized?: string[];
}

export interface Delivery {
  fullName: string;
  /** Polish addresses only — Slovak villages number houses without a street. */
  street?: string;
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
  /** The same order in euros. Identical to `pricing` on Slovak orders. */
  pricingEur?: Pricing;
  paymentMethod: 'cash' | 'card';
  deliveryMethod?: 'delivery' | 'pickup';
}

export type SanitizedOrder = Order;
