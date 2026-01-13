export type ProductType = 'pizza' | 'burger' | 'langos' | 'sides' | 'snack' | 'drink';

export interface Pizza {
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
  pizza: Pizza;
  quantity: number;
  totalPrice: number;
  extras?: Extra[];
  extrasPrice?: number;
  requiredOption?: {
    name: string;
    selectedValue: string;
  };
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  houseNumber: string;
  notes?: string;
}

export interface Order extends OrderFormData {
  id: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
}

export type ValidationErrors = Partial<Record<keyof OrderFormData, string>>;
