import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { connectToMongoDB } from './utils/db.js';
import { connectToRabbitMQ, closeRabbitMQ } from './utils/messageQueue.js';
import { requireAuth, seedFirstAdmin } from './utils/auth.js';
import healthRouter from './endpoints/health.js';
import authRouter from './endpoints/auth.js';
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

// Both storefronts are same-origin with the API in production (nginx proxies
// /api), so this list only matters for local development and for keeping
// credentialed requests from anywhere else out.
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ??
  'https://pizzapohoda.sk,https://www.pizzapohoda.sk,https://pizzapohoda.pl,https://www.pizzapohoda.pl,http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin and server-to-server requests send no Origin header.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin not allowed: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(healthRouter);
app.use(authRouter);

// Everything under /api/orders is admin-only: the order list, the customer
// lookup and the statistics all expose personal data, and the write routes can
// change or delete orders. Customers never touch these — checkout goes through
// /api/send-order-emails. Mounted before the routers so it covers every route
// they define, including /api/orders/stats.
app.use('/api/orders', requireAuth);

app.use(adminSettingsRouter);
app.use(sendOrderEmailsRouter);
app.use(ordersRouter);
app.use(orderStatsRouter);

async function startServer() {
  try {
    await connectToMongoDB();
    await seedFirstAdmin();
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed — continuing without database');
    console.warn(error);
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
