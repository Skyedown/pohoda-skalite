import type { LocalizedPrice, LocalizedText } from '../i18n/types';

export type ProductType =
  | 'pizza'
  | 'burger'
  | 'langos'
  | 'sides'
  | 'capovane'
  | 'drinks'
  | 'snacks';

export type ProductBadge = 'classic' | 'premium' | 'special';

export interface AdminSettings {
  mode: 'off' | 'disabled' | 'waitTime' | 'customNote';
  waitTimeMinutes: number;
  customNote: string;
  disabledProductTypes?: ProductType[];
  disabledProductIds?: string[];
  cardPaymentDeliveryEnabled?: boolean;
  cardPaymentPickupEnabled?: boolean;
}

/** Menu entry as authored — every customer-facing string carries both languages. */
export interface Product {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  price: LocalizedPrice;
  image: string;
  ingredients?: LocalizedText[];
  allergens?: string[];
  badge?: ProductBadge;
  type: ProductType;
  weight?: string;
  spicy?: boolean;
}

/**
 * Menu entry resolved for the active locale. `nameSk`/`ingredientsSk` ride along
 * so the kitchen ticket and the admin stay Slovak regardless of the storefront.
 */
export interface LocalizedProduct {
  id: string;
  name: string;
  nameSk: string;
  description?: string;
  price: number;
  image: string;
  ingredients?: string[];
  ingredientsSk?: string[];
  allergens?: string[];
  badge?: ProductBadge;
  type: ProductType;
  weight?: string;
  spicy?: boolean;
}

export interface Extra {
  id: string;
  name: LocalizedText;
  price: LocalizedPrice;
}

export interface LocalizedExtra {
  id: string;
  name: string;
  nameSk: string;
  price: number;
}

export interface CartItem {
  product: LocalizedProduct;
  quantity: number;
  totalPrice: number;
  extras?: LocalizedExtra[];
  extrasPrice?: number;
  removedIngredients?: string[];
  removedIngredientsSk?: string[];
}

export type DeliveryMethod = 'delivery' | 'pickup' | 'dine-in';

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  city?: string;
  street?: string;
  houseNumber?: string;
  notes?: string;
}

export interface Order extends OrderFormData {
  id: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
}

export type ValidationErrors = Partial<Record<keyof OrderFormData, string>>;
