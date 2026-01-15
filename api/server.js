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

// Send order confirmation emails
app.post('/api/send-order-emails', async (req, res) => {
  console.log(
    '🚀 Received order email request at:',
    new Date().toLocaleString()
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
    const customerEmailContent = generateCustomerEmail(sanitizedOrder);

    // Generate restaurant email content
    const restaurantEmailContent = generateRestaurantEmail(sanitizedOrder);

    // Send email to customer
    const customerEmail = {
      to: order.delivery.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk',
      subject: 'Potvrdenie objednávky - Pizza Pohoda',
      html: customerEmailContent,
    };

    // Send email to restaurant
    const restaurantEmail = {
      to: RESTAURANT_EMAIL,
      from: 'noreply@pizzapohoda.sk',
      subject: `Nová objednávka #${order.timestamp.slice(0, 10)}`,
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
  } catch (error) {
    console.error('❌ Error sending emails:', error.message);
    console.error(
      '📧 SendGrid Response Body:',
      JSON.stringify(error.response?.body, null, 2)
    );
    console.error(
      '📮 From Email:',
      process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk'
    );
    console.error(
      '📨 To Emails:',
      order.delivery.email,
      'and',
      RESTAURANT_EMAIL
    );

    res.status(500).json({
      error: 'Failed to send emails',
      details: error.message,
      sendgridError: error.response?.body,
    });
  }
});

// Generate customer confirmation email
function generateCustomerEmail(order) {
  const itemsList = order.items
    .map((item) => {
      const extrasText =
        item.extras && item.extras.length > 0
          ? `<br><small style="color: #634832; margin-top: 4px; display: block;">+ ${item.extras
              .map((e) => `${escapeHTML(e.name)} (+${e.price.toFixed(2)}€)`)
              .join(', ')}</small>`
          : '';

      return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f0ebe4;">
          <strong style="color: #1f2123; font-size: 15px;">${escapeHTML(
            item.name
          )}</strong>${extrasText}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f0ebe4; text-align: center; color: #634832;">${
          item.quantity
        }×</td>
        <td style="padding: 12px; border-bottom: 1px solid #f0ebe4; text-align: right; font-weight: 600; color: #1f2123;">${item.totalPrice.toFixed(
          2
        )} €</td>
      </tr>
    `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Roboto', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2123;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          color: white;
          text-align: center;
        }
        .header img.logo {
          height: 60px;
          margin: 0 auto 15px auto;
          display: block;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: 700;
        }
        .header p {
          margin: 0;
          font-size: 16px;
          opacity: 0.95;
        }
        .content {
          background-color: #fbefe0;
          padding: 30px 20px;
        }
        .content h2 {
          color: #634832;
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .content h3 {
          color: #634832;
          margin: 25px 0 15px 0;
          font-size: 18px;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }
        .order-table thead {
          background-color: #634832;
          color: white;
        }
        .order-table th {
          padding: 12px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .summary {
          background-color: #fff;
          padding: 20px;
          margin-top: 20px;
          border-radius: 8px;
          border-left: 4px solid #e17c2f;
        }
        .summary p {
          margin: 8px 0;
          font-size: 15px;
        }
        .total-price {
          font-size: 22px !important;
          color: #e17c2f !important;
          margin-top: 15px !important;
          padding-top: 15px;
          border-top: 2px solid #f0ebe4;
        }
        .delivery-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .contact-box {
          background: #634832;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          text-align: center;
        }
        .contact-box p {
          margin: 8px 0;
        }
        .contact-box a {
          color: #ffd93f;
          text-decoration: none;
          font-weight: 600;
        }
        .icon-inline {
          width: 20px;
          height: 20px;
          vertical-align: middle;
          margin-right: 8px;
        }
        .footer {
          background-color: #634832;
          text-align: center;
          padding: 25px 20px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer a {
          color: #ffd93f;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://pizzapohoda.sk/images/logo-social.png" alt="Pizza Pohoda Logo" class="logo" style="height: 80px; max-height: 80px; width: auto; margin: 0 auto; display: block;">
          <h1>Pizza Pohoda</h1>
          <p>Ďakujeme za vašu objednávku!</p>
        </div>

        <div class="content">
          <h2>Potvrdenie objednávky</h2>
          <p>Vaša objednávka bola úspešne prijatá a je v príprave. Tešíme sa, že vás čoskoro obsúžime!</p>

          <h3><img src="https://pizzapohoda.sk/icons/list.png" alt="" class="icon-inline">Objednané položky:</h3>
          <table class="order-table">
            <thead>
              <tr>
                <th style="text-align: left;">Položka</th>
                <th style="text-align: center; width: 80px;">Počet</th>
                <th style="text-align: right; width: 100px;">Cena</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div class="summary">
            <p><strong>Medzisúčet:</strong> <span style="float: right;">${order.pricing.subtotal.toFixed(
              2
            )} €</span></p>
            <p><strong>Doprava:</strong> <span style="float: right;">${order.pricing.delivery.toFixed(
              2
            )} €</span></p>
            <p class="total-price"><strong>Celkom:</strong> <span style="float: right;">${order.pricing.total.toFixed(
              2
            )} €</span></p>
          </div>

          <h3><img src="https://pizzapohoda.sk/icons/location.png" alt="" class="icon-inline">${
            order.deliveryMethod === 'pickup'
              ? 'Vyzdvihnutie v reštaurácii'
              : 'Adresa doručenia'
          }:</h3>
          <div class="delivery-info">
            <p style="margin: 5px 0;"><strong>Meno:</strong> ${escapeHTML(
              order.delivery.fullName
            )}</p>
            ${
              order.deliveryMethod === 'delivery'
                ? `<p style="margin: 5px 0;"><strong>Adresa:</strong> ${escapeHTML(
                    order.delivery.street
                  )}, ${escapeHTML(order.delivery.city)}</p>`
                : ''
            }
            <p style="margin: 5px 0;"><img src="https://pizzapohoda.sk/icons/phone.png" alt="" class="icon-inline">${escapeHTML(
              order.delivery.phone
            )}</p>
            ${
              order.delivery.notes
                ? `<p style="margin: 15px 0 5px 0; padding-top: 15px; border-top: 1px solid #f0ebe4;"><em style="color: #634832;">Poznámka: ${escapeHTML(
                    order.delivery.notes
                  )}</em></p>`
                : ''
            }
          </div>

          <p><strong><img src="https://pizzapohoda.sk/icons/card.png" alt="" class="icon-inline">Spôsob platby:</strong> ${
            order.deliveryMethod === 'pickup'
              ? order.paymentMethod === 'cash'
                ? 'Hotovosť pri vyzdvihnutí'
                : 'Karta pri vyzdvihnutí'
              : order.paymentMethod === 'cash'
              ? 'Hotovosť pri dodaní'
              : 'Karta pri dodaní'
          }</p>

          <div class="contact-box">
            <p style="margin-bottom: 12px; font-size: 16px;"><strong>Máte otázky?</strong></p>
            <p><img src="https://pizzapohoda.sk/icons/mail.png" alt="" class="icon-inline"><a href="mailto:${RESTAURANT_EMAIL}">${RESTAURANT_EMAIL}</a></p>
            <p><img src="https://pizzapohoda.sk/icons/phone-orange.png" alt="" class="icon-inline"><a href="tel:${RESTAURANT_PHONE}">${RESTAURANT_PHONE}</a></p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Pizza Pohoda</strong></p>
          <p>Skalité 1386, 023 14 Skalité, Kysuce</p>
          <p>
            <a href="mailto:${RESTAURANT_EMAIL}">${RESTAURANT_EMAIL}</a> |
            <a href="tel:${RESTAURANT_PHONE}">${RESTAURANT_PHONE}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate restaurant notification email
function generateRestaurantEmail(order) {
  const itemsList = order.items
    .map((item) => {
      const extrasText =
        item.extras && item.extras.length > 0
          ? `<br><small style="color: #666;">+ ${item.extras
              .map((e) => `${escapeHTML(e.name)} (+${e.price.toFixed(2)}€)`)
              .join(', ')}</small>`
          : '';

      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${escapeHTML(item.name)}</strong>${extrasText}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
          item.quantity
        }x</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.basePrice.toFixed(
          2
        )} €</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.totalPrice.toFixed(
          2
        )} €</td>
      </tr>
    `;
    })
    .join('');

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
          <p>Čas objednávky: ${new Date(order.timestamp).toLocaleString(
            'sk-SK'
          )}</p>
        </div>

        <div class="urgent">
          CELKOVÁ SUMA: ${order.pricing.total.toFixed(2)} € | PLATBA: ${
    order.paymentMethod === 'cash' ? 'HOTOVOSŤ' : 'KARTA'
  }
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
              <td style="padding: 10px; text-align: right;"><strong>${order.pricing.subtotal.toFixed(
                2
              )} €</strong></td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;">Doprava:</td>
              <td style="padding: 10px; text-align: right;">${order.pricing.delivery.toFixed(
                2
              )} €</td>
            </tr>
            <tr style="background-color: #d4351c; color: white; font-size: 16px;">
              <td colspan="3" style="padding: 15px; text-align: right;"><strong>CELKOM:</strong></td>
              <td style="padding: 15px; text-align: right;"><strong>${order.pricing.total.toFixed(
                2
              )} €</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="delivery-info">
          <h3><img src="https://pizzapohoda.sk/icons/location.png" alt="" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">${
            order.deliveryMethod === 'pickup'
              ? 'VYZDVIHNUTIE V REŠTAURÁCII'
              : 'ADRESA DORUČENIA'
          }:</h3>
          <p style="font-size: 16px;">
            <strong>Meno:</strong> ${escapeHTML(order.delivery.fullName)}
            ${
              order.deliveryMethod === 'delivery'
                ? `<br><strong>Adresa:</strong> ${escapeHTML(
                    order.delivery.street
                  )}, ${escapeHTML(order.delivery.city)}`
                : ''
            }
          </p>

          <h3><img src="https://pizzapohoda.sk/icons/phone.png" alt="" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">KONTAKT:</h3>
          <p style="font-size: 16px;">
            <strong>Telefón:</strong> ${escapeHTML(order.delivery.phone)}<br>
            <strong>Email:</strong> ${escapeHTML(order.delivery.email)}
          </p>

          <h3><img src="https://pizzapohoda.sk/icons/card.png" alt="" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">PLATBA:</h3>
          <p style="font-size: 16px;">
            <strong>${
              order.deliveryMethod === 'pickup'
                ? order.paymentMethod === 'cash'
                  ? 'Hotovosť pri vyzdvihnutí'
                  : 'Karta pri vyzdvihnutí'
                : order.paymentMethod === 'cash'
                ? 'Hotovosť pri dodaní'
                : 'Karta pri dodaní'
            }</strong>
          </p>

          ${
            order.delivery.notes
              ? `
            <h3>📝 POZNÁMKA OD ZÁKAZNÍKA:</h3>
            <p style="font-size: 16px; background: white; padding: 10px; border-radius: 5px;">
              <strong>${escapeHTML(order.delivery.notes)}</strong>
            </p>
          `
              : ''
          }
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
