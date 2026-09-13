// Google Analytics 4 & Meta Pixel utility functions
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Currency, Locale } from '../i18n/types';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Each storefront reports into its own GA property. */
const GA_MEASUREMENT_IDS: Record<Locale, string> = {
  sk: import.meta.env.VITE_GA_ID_SK || 'G-6Q287KJ5RR',
  pl: import.meta.env.VITE_GA_ID_PL || 'G-9LEFZGNPWY',
};

export const META_PIXEL_ID =
  import.meta.env.VITE_META_PIXEL_ID || '695345926848903';

export function getMeasurementId(locale: Locale): string {
  return GA_MEASUREMENT_IDS[locale];
}

function hasConsent(): boolean {
  return localStorage.getItem('cookie-consent') === 'accepted';
}

let loadedMeasurementId: string | null = null;

export const initGA = (locale: Locale) => {
  if (typeof window === 'undefined' || !hasConsent()) return;

  const measurementId = getMeasurementId(locale);
  if (loadedMeasurementId === measurementId) return;
  loadedMeasurementId = measurementId;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
    tenant: locale,
  });
};

export const trackPageView = (url: string, locale: Locale) => {
  if (typeof window === 'undefined' || !window.gtag || !hasConsent()) return;

  window.gtag('config', getMeasurementId(locale), {
    page_path: url,
    tenant: locale,
  });
};

interface PurchasePayload {
  transactionId: string;
  value: number;
  currency: Currency;
  locale: Locale;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>;
}

export const trackPurchase = (orderData: PurchasePayload) => {
  if (typeof window === 'undefined' || !window.gtag || !hasConsent()) return;

  window.gtag('event', 'purchase', {
    transaction_id: orderData.transactionId,
    value: orderData.value,
    currency: orderData.currency,
    tenant: orderData.locale,
    items: orderData.items,
  });

  window.gtag('event', 'conversion', {
    send_to: `${getMeasurementId(orderData.locale)}/conversion`,
    value: orderData.value,
    currency: orderData.currency,
    transaction_id: orderData.transactionId,
  });

  trackMetaPixelPurchase(orderData);
};

export const trackMetaPixelPurchase = (orderData: PurchasePayload) => {
  if (typeof window === 'undefined' || !window.fbq || !hasConsent()) return;

  window.fbq('track', 'Purchase', {
    value: orderData.value,
    currency: orderData.currency,
    content_type: 'product',
    content_ids: orderData.items.map((item) => item.item_id),
    contents: orderData.items.map((item) => ({
      id: item.item_id,
      quantity: item.quantity,
      item_price: item.price,
    })),
  });
};

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>,
) => {
  if (typeof window === 'undefined' || !window.gtag || !hasConsent()) return;
  window.gtag('event', eventName, eventParams);
};

export const updateConsent = (granted: boolean, locale: Locale) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  if (granted) {
    localStorage.setItem('cookie-consent', 'accepted');
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
    });
    initGA(locale);
  } else {
    localStorage.setItem('cookie-consent', 'rejected');
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};

export const setDefaultConsent = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 500,
  });
};
