import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // bcrypt hash — the plaintext password is never stored or logged.
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);
