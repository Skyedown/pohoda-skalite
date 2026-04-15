import type { CartFormData } from '../../utils/sanitize';
import type { CartItem, DeliveryMethod } from '../../types';

export function validateCartForm(
  formData: CartFormData,
  deliveryMethod: DeliveryMethod,
  gdprConsent: boolean,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.fullName.trim()) {
    errors.fullName = 'Celé meno je povinné';
  }

  if (deliveryMethod === 'delivery') {
    if (!formData.houseNumber.trim()) {
      errors.houseNumber = 'Číslo domu je povinné';
    }
    if (!formData.city.trim()) {
      errors.city = 'Mesto je povinné';
    }
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Telefónne číslo je povinné';
  } else if (!/^[+]?[\d\s()-]{9,}$/.test(formData.phone)) {
    errors.phone = 'Zadajte platné telefónne číslo';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email je povinný';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Zadajte platnú emailovú adresu';
  }

  if (!gdprConsent) {
    errors.gdprConsent = 'Musíte súhlasiť so spracovaním osobných údajov';
  }

  return errors;
}

export function scrollToFirstError(errors: Record<string, string>): void {
  const fieldOrder = [
    'fullName',
    'city',
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

export function buildOrderPayload(
  cart: CartItem[],
  formData: CartFormData,
  deliveryMethod: DeliveryMethod,
  paymentMethod: 'cash' | 'card',
  subtotal: number,
  delivery: number,
  total: number,
) {
  return {
    items: cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      type: item.product.type,
      quantity: item.quantity,
      basePrice: item.product.price,
      extras:
        item.extras?.map((e) => ({ id: e.id, name: e.name, price: e.price })) ||
        [],
      extrasPrice: item.extrasPrice || 0,
      totalPrice: item.totalPrice,
      removedIngredients: item.removedIngredients || [],
    })),
    pricing: { subtotal, delivery, total },
    deliveryMethod,
    delivery: {
      fullName: formData.fullName,
      street: '',
      houseNumber: formData.houseNumber || '',
      city: formData.city || '',
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
    },
    paymentMethod,
    timestamp: new Date().toISOString(),
  };
}
