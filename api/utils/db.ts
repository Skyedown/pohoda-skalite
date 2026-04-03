import mongoose from 'mongoose';

let isConnected = false;

export async function connectToMongoDB(): Promise<void> {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI not set — MongoDB features disabled');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

export function isMongoConnected(): boolean {
  return isConnected;
}
