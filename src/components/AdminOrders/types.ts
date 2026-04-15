export interface OrderDelivery {
  method: 'delivery' | 'pickup' | 'dine-in';
  fullName?: string;
  street?: string;
  houseNumber?: string;
  city?: string;
  phone?: string;
  notes?: string;
}

export interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  extras: { name: string; price: number }[];
  removedIngredients?: string[];
  totalPrice: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  delivery: OrderDelivery;
  payment: {
    method: 'cash' | 'card';
  };
  pricing: {
    total: number;
  };
  printed: boolean;
  printNumber?: number;
  createdBy: 'customer' | 'admin';
  createdAt: string;
}
