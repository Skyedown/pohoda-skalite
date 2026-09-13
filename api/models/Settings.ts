import mongoose, { Schema, type Document } from 'mongoose';

export interface ILocalizedText {
  sk: string;
  pl: string;
}

export interface IDeliveryCity {
  name: string;
  minOrder: number;
  fee: number;
}

export interface ISettings extends Document {
  key: string;
  mode: 'off' | 'disabled' | 'waitTime' | 'customNote';
  waitTimeMinutes: number;
  customNote: ILocalizedText;
  disabledReason: ILocalizedText;
  disabledProductTypes: string[];
  disabledProductIds: string[];
  cardPaymentDeliveryEnabled: boolean;
  cardPaymentPickupEnabled: boolean;
  deliveryCities: {
    sk: IDeliveryCity[];
    pl: IDeliveryCity[];
  };
}

const localizedTextSchema = new Schema<ILocalizedText>(
  {
    sk: { type: String, default: '' },
    pl: { type: String, default: '' },
  },
  { _id: false },
);

const deliveryCitySchema = new Schema<IDeliveryCity>(
  {
    name: { type: String, required: true },
    minOrder: { type: Number, required: true, min: 0 },
    fee: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const settingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    mode: {
      type: String,
      enum: ['off', 'disabled', 'waitTime', 'customNote'],
      default: 'off',
    },
    waitTimeMinutes: { type: Number, default: 60 },
    customNote: { type: localizedTextSchema, default: () => ({}) },
    disabledReason: { type: localizedTextSchema, default: () => ({}) },
    disabledProductTypes: [{ type: String }],
    disabledProductIds: [{ type: String }],
    cardPaymentDeliveryEnabled: { type: Boolean, default: false },
    cardPaymentPickupEnabled: { type: Boolean, default: false },
    deliveryCities: {
      sk: [deliveryCitySchema],
      pl: [deliveryCitySchema],
    },
  },
  { timestamps: true },
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
