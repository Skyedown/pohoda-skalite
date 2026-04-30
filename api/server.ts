import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { connectToMongoDB } from './utils/db.js';
import { connectToRabbitMQ, closeRabbitMQ } from './utils/messageQueue.js';
import healthRouter from './endpoints/health.js';
import adminSettingsRouter from './endpoints/adminSettings.js';
import sendOrderEmailsRouter from './endpoints/sendOrderEmails.js';
import ordersRouter from './endpoints/orders.js';
import orderStatsRouter from './endpoints/orderStats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

app.use(healthRouter);
app.use(adminSettingsRouter);
app.use(sendOrderEmailsRouter);
app.use(ordersRouter);
app.use(orderStatsRouter);

async function startServer() {
  try {
    await connectToMongoDB();
  } catch {
    console.warn('⚠️ MongoDB connection failed — continuing without database');
  }

  try {
    await connectToRabbitMQ();
  } catch {
    console.warn(
      '⚠️ RabbitMQ connection failed — continuing without message queue',
    );
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

startServer();

process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});
