/**
 * Restaurant notification email template
 */

import { escapeHTML } from '../utils/sanitize.js';
import type { SanitizedOrder } from '../types.js';

/**
 * Generate restaurant notification email
 * @param order - Sanitized order object
 * @returns HTML email content
 */
export function generateRestaurantEmail(order: SanitizedOrder): string {
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
            'sk-SK',
            { timeZone: 'Europe/Bratislava' }
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
              order.paymentMethod === 'cash' ? 'V hotovosti' : 'Kartou'
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
          ID objednávky: #${orderId}
        </p>
      </div>
    </body>
    </html>
  `;
}
