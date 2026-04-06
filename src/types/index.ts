export type ProductType = 'pizza' | 'burger' | 'langos' | 'sides';

export interface AdminSettings {
  mode: 'off' | 'disabled' | 'waitTime' | 'customNote';
  waitTimeMinutes: number;
  customNote: string;
  disabledProductTypes?: ProductType[];
  cardPaymentDeliveryEnabled?: boolean;
  cardPaymentPickupEnabled?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  ingredients?: string[];
  allergens?: string[];
  badge?: 'classic' | 'premium' | 'special';
  type: ProductType;
  weight?: string;
  spicy?: boolean;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface RequiredOption {
  id: string;
  name: string;
  label: string;
  options: {
    id: string;
    label: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
  extras?: Extra[];
  extrasPrice?: number;
  removedIngredients?: string[];
  requiredOption?: {
    name: string;
    selectedValue: string;
  };
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
