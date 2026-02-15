import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeOrder } from './utils/sanitize.js';
import { generateCustomerEmail } from './templates/customerEmail.js';
import { generateRestaurantEmail } from './templates/restaurantEmail.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Restaurant contact info - uses VITE_ prefixed variables (same as frontend)
const RESTAURANT_EMAIL =
  process.env.VITE_RESTAURANT_EMAIL || 'objednavky@pizzapohoda.sk';
const RESTAURANT_PHONE = process.env.VITE_RESTAURANT_PHONE || '+421918175571;';

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin settings file path
const ADMIN_SETTINGS_FILE = path.join(__dirname, 'data', 'adminSettings.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize admin settings file if it doesn't exist
if (!fs.existsSync(ADMIN_SETTINGS_FILE)) {
  const defaultSettings = {
    mode: 'off',
    waitTimeMinutes: 60
  };
  fs.writeFileSync(ADMIN_SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
}

// Get admin settings
app.get('/api/admin-settings', (req, res) => {
  try {
    const data = fs.readFileSync(ADMIN_SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    res.json(settings);
  } catch (error) {
    console.error('Error reading admin settings:', error);
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

// Update admin settings
app.post('/api/admin-settings', (req, res) => {
  try {
    const { mode, waitTimeMinutes, customNote } = req.body;

    // Validate input
    const validModes = ['off', 'disabled', 'waitTime', 'customNote'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    if (typeof waitTimeMinutes !== 'number' || waitTimeMinutes < 0) {
      return res.status(400).json({ error: 'Invalid waitTimeMinutes' });
    }

    if (typeof customNote !== 'string') {
      return res.status(400).json({ error: 'Invalid customNote' });
    }

    if (customNote.length > 500) {
      return res.status(400).json({ error: 'Custom note too long (max 500 characters)' });
    }

    const settings = { mode, waitTimeMinutes, customNote };
    fs.writeFileSync(ADMIN_SETTINGS_FILE, JSON.stringify(settings, null, 2));

    console.log('✅ Admin settings updated:', settings);
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving admin settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Send order confirmation emails
app.post('/api/send-order-emails', async (req, res) => {
  console.log(
    '🚀 Received order email request at:',
    new Date().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' })
  );

  try {
    const { order } = req.body;

    if (!order || !order.delivery || !order.delivery.email) {
      console.error('❌ Invalid order data received');
      return res.status(400).json({ error: 'Invalid order data' });
    }

    console.log('📦 Order details:', {
      email: order.delivery.email,
      total: order.pricing.total,
      items: order.items.length,
    });

    // Sanitize order data to prevent XSS and injection attacks
    const sanitizedOrder = sanitizeOrder(order);

    // Generate customer email content
    const customerEmailContent = generateCustomerEmail(sanitizedOrder, RESTAURANT_EMAIL, RESTAURANT_PHONE);

    // Generate restaurant email content
    const restaurantEmailContent = generateRestaurantEmail(sanitizedOrder);

    // Send email to customer
    const customerEmail = {
      to: order.delivery.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk',
        name: 'Pizza Pohoda'
      },
      replyTo: 'objednavky@pizzapohoda.sk',
      subject: 'Potvrdenie objednávky - Pizza Pohoda',
      html: customerEmailContent,
    };

    // Generate unique order ID from timestamp in Europe/Bratislava timezone
    const orderDate = new Date(order.timestamp);
    const orderId = orderDate.toLocaleString('sk-SK', {
      timeZone: 'Europe/Bratislava',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/[^\d]/g, ''); // Format: YYYYMMDDHHMMSS

    // Send email to restaurant
    const restaurantEmail = {
      to: RESTAURANT_EMAIL,
      from: {
        email: 'noreply@pizzapohoda.sk',
        name: 'Pizza Pohoda'
      },
      subject: `Nová objednávka #${orderId}`,
      html: restaurantEmailContent,
    };

    // Send both emails
    console.log('📧 Attempting to send emails...');
    console.log('   From:', customerEmail.from);
    console.log('   To Customer:', customerEmail.to);
    console.log('   To Restaurant:', restaurantEmail.to);

    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(restaurantEmail),
    ]);

    console.log('✅ Emails sent successfully!');
    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = (error as any)?.response?.body;

    console.error('❌ Error sending emails:', errorMessage);
    console.error(
      '📧 SendGrid Response Body:',
      JSON.stringify(errorResponse, null, 2)
    );
    console.error(
      '📮 From Email:',
      process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk'
    );
    console.error(
      '📨 To Restaurant:',
      RESTAURANT_EMAIL
    );

    res.status(500).json({
      error: 'Failed to send emails',
      details: errorMessage,
      sendgridError: errorResponse,
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
