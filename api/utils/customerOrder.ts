import { buildTicketCode } from './ticketCode.js';
import type { Tenant } from './tenant.js';

export interface CustomerOrderPayload {
  items: Record<string, unknown>[];
  delivery?: {
    method?: string;
    fullName?: string;
    street?: string;
    houseNumber?: string;
    city?: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  deliveryMethod?: string;
  paymentMethod?: string;
  payment?: { method?: string };
  pricing: unknown;
  pricingDisplay?: unknown;
}

export function buildCustomerOrderDocument(
  order: CustomerOrderPayload,
  tenant: Tenant,
  displayCurrency: string,
  mapyCzUrl: string | null,
) {
  // `name` is the canonical Slovak wording so the printer and the admin
  // stay Slovak; the customer-facing text is kept beside it.
  return {
    tenant,
    currency: 'EUR',
    displayCurrency,
    pricingDisplay: order.pricingDisplay || order.pricing,
    ticketCode: buildTicketCode(
      tenant,
      order.deliveryMethod || order.delivery?.method,
      order.delivery?.city,
    ),
    items: order.items.map((item) => ({
      product: {
        id: item.id || (item.product as Record<string, unknown>)?.id,
        name: item.name || (item.product as Record<string, unknown>)?.name,
        nameLocalized: item.nameLocalized,
        price:
          item.basePrice || (item.product as Record<string, unknown>)?.price,
        priceDisplay: item.basePriceDisplay ?? item.basePrice,
        type: item.type || (item.product as Record<string, unknown>)?.type,
      },
      quantity: item.quantity,
      extras: item.extras || [],
      totalPrice: item.totalPrice,
      totalPriceDisplay: item.totalPriceDisplay ?? item.totalPrice,
      requiredOption: item.requiredOption || undefined,
      removedIngredients: item.removedIngredients || [],
      removedIngredientsLocalized: item.removedIngredientsLocalized || [],
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
}
