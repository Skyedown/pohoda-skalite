import type { Locale } from '../i18n/types';

/** Digits, spaces, dashes and parentheses are accepted; everything else is not. */
function stripFormatting(phone: string): string {
  return phone.replace(/[\s()-]/g, '');
}

const PHONE_PATTERNS: Record<Locale, RegExp> = {
  sk: /^(\+421|00421|0)\d{9}$/,
  pl: /^(\+48|0048)?\d{9}$/,
};

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone: string, locale: Locale): boolean =>
  PHONE_PATTERNS[locale].test(stripFormatting(phone));
