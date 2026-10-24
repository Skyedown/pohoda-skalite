import mongoose, { Schema, type Document } from 'mongoose';

export const ANNOUNCEMENT_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AnnouncementImageType = (typeof ANNOUNCEMENT_IMAGE_TYPES)[number];

export interface IAnnouncementImage extends Document {
  data: Buffer;
  contentType: AnnouncementImageType;
  createdAt: Date;
  updatedAt: Date;
}

const announcementImageSchema = new Schema<IAnnouncementImage>(
  {
    data: { type: Buffer, required: true },
    contentType: {
      type: String,
      enum: ANNOUNCEMENT_IMAGE_TYPES,
      required: true,
    },
  },
  { timestamps: true },
);

export function isImageId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value);
}

export const AnnouncementImage = mongoose.model<IAnnouncementImage>(
  'AnnouncementImage',
  announcementImageSchema,
);
