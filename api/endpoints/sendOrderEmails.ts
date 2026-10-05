import { Router } from 'express';
import sgMail from '@sendgrid/mail';
import { sanitizeOrder } from '../utils/sanitize.js';
import { generateCustomerEmail } from '../templates/customerEmail.js';
import { generateRestaurantEmail } from '../templates/restaurantEmail.js';
import { isMongoConnected } from '../utils/db.js';
import { getMapyCzUrlForAddress } from '../utils/geocoding.js';
import {
  countryFor,
  currencyFor,
  postalCodeFor,
  toTenant,
  type Tenant,
} from '../utils/tenant.js';
import { CUSTOMER_EMAIL_COPY } from '../templates/emailCopy.js';
import {
  buildCustomerOrderDocument,
  type CustomerOrderPayload,
} from '../utils/customerOrder.js';
import { publishOrder } from '../utils/messageQueue.js';
import { Order } from '../models/Order.js';

const router = Router();

async function resolveMapyCzUrl(
  order: CustomerOrderPayload,
  tenant: Tenant,
): Promise<string | null> {
  const { delivery } = order;
  if (
    order.deliveryMethod !== 'delivery' ||
    !delivery?.houseNumber ||
    !delivery.city
  ) {
    return null;
  }

  try {
    const url = await getMapyCzUrlForAddress({
      country: countryFor(tenant),
      city: delivery.city,
      street: delivery.street || undefined,
      houseNumber: delivery.houseNumber,
      postalCode: postalCodeFor(tenant, delivery.city),
    });
    if (!url) console.warn('⚠️ Could not resolve GPS coordinates for address');
    return url;
  } catch (geoError) {
    console.error('❌ Error resolving Mapy.cz URL:', geoError);
    return null;
  }
}

function logEmailFailure(
  recipient: 'customer' | 'restaurant',
  result: PromiseSettledResult<unknown>,
): void {
  if (result.status === 'fulfilled') {
    console.log(`✅ ${recipient} email sent`);
    return;
  }
  const reason: unknown = result.reason;
  const message = reason instanceof Error ? reason.message : String(reason);
  const body = (reason as { response?: { body?: unknown } })?.response?.body;
  console.error(`❌ ${recipient} email failed:`, message, JSON.stringify(body));
}

const RESTAURANT_EMAIL =
  process.env.VITE_RESTAURANT_EMAIL || 'objednavky@pizzapohoda.sk';
const RESTAURANT_PHONE = process.env.VITE_RESTAURANT_PHONE || '+421918175571';

router.post('/api/send-order-emails', async (req, res) => {
  console.log(
    '🚀 Received order email request at:',
    new Date().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' }),
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

    const tenant = toTenant(order.tenant);
    // Stored amounts are euros on both storefronts; the zloty figures the
    // Polish customer saw ride along for display.
    const displayCurrency = order.displayCurrency || currencyFor(tenant);
    const sanitizedOrder = sanitizeOrder({
      ...order,
      tenant,
      currency: 'EUR',
      displayCurrency,
    });
    const copy = CUSTOMER_EMAIL_COPY[tenant];
    const customerEmailContent = generateCustomerEmail(
      sanitizedOrder,
      RESTAURANT_EMAIL,
      RESTAURANT_PHONE,
    );
    const restaurantEmailContent = generateRestaurantEmail(sanitizedOrder);

    const orderDate = new Date(order.timestamp);
    const orderId = orderDate
      .toLocaleString('sk-SK', {
        timeZone: 'Europe/Bratislava',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/[^\d]/g, '');

    const customerEmail = {
      to: order.delivery.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk',
        name: 'Pizza Pohoda',
      },
      replyTo: RESTAURANT_EMAIL,
      subject: copy.subject,
      html: customerEmailContent,
    };

    const restaurantEmail = {
      to: RESTAURANT_EMAIL,
      from: {
        email: 'noreply@pizzapohoda.sk',
        name: 'Pizza Pohoda',
      },
      subject: `${tenant === 'pl' ? '🇵🇱 PL — ' : ''}Nová objednávka #${orderId}`,
      html: restaurantEmailContent,
    };

    const mapyCzUrl = await resolveMapyCzUrl(order, tenant);

    if (!isMongoConnected()) {
      console.error('❌ MongoDB not connected — order rejected');
      return res.status(503).json({ error: 'Order could not be received' });
    }

    // The kitchen works only from tickets printed out of the database, so an
    // order that is not saved has not been received, whatever the emails do.
    let savedOrderId: string;
    try {
      const savedOrder = await Order.create(
        buildCustomerOrderDocument(order, tenant, displayCurrency, mapyCzUrl),
      );
      savedOrderId = savedOrder._id.toString();
      console.log('✅ Order saved to MongoDB:', savedOrderId);
    } catch (dbError) {
      console.error('❌ Failed to save customer order to MongoDB:', dbError);
      return res.status(503).json({ error: 'Order could not be received' });
    }

    const published = await publishOrder({ _id: savedOrderId });
    if (published) {
      console.log('📤 Order published to RabbitMQ:', savedOrderId);
    } else {
      console.warn('⚠️ Order NOT published to RabbitMQ:', savedOrderId);
    }

    const [customerResult, restaurantResult] = await Promise.allSettled([
      sgMail.send(customerEmail),
      sgMail.send(restaurantEmail),
    ]);
    logEmailFailure('customer', customerResult);
    logEmailFailure('restaurant', restaurantResult);

    res.status(201).json({
      success: true,
      orderId: savedOrderId,
      published,
      customerEmailSent: customerResult.status === 'fulfilled',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error processing order:', errorMessage);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

export default router;
