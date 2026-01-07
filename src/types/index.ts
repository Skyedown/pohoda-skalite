export type ProductType = 'pizza' | 'burger' | 'langos' | 'sides' | 'snack' | 'drink';

export type PizzaSize = 'small' | 'medium' | 'large';

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
  size: PizzaSize;
  totalPrice: number;
  extras?: Extra[];
  extrasPrice?: number;
  requiredOption?: {
    name: string;
    selectedValue: string;
  };
}

export const PIZZA_SIZE_MULTIPLIERS: Record<PizzaSize, number> = {
  small: 0.8,
  medium: 1,
  large: 1.3,
};

export const PIZZA_SIZE_LABELS: Record<PizzaSize, string> = {
  small: 'Malá (26cm)',
  medium: 'Stredná (32cm)',
  large: 'Veľká (40cm)',
};

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
