import mongoose, { Schema, type Document } from 'mongoose';

export type Tenant = 'sk' | 'pl';

export interface IOrder extends Document {
  /** Which storefront the order came from. Kitchen output stays Slovak either way. */
  tenant: Tenant;
  currency: 'EUR' | 'PLN';
  items: {
    product: {
      id: string;
      /** Canonical Slovak name — printed on the kitchen ticket and grouped in analytics. */
      name: string;
      /** Name as the customer saw it, used in the confirmation e-mail. */
      nameLocalized?: string;
      price: number;
      type: string;
    };
    quantity: number;
    extras: {
      id: string;
      name: string;
      nameLocalized?: string;
      price: number;
    }[];
    removedIngredients?: string[];
    removedIngredientsLocalized?: string[];
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
    tenant: {
      type: String,
      enum: ['sk', 'pl'],
      default: 'sk',
      required: true,
    },
    currency: {
      type: String,
      enum: ['EUR', 'PLN'],
      default: 'EUR',
      required: true,
    },
    items: [
      {
        product: {
          id: { type: String, required: true },
          name: { type: String, required: true },
          nameLocalized: { type: String },
          price: { type: Number, required: true },
          type: { type: String, required: true },
        },
        quantity: { type: Number, required: true },
        extras: [
          {
            id: { type: String },
            name: { type: String },
            nameLocalized: { type: String },
            price: { type: Number },
          },
        ],
        removedIngredients: [{ type: String }],
        removedIngredientsLocalized: [{ type: String }],
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
// Analytics and the admin list always scope by storefront first
orderSchema.index({ tenant: 1, createdAt: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
