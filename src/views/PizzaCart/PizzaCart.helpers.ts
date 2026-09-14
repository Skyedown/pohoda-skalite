import type { CartFormData } from '../../utils/sanitize';
import type { CartItem, DeliveryMethod } from '../../types';
import type { Currency, Locale } from '../../i18n/types';
import type { TranslationKey } from '../../i18n/sk';
import { validateEmail, validatePhone } from '../../utils/validation';

type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

/** Polish addresses carry a street name; Slovak village addresses do not. */
export function requiresStreet(locale: Locale): boolean {
  return locale === 'pl';
}

export function validateCartForm(
  formData: CartFormData,
  deliveryMethod: DeliveryMethod,
  locale: Locale,
  t: Translate,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.fullName.trim()) {
    errors.fullName = t('validation_fullname_required');
  }

  if (deliveryMethod === 'delivery') {
    if (requiresStreet(locale) && !formData.street.trim()) {
      errors.street = t('validation_street_required');
    }
    if (!formData.houseNumber.trim()) {
      errors.houseNumber = t('validation_house_required');
    }
    if (!formData.city.trim()) {
      errors.city = t('validation_city_required');
    }
  }

  if (!formData.phone.trim()) {
    errors.phone = t('validation_phone_required');
  } else if (!validatePhone(formData.phone, locale)) {
    errors.phone = t('validation_phone_invalid');
  }

  if (!formData.email.trim()) {
    errors.email = t('validation_email_required');
  } else if (!validateEmail(formData.email)) {
    errors.email = t('validation_email_invalid');
  }

  return errors;
}

export function scrollToFirstError(errors: Record<string, string>): void {
  const fieldOrder = [
    'fullName',
    'city',
    'street',
    'houseNumber',
    'phone',
    'email',
  ];
  const firstErrorField = fieldOrder.find((field) => errors[field]);
  if (!firstErrorField) return;

  setTimeout(() => {
    const element = document.querySelector(
      `[name="${firstErrorField}"]`,
    ) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

interface OrderPayloadInput {
  cart: CartItem[];
  formData: CartFormData;
  deliveryMethod: DeliveryMethod;
  paymentMethod: 'cash' | 'card';
  subtotal: number;
  delivery: number;
  total: number;
  subtotalEur: number;
  deliveryEur: number;
  totalEur: number;
  locale: Locale;
  currency: Currency;
}

/**
 * Everything stored is in euros — that is the currency the payment terminal
 * charges, so it is the real value of the order. The zloty amounts the Polish
 * customer saw travel alongside under `*Display` and are only ever shown, never
 * summed. `name` stays Slovak for the same reason: the kitchen ticket, the
 * admin and the product analytics must read the same across both storefronts.
 */
export function buildOrderPayload({
  cart,
  formData,
  deliveryMethod,
  paymentMethod,
  subtotal,
  delivery,
  total,
  subtotalEur,
  deliveryEur,
  totalEur,
  locale,
  currency,
}: OrderPayloadInput) {
  return {
    items: cart.map((item) => ({
      id: item.product.id,
      name: item.product.nameSk,
      nameLocalized: item.product.name,
      type: item.product.type,
      quantity: item.quantity,
      basePrice: item.product.priceEur,
      basePriceDisplay: item.product.price,
      extras:
        item.extras?.map((e) => ({
          id: e.id,
          name: e.nameSk,
          nameLocalized: e.name,
          price: e.priceEur,
          priceDisplay: e.price,
        })) || [],
      extrasPrice: item.extrasPrice || 0,
      totalPrice: item.totalPriceEur,
      totalPriceDisplay: item.totalPrice,
      removedIngredients: item.removedIngredientsSk || [],
      removedIngredientsLocalized: item.removedIngredients || [],
    })),
    pricing: {
      subtotal: subtotalEur,
      delivery: deliveryEur,
      total: totalEur,
    },
    // What the Polish customer saw on screen. Display only.
    pricingDisplay: { subtotal, delivery, total },
    deliveryMethod,
    delivery: {
      fullName: formData.fullName,
      street: formData.street || '',
      houseNumber: formData.houseNumber || '',
      city: formData.city || '',
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
    },
    paymentMethod,
    tenant: locale,
    locale,
    // The terminal settles in euros on both storefronts.
    currency: 'EUR' as const,
    displayCurrency: currency,
    timestamp: new Date().toISOString(),
  };
}
