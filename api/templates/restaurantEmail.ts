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
      const requiredOptionText =
        item.requiredOption
          ? `<br><small style="color: #666;">${escapeHTML(item.requiredOption.name)}: <strong>${escapeHTML(item.requiredOption.selectedValue)}</strong></small>`
          : '';

      const extrasText =
        item.extras && item.extras.length > 0
          ? `<br><small style="color: #666;">+ ${item.extras
              .map((e) => `${escapeHTML(e.name)} (+${e.price.toFixed(2)}€)`)
              .join(', ')}</small>`
          : '';

      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${escapeHTML(item.name)}</strong>${requiredOptionText}${extrasText}
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

        ${
          order.delivery.notes
            ? `
        <div style="background: #ff6b35; color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 4px solid #d4351c; box-shadow: 0 4px 12px rgba(212, 53, 28, 0.3);">
          <h2 style="margin: 0 0 12px 0; font-size: 22px; color: white; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 10px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            POZNÁMKA OD ZÁKAZNÍKA
          </h2>
          <p style="font-size: 18px; margin: 0; line-height: 1.6; background: rgba(255, 255, 255, 0.95); color: #1f2123; padding: 15px; border-radius: 5px; font-weight: 600; border-left: 6px solid #d4351c;">
            ${escapeHTML(order.delivery.notes)}
          </p>
        </div>
        `
            : ''
        }

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
        </div>

        <p style="margin-top: 30px; text-align: center; color: #666;">
          ID objednávky: #${orderId}
        </p>
      </div>
    </body>
    </html>
  `;
}
