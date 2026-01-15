import type { OrderFormData, ValidationErrors } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+421|0)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateOrderForm = (formData: OrderFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = 'Celé meno je povinné';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email je povinný';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Neplatný formát emailu';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Telefónne číslo je povinné';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Neplatný formát telefónneho čísla';
  }

  // Address fields only required for delivery
  if (formData.deliveryMethod === 'delivery') {
    if (!formData.city) {
      errors.city = 'Mesto je povinné';
    }

    if (!formData.street?.trim()) {
      errors.street = 'Ulica je povinná';
    }

    if (!formData.houseNumber?.trim()) {
      errors.houseNumber = 'Číslo domu je povinné';
    }
  }

  return errors;
};
