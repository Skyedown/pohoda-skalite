/**
 * Server-side sanitization utilities using industry-standard packages
 */

import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

/**
 * Escape HTML to prevent XSS attacks using sanitize-html
 * @param {string} text - The text to escape
 * @returns {string} Escaped text
 */
export function escapeHTML(text) {
  if (!text || typeof text !== 'string') return '';

  // Use sanitize-html to completely strip all HTML tags
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape'
  });
}

/**
 * Sanitize text input by removing dangerous patterns
 * @param {string} input - The input to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized input
 */
export function sanitizeTextInput(input, maxLength = 500) {
  if (!input || typeof input !== 'string') return '';

  // Use validator to trim and escape
  let sanitized = validator.escape(validator.trim(input));

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate and sanitize email using validator.js
 * @param {string} email - Email to validate
 * @returns {string} Sanitized email or empty string
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return '';

  // Normalize and validate email
  const normalized = validator.normalizeEmail(email, {
    all_lowercase: true,
    gmail_remove_dots: false
  });

  if (!normalized || !validator.isEmail(normalized)) {
    return '';
  }

  return normalized;
}

/**
 * Validate and sanitize phone number
 * @param {string} phone - Phone to validate
 * @returns {string} Sanitized phone
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';

  // Remove all characters except digits, +, spaces, parentheses, and hyphens
  const sanitized = validator.escape(phone.trim());

  // Additional phone-specific sanitization
  return sanitized.replace(/[^0-9+\s()-]/g, '').substring(0, 30);
}

/**
 * Sanitize delivery information
 * @param {object} delivery - Delivery object
 * @returns {object} Sanitized delivery object
 */
export function sanitizeDelivery(delivery) {
  if (!delivery || typeof delivery !== 'object') {
    throw new Error('Invalid delivery data');
  }

  const sanitizedEmail = sanitizeEmail(delivery.email);

  if (!sanitizedEmail) {
    throw new Error('Valid email is required');
  }

  return {
    fullName: sanitizeTextInput(delivery.fullName, 100),
    street: sanitizeTextInput(delivery.street, 200),
    city: sanitizeTextInput(delivery.city, 100),
    phone: sanitizePhone(delivery.phone),
    email: sanitizedEmail,
    notes: sanitizeTextInput(delivery.notes, 1000)
  };
}

/**
 * Validate and sanitize entire order object
 * @param {object} order - Order object
 * @returns {object} Sanitized order
 */
export function sanitizeOrder(order) {
  if (!order || typeof order !== 'object') {
    throw new Error('Invalid order data');
  }

  // Validate required fields
  if (!order.delivery || !order.items || !Array.isArray(order.items)) {
    throw new Error('Missing required order fields');
  }

  // Sanitize delivery information
  const sanitizedDelivery = sanitizeDelivery(order.delivery);

  // Validate items array
  if (order.items.length === 0 || order.items.length > 50) {
    throw new Error('Invalid number of items');
  }

  // Sanitize items
  const sanitizedItems = order.items.map(item => ({
    ...item,
    name: sanitizeTextInput(item.name, 100),
    size: sanitizeTextInput(item.size, 20),
    extras: item.extras ? item.extras.map(extra => ({
      ...extra,
      name: sanitizeTextInput(extra.name, 100)
    })) : []
  }));

  // Validate payment method
  const validPaymentMethods = ['cash', 'card'];
  const sanitizedPaymentMethod = validPaymentMethods.includes(order.paymentMethod)
    ? order.paymentMethod
    : 'cash';

  return {
    ...order,
    delivery: sanitizedDelivery,
    items: sanitizedItems,
    paymentMethod: sanitizedPaymentMethod
  };
}
