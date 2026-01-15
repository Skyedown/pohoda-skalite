/**
 * Sanitization utilities for user inputs
 */

/**
 * Removes potentially dangerous HTML tags and scripts
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export const sanitizeHTML = (input: string): string => {
  if (!input) return '';

  // Replace HTML tags
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes text input by removing script tags and limiting length
 * @param input - The string to sanitize
 * @param maxLength - Maximum allowed length (default: 500)
 * @returns Sanitized string
 */
export const sanitizeTextInput = (input: string, maxLength: number = 500): string => {
  if (!input) return '';

  // Remove any script tags or dangerous patterns
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Validates and sanitizes email address
 * @param email - Email address to validate
 * @returns Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';

  // Basic sanitization
  const sanitized = email.trim().toLowerCase();

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
};

/**
 * Validates and sanitizes phone number
 * @param phone - Phone number to validate
 * @returns Sanitized phone number
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-digit and non-plus characters, keep spaces and parentheses for display
  const sanitized = phone.trim();

  // Allow only digits, spaces, plus sign, parentheses, and hyphens
  return sanitized.replace(/[^0-9+\s()-]/g, '');
};

/**
 * Sanitizes street address
 * @param address - Street address to sanitize
 * @returns Sanitized address
 */
export const sanitizeAddress = (address: string): string => {
  return sanitizeTextInput(address, 200);
};

/**
 * Sanitizes general text fields like notes
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export const sanitizeNotes = (text: string): string => {
  return sanitizeTextInput(text, 1000);
};

/**
 * Sanitizes all cart form data
 * @param formData - Form data object to sanitize
 * @returns Sanitized form data
 */
export interface CartFormData {
  fullName: string;
  street: string;
  city: string;
  phone: string;
  email: string;
  notes: string;
}

export const sanitizeCartForm = (formData: CartFormData): CartFormData => {
  return {
    fullName: sanitizeTextInput(formData.fullName, 100),
    street: sanitizeAddress(formData.street),
    city: sanitizeTextInput(formData.city, 100),
    phone: sanitizePhone(formData.phone),
    email: sanitizeEmail(formData.email),
    notes: sanitizeNotes(formData.notes)
  };
};
