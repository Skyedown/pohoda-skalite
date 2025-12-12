import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { sanitizeOrder, escapeHTML } from './utils/sanitize.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Restaurant contact info - uses VITE_ prefixed variables (same as frontend)
const RESTAURANT_EMAIL = process.env.VITE_RESTAURANT_EMAIL || 'pohoda.skalite@example.com';
const RESTAURANT_PHONE = process.env.VITE_RESTAURANT_PHONE || '+421948293923';

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Send order confirmation emails
app.post('/api/send-order-emails', async (req, res) => {
  try {
    const { order } = req.body;

    if (!order || !order.delivery || !order.delivery.email) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    // Sanitize order data to prevent XSS and injection attacks
    const sanitizedOrder = sanitizeOrder(order);

    // Generate customer email content
    const customerEmailContent = generateCustomerEmail(sanitizedOrder);

    // Generate restaurant email content
    const restaurantEmailContent = generateRestaurantEmail(sanitizedOrder);

    // Send email to customer
    const customerEmail = {
      to: order.delivery.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@pohodaskalite.sk',
      subject: 'Potvrdenie objednávky - Pohoda Skalité',
      html: customerEmailContent,
    };

    // Send email to restaurant
    const restaurantEmail = {
      to: RESTAURANT_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@pohodaskalite.sk',
      subject: `Nová objednávka #${order.timestamp.slice(0, 10)}`,
      html: restaurantEmailContent,
    };

    // Send both emails
    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(restaurantEmail)
    ]);

    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({
      error: 'Failed to send emails',
      details: error.message
    });
  }
});

// Generate customer confirmation email
function generateCustomerEmail(order) {
  const itemsList = order.items.map(item => {
    const extrasText = item.extras && item.extras.length > 0
      ? `<br><small style="color: #666;">+ ${item.extras.map(e => escapeHTML(e.name)).join(', ')}</small>`
      : '';

    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${escapeHTML(item.name)}</strong> (${escapeHTML(item.size)})${extrasText}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}x</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.totalPrice.toFixed(2)} €</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d4351c; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        .summary { background-color: #fff; padding: 15px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pohoda Skalité</h1>
          <p>Ďakujeme za vašu objednávku!</p>
        </div>

        <div class="content">
          <h2>Potvrdenie objednávky</h2>
          <p>Vaša objednávka bola úspešne prijatá a je v príprave.</p>

          <h3>Objednané položky:</h3>
          <table class="order-table">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">Položka</th>
                <th style="padding: 10px; text-align: center;">Počet</th>
                <th style="padding: 10px; text-align: right;">Cena</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div class="summary">
            <p><strong>Medzisúčet:</strong> ${order.pricing.subtotal.toFixed(2)} €</p>
            <p><strong>Doprava:</strong> ${order.pricing.delivery.toFixed(2)} €</p>
            <p style="font-size: 18px; color: #d4351c;"><strong>Celkom:</strong> ${order.pricing.total.toFixed(2)} €</p>
          </div>

          <h3>Adresa doručenia:</h3>
          <p>
            ${escapeHTML(order.delivery.street)}<br>
            ${escapeHTML(order.delivery.city)}<br>
            Tel: ${escapeHTML(order.delivery.phone)}
            ${order.delivery.notes ? `<br><em>Poznámka: ${escapeHTML(order.delivery.notes)}</em>` : ''}
          </p>

          <p><strong>Spôsob platby:</strong> ${order.paymentMethod === 'cash' ? 'Hotovosť pri dodaní' : 'Karta pri dodaní'}</p>

          <p style="margin-top: 30px;">
            V prípade otázok nás neváhajte kontaktovať.<br>
            Tešíme sa na vás!
          </p>
        </div>

        <div class="footer">
          <p>Pohoda Skalité | Skalité, Kysuce</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate restaurant notification email
function generateRestaurantEmail(order) {
  const itemsList = order.items.map(item => {
    const extrasText = item.extras && item.extras.length > 0
      ? `<br><small style="color: #666;">+ ${item.extras.map(e => `${escapeHTML(e.name)} (+${e.price.toFixed(2)}€)`).join(', ')}</small>`
      : '';

    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${escapeHTML(item.name)}</strong> (${escapeHTML(item.size)})${extrasText}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}x</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.basePrice.toFixed(2)} €</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.totalPrice.toFixed(2)} €</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2c3e50; color: white; padding: 20px; }
        .urgent { background-color: #d4351c; color: white; padding: 15px; margin: 20px 0; font-size: 18px; text-align: center; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .delivery-info { background-color: #fffbf0; padding: 15px; border-left: 4px solid #ffa500; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NOVÁ OBJEDNÁVKA</h1>
          <p>Čas objednávky: ${new Date(order.timestamp).toLocaleString('sk-SK')}</p>
        </div>

        <div class="urgent">
          CELKOVÁ SUMA: ${order.pricing.total.toFixed(2)} € | PLATBA: ${order.paymentMethod === 'cash' ? 'HOTOVOSŤ' : 'KARTA'}
        </div>

        <h2>Objednané položky:</h2>
        <table class="order-table">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; text-align: left;">Položka</th>
              <th style="padding: 10px; text-align: center;">Počet</th>
              <th style="padding: 10px; text-align: right;">Jedn. cena</th>
              <th style="padding: 10px; text-align: right;">Spolu</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9;">
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Medzisúčet:</strong></td>
              <td style="padding: 10px; text-align: right;"><strong>${order.pricing.subtotal.toFixed(2)} €</strong></td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;">Doprava:</td>
              <td style="padding: 10px; text-align: right;">${order.pricing.delivery.toFixed(2)} €</td>
            </tr>
            <tr style="background-color: #d4351c; color: white; font-size: 16px;">
              <td colspan="3" style="padding: 15px; text-align: right;"><strong>CELKOM:</strong></td>
              <td style="padding: 15px; text-align: right;"><strong>${order.pricing.total.toFixed(2)} €</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="delivery-info">
          <h3>📍 ADRESA DORUČENIA:</h3>
          <p style="font-size: 16px;">
            <strong>${escapeHTML(order.delivery.street)}</strong><br>
            <strong>${escapeHTML(order.delivery.city)}</strong>
          </p>

          <h3>📞 KONTAKT:</h3>
          <p style="font-size: 16px;">
            <strong>Telefón:</strong> ${escapeHTML(order.delivery.phone)}<br>
            <strong>Email:</strong> ${escapeHTML(order.delivery.email)}
          </p>

          ${order.delivery.notes ? `
            <h3>📝 POZNÁMKA OD ZÁKAZNÍKA:</h3>
            <p style="font-size: 16px; background: white; padding: 10px; border-radius: 5px;">
              <strong>${escapeHTML(order.delivery.notes)}</strong>
            </p>
          ` : ''}
        </div>

        <p style="margin-top: 30px; text-align: center; color: #666;">
          ID objednávky: ${order.timestamp}
        </p>
      </div>
    </body>
    </html>
  `;
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
