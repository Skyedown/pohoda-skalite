import mongoose, { Schema, type Document } from 'mongoose';

export type Tenant = 'sk' | 'pl';

export interface IOrder extends Document {
  /** Which storefront the order came from. Kitchen output stays Slovak either way. */
  tenant: Tenant;
  /**
   * Everything stored on this document is in euros — the payment terminal
   * settles in euros on both storefronts, so that is the real value.
   */
  currency: 'EUR';
  /** What the customer saw on screen. Display only, never summed. */
  displayCurrency: 'EUR' | 'PLN';
  items: {
    product: {
      id: string;
      /** Canonical Slovak name — printed on the kitchen ticket and grouped in analytics. */
      name: string;
      /** Name as the customer saw it, used in the confirmation e-mail. */
      nameLocalized?: string;
      price: number;
      /** The same price as shown to the customer, in `displayCurrency`. */
      priceDisplay?: number;
      type: string;
    };
    quantity: number;
    extras: {
      id: string;
      name: string;
      nameLocalized?: string;
      price: number;
      priceDisplay?: number;
    }[];
    removedIngredients?: string[];
    removedIngredientsLocalized?: string[];
    totalPrice: number;
    totalPriceDisplay?: number;
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
  /** The same totals as shown to the customer. Identical on Slovak orders. */
  pricingDisplay?: {
    subtotal: number;
    delivery: number;
    total: number;
  };
  /** Routing code for the kitchen ticket, e.g. `R-LAL` or `R-PL-LAL`. */
  ticketCode?: string;
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
      enum: ['EUR'],
      default: 'EUR',
      required: true,
    },
    displayCurrency: {
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
          priceDisplay: { type: Number },
          type: { type: String, required: true },
        },
        quantity: { type: Number, required: true },
        extras: [
          {
            id: { type: String },
            name: { type: String },
            nameLocalized: { type: String },
            price: { type: Number },
            priceDisplay: { type: Number },
          },
        ],
        removedIngredients: [{ type: String }],
        removedIngredientsLocalized: [{ type: String }],
        totalPrice: { type: Number, required: true },
        totalPriceDisplay: { type: Number },
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
    pricingDisplay: {
      subtotal: { type: Number },
      delivery: { type: Number },
      total: { type: Number },
    },
    ticketCode: { type: String },
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
