/** Separators people type. \s also covers the non-breaking space phones paste in. */
const SEPARATORS = /[\s().-]/g;

/** Any international number: optional + or 00 prefix, then 9-15 digits (E.164). */
const PHONE = /^(?:\+|00)?\d{9,15}$/;

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return PHONE.test(phone.replace(SEPARATORS, ''));
}
