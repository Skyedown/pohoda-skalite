/**
 * Server-side sanitization utilities using industry-standard packages
 */

import sanitizeHtml from 'sanitize-html';
import validator from 'express-validator/lib/validator.js';
import type { Order, Delivery, SanitizedOrder } from '../types.js';

/**
 * Escape HTML to prevent XSS attacks using sanitize-html
 * @param text - The text to escape
 * @returns Escaped text
 */
export function escapeHTML(text: string): string {
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
 * @param input - The input to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized input
 */
export function sanitizeTextInput(input: string, maxLength: number = 500): string {
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
 * @param email - Email to validate
 * @returns Sanitized email or empty string
 */
export function sanitizeEmail(email: string): string {
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
 * @param phone - Phone to validate
 * @returns Sanitized phone
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  // Remove all characters except digits, +, spaces, parentheses, and hyphens
  const sanitized = validator.escape(phone.trim());

  // Additional phone-specific sanitization
  return sanitized.replace(/[^0-9+\s()-]/g, '').substring(0, 30);
}

/**
 * Sanitize delivery information
 * @param delivery - Delivery object
 * @returns Sanitized delivery object
 */
export function sanitizeDelivery(delivery: Partial<Delivery>): Delivery {
  if (!delivery || typeof delivery !== 'object') {
    throw new Error('Invalid delivery data');
  }

  const sanitizedEmail = sanitizeEmail(delivery.email || '');

  if (!sanitizedEmail) {
    throw new Error('Valid email is required');
  }

  return {
    street: sanitizeTextInput(delivery.street || '', 200),
    city: sanitizeTextInput(delivery.city || '', 100),
    phone: sanitizePhone(delivery.phone || ''),
    email: sanitizedEmail,
    notes: sanitizeTextInput(delivery.notes || '', 1000)
  };
}

/**
 * Validate and sanitize entire order object
 * @param order - Order object
 * @returns Sanitized order
 */
export function sanitizeOrder(order: any): SanitizedOrder {
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
  const sanitizedItems = order.items.map((item: any) => ({
    ...item,
    name: sanitizeTextInput(item.name, 100),
    size: sanitizeTextInput(item.size, 20),
    extras: item.extras ? item.extras.map((extra: any) => ({
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
    paymentMethod: sanitizedPaymentMethod as 'cash' | 'card'
  };
}
