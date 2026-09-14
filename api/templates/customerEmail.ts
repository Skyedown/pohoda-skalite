import { escapeHTML } from '../utils/sanitize.js';
import {
  formatAddress,
  formatMoney,
  formatMoneyWithEur,
} from '../utils/tenant.js';
import { CUSTOMER_EMAIL_COPY } from './emailCopy.js';
import type { SanitizedOrder } from '../types.js';

export function generateCustomerEmail(
  order: SanitizedOrder,
  restaurantEmail: string,
  restaurantPhone: string,
): string {
  const copy = CUSTOMER_EMAIL_COPY[order.tenant];
  // Amounts are stored in euros; the customer is shown what was on screen.
  const displayCurrency = order.displayCurrency ?? order.currency;
  const pricingDisplay = order.pricingDisplay ?? order.pricing;
  const money = (amount: number) => formatMoney(amount, displayCurrency);

  const itemsList = order.items
    .map((item) => {
      const extrasText =
        item.extras && item.extras.length > 0
          ? `<br><small style="color: #634832; margin-top: 4px; display: block;">+ ${item.extras
              .map(
                (e) =>
                  `${escapeHTML(e.nameLocalized ?? e.name)} (+${money(
                    e.priceDisplay ?? e.price,
                  )})`,
              )
              .join(', ')}</small>`
          : '';

      const removed =
        item.removedIngredientsLocalized ?? item.removedIngredients ?? [];
      const removedIngredientsText = removed.length
        ? `<br><small style="color: #e74c3c; margin-top: 4px; display: block;">${copy.without}: ${removed
            .map((i: string) => escapeHTML(i))
            .join(', ')}</small>`
        : '';

      return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f0ebe4;">
          <strong style="color: #1f2123; font-size: 15px;">${escapeHTML(
            item.nameLocalized ?? item.name,
          )}</strong>${extrasText}${removedIngredientsText}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f0ebe4; text-align: center; color: #634832;">${
          item.quantity
        }×</td>
        <td style="padding: 12px; border-bottom: 1px solid #f0ebe4; text-align: right; font-weight: 600; color: #1f2123;">${money(
          item.totalPriceDisplay ?? item.totalPrice,
        )}</td>
      </tr>
    `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="${order.tenant}">
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
        .terminal-note {
          margin-top: 12px;
          padding: 12px 16px;
          background: #fff;
          border-left: 4px solid #e17c2f;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.5;
          color: #634832;
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
          <h1>${copy.heading}</h1>
          <p>${copy.thanks}</p>
        </div>

        <div class="content">
          <h2>${copy.confirmationTitle}</h2>
          <p>${copy.confirmationBody}</p>

          <h3><img src="https://pizzapohoda.sk/icons/list.png" alt="" class="icon-inline">${copy.itemsHeading}</h3>
          <table class="order-table">
            <thead>
              <tr>
                <th style="text-align: left;">${copy.columnItem}</th>
                <th style="text-align: center; width: 80px;">${copy.columnCount}</th>
                <th style="text-align: right; width: 100px;">${copy.columnPrice}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div class="summary">
            <p><strong>${copy.subtotal}</strong> <span style="float: right;">${money(
              pricingDisplay.subtotal,
            )}</span></p>
            <p><strong>${copy.delivery}</strong> <span style="float: right;">${money(
              pricingDisplay.delivery,
            )}</span></p>
            <p class="total-price"><strong>${copy.total}</strong> <span style="float: right;">${formatMoneyWithEur(
              pricingDisplay.total,
              order.pricing.total,
              displayCurrency,
            )}</span></p>
          </div>

          ${
            displayCurrency === 'EUR'
              ? ''
              : `<p class="terminal-note">${copy.terminalNote}</p>`
          }

          <h3><img src="https://pizzapohoda.sk/icons/location.png" alt="" class="icon-inline">${
            order.deliveryMethod === 'pickup'
              ? copy.addressHeadingPickup
              : copy.addressHeadingDelivery
          }:</h3>
          <div class="delivery-info">
            <p style="margin: 5px 0;"><strong>${copy.name}</strong> ${escapeHTML(
              order.delivery.fullName,
            )}</p>
            ${
              order.deliveryMethod === 'delivery'
                ? `<p style="margin: 5px 0;"><strong>${copy.address}</strong> ${escapeHTML(
                    formatAddress(order.delivery),
                  )}</p>`
                : ''
            }
            <p style="margin: 5px 0;"><img src="https://pizzapohoda.sk/icons/phone.png" alt="" class="icon-inline">${escapeHTML(
              order.delivery.phone,
            )}</p>
            <p style="margin: 5px 0;"><img src="https://pizzapohoda.sk/icons/mail.png" alt="" class="icon-inline">${escapeHTML(
              order.delivery.email,
            )}</p>
            ${
              order.delivery.notes
                ? `<p style="margin: 15px 0 5px 0; padding-top: 15px; border-top: 1px solid #f0ebe4;"><em style="color: #634832;">${copy.note} ${escapeHTML(
                    order.delivery.notes,
                  )}</em></p>`
                : ''
            }
          </div>

          <p><strong><img src="https://pizzapohoda.sk/icons/card.png" alt="" class="icon-inline">${copy.paymentLabel}</strong> ${
            order.paymentMethod === 'cash' ? copy.paymentCash : copy.paymentCard
          }</p>

          <div class="contact-box">
            <p style="margin-bottom: 12px; font-size: 16px;"><strong>${copy.questions}</strong></p>
            <p><img src="https://pizzapohoda.sk/icons/mail.png" alt="" class="icon-inline"><a href="mailto:${restaurantEmail}">${restaurantEmail}</a></p>
            <p><img src="https://pizzapohoda.sk/icons/phone-orange.png" alt="" class="icon-inline"><a href="tel:${restaurantPhone}">${restaurantPhone}</a></p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Pizza Pohoda</strong></p>
          <p>${copy.footerAddress}</p>
          <p>
            <a href="mailto:${restaurantEmail}">${restaurantEmail}</a> |
            <a href="tel:${restaurantPhone}">${restaurantPhone}</a>
          </p>
          <p>
            <a href="${copy.termsUrl}">${copy.terms}</a> |
            <a href="${copy.privacyUrl}">${copy.privacy}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
