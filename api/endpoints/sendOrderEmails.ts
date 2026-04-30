import { Router } from 'express';
import sgMail from '@sendgrid/mail';
import { sanitizeOrder } from '../utils/sanitize.js';
import { generateCustomerEmail } from '../templates/customerEmail.js';
import { generateRestaurantEmail } from '../templates/restaurantEmail.js';
import { isMongoConnected } from '../utils/db.js';
import {
  getMapyCzUrlForAddress,
  getPostalCodeForCity,
} from '../utils/geocoding.js';
import { publishOrder } from '../utils/messageQueue.js';
import { Order } from '../models/Order.js';

const router = Router();

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

    const sanitizedOrder = sanitizeOrder(order);
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
      replyTo: 'objednavky@pizzapohoda.sk',
      subject: 'Potvrdenie objednávky - Pizza Pohoda',
      html: customerEmailContent,
    };

    const restaurantEmail = {
      to: RESTAURANT_EMAIL,
      from: {
        email: 'noreply@pizzapohoda.sk',
        name: 'Pizza Pohoda',
      },
      subject: `Nová objednávka #${orderId}`,
      html: restaurantEmailContent,
    };

    console.log('📧 Attempting to send emails...');
    console.log('   From:', customerEmail.from);
    console.log('   To Customer:', customerEmail.to);
    console.log('   To Restaurant:', restaurantEmail.to);

    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(restaurantEmail),
    ]);

    console.log('✅ Emails sent successfully!');

    let mapyCzUrl: string | null = null;
    if (
      order.deliveryMethod === 'delivery' &&
      order.delivery?.houseNumber &&
      order.delivery?.city
    ) {
      try {
        console.log('📍 Resolving GPS coordinates for delivery address...');
        mapyCzUrl = await getMapyCzUrlForAddress({
          country: 'Slovensko',
          city: order.delivery.city,
          houseNumber: order.delivery.houseNumber,
          postalCode: getPostalCodeForCity(order.delivery.city),
        });

        if (mapyCzUrl) {
          console.log('✅ Mapy.cz URL generated:', mapyCzUrl);
        } else {
          console.warn('⚠️ Could not resolve GPS coordinates for address');
        }
      } catch (geoError) {
        console.error('❌ Error resolving Mapy.cz URL:', geoError);
      }
    }

    let savedOrderId = null;
    let published = false;

    if (isMongoConnected()) {
      try {
        console.log('💾 Saving customer order to MongoDB...');

        const orderData = {
          items: order.items.map((item: Record<string, unknown>) => ({
            product: {
              id: item.id || (item.product as Record<string, unknown>)?.id,
              name:
                item.name || (item.product as Record<string, unknown>)?.name,
              price:
                item.basePrice ||
                (item.product as Record<string, unknown>)?.price,
              type:
                item.type || (item.product as Record<string, unknown>)?.type,
            },
            quantity: item.quantity,
            extras: item.extras || [],
            totalPrice: item.totalPrice,
            requiredOption: item.requiredOption || undefined,
            removedIngredients: item.removedIngredients || [],
          })),
          delivery: {
            method: order.deliveryMethod || order.delivery?.method,
            fullName: order.delivery?.fullName,
            street: order.delivery?.street,
            houseNumber: order.delivery?.houseNumber,
            city: order.delivery?.city,
            phone: order.delivery?.phone,
            email: order.delivery?.email,
            notes: order.delivery?.notes,
            mapyCzUrl: mapyCzUrl || undefined,
          },
          payment: {
            method: order.paymentMethod || order.payment?.method,
          },
          pricing: order.pricing,
          printed: false,
          createdBy: 'customer',
        };

        const savedOrder = await Order.create(orderData);
        savedOrderId = savedOrder._id;
        console.log('✅ Order saved to MongoDB:', savedOrder._id);

        published = await publishOrder({ _id: savedOrder._id.toString() });

        if (published) {
          console.log('📤 Order published to RabbitMQ:', savedOrder._id);
        } else {
          console.warn('⚠️ Order NOT published to RabbitMQ:', savedOrder._id);
        }
      } catch (dbError) {
        console.error('❌ Failed to save customer order to MongoDB:', dbError);
      }
    } else {
      console.warn(
        '⚠️ MongoDB not connected — customer order not saved to database',
      );
    }

    res.json({
      success: true,
      message: 'Emails sent successfully',
      orderId: savedOrderId,
      published,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = (error as any)?.response?.body;

    console.error('❌ Error sending emails:', errorMessage);
    console.error(
      '📧 SendGrid Response Body:',
      JSON.stringify(errorResponse, null, 2),
    );
    console.error(
      '📮 From Email:',
      process.env.SENDGRID_FROM_EMAIL || 'noreply@pizzapohoda.sk',
    );
    console.error('📨 To Restaurant:', RESTAURANT_EMAIL);

    res.status(500).json({
      error: 'Failed to send emails',
      details: errorMessage,
      sendgridError: errorResponse,
    });
  }
});

export default router;
