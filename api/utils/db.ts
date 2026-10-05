import mongoose from 'mongoose';

export async function connectToMongoDB(): Promise<void> {
  if (isMongoConnected()) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI not set — MongoDB features disabled');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
