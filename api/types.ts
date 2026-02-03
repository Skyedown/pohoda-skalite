/**
 * Type definitions for the Pizza Pohoda API
 */

export interface Extra {
  name: string;
  price: number;
}

export interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  extras?: Extra[];
  requiredOption?: {
    name: string;
    selectedValue: string;
  };
}

export interface Delivery {
  fullName: string;
  street: string;
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
  items: OrderItem[];
  delivery: Delivery;
  pricing: Pricing;
  paymentMethod: 'cash' | 'card';
  deliveryMethod?: 'delivery' | 'pickup';
}

export interface SanitizedOrder extends Order {
  // Same structure as Order but with sanitized values
}
