import mongoose, { Schema, type Document } from 'mongoose';

export interface IOrder extends Document {
  items: {
    product: {
      id: string;
      name: string;
      price: number;
      type: string;
    };
    quantity: number;
    extras: { id: string; name: string; price: number }[];
    removedIngredients?: string[];
    totalPrice: number;
  }[];
  delivery: {
    method: 'delivery' | 'pickup' | 'dine-in';
    fullName?: string;
    street?: string;
    houseNumber?: string;
    city?: string;
    phone?: string;
    email?: string;
    notes?: string;
    mapyCzUrl?: string;
  };
  payment: {
    method: 'cash' | 'card';
  };
  pricing: {
    subtotal: number;
    delivery: number;
    total: number;
  };
  printed: boolean;
  printNumber?: number;
  createdBy: 'customer' | 'admin';
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    items: [
      {
        product: {
          id: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          type: { type: String, required: true },
        },
        quantity: { type: Number, required: true },
        extras: [
          {
            id: { type: String },
            name: { type: String },
            price: { type: Number },
          },
        ],
        removedIngredients: [{ type: String }],
        totalPrice: { type: Number, required: true },
      },
    ],
    delivery: {
      method: {
        type: String,
        enum: ['delivery', 'pickup', 'dine-in'],
        required: true,
      },
      fullName: { type: String },
      street: { type: String },
      houseNumber: { type: String },
      city: { type: String },
      phone: { type: String },
      email: { type: String },
      notes: { type: String },
      mapyCzUrl: { type: String },
    },
    payment: {
      method: { type: String, enum: ['cash', 'card'], required: true },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      delivery: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    printed: { type: Boolean, default: false },
    printNumber: { type: Number },
    createdBy: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  },
);

// Index for date-based queries (order stats)
orderSchema.index({ createdAt: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
