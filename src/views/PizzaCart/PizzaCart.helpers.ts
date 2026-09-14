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
  gdprConsent: boolean,
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

  if (!gdprConsent) {
    errors.gdprConsent = t('validation_gdpr_required');
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
    'gdprConsent',
  ];
  const firstErrorField = fieldOrder.find((field) => errors[field]);
  if (!firstErrorField) return;

  setTimeout(() => {
    const element = document.querySelector(
      `[name="${firstErrorField}"]`,
    ) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    } else if (firstErrorField === 'gdprConsent') {
      const gdprElement = document.querySelector(
        '.gdpr-consent',
      ) as HTMLElement;
      gdprElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  locale: Locale;
  currency: Currency;
}

/**
 * `name` stays Slovak on purpose: the kitchen ticket, the admin and the product
 * analytics all read it, and they must be identical across both storefronts.
 * The customer-facing wording travels alongside in `nameLocalized`.
 */
export function buildOrderPayload({
  cart,
  formData,
  deliveryMethod,
  paymentMethod,
  subtotal,
  delivery,
  total,
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
      basePrice: item.product.price,
      extras:
        item.extras?.map((e) => ({
          id: e.id,
          name: e.nameSk,
          nameLocalized: e.name,
          price: e.price,
        })) || [],
      extrasPrice: item.extrasPrice || 0,
      totalPrice: item.totalPrice,
      removedIngredients: item.removedIngredientsSk || [],
      removedIngredientsLocalized: item.removedIngredients || [],
    })),
    pricing: { subtotal, delivery, total },
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
    currency,
    timestamp: new Date().toISOString(),
  };
}
