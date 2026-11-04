// Google Analytics 4 & Meta Pixel utility functions
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Currency, Locale } from '../i18n/types';
import { config } from '../config';
import {
  hasAnalyticsConsent,
  hasMarketingConsent,
  readConsent,
  type ConsentChoices,
} from './consent';

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
  sk: config.gaIdSk,
  pl: config.gaIdPl,
};

export const META_PIXEL_ID = config.metaPixelId;

export function getMeasurementId(locale: Locale): string {
  return GA_MEASUREMENT_IDS[locale];
}

let loadedMeasurementId: string | null = null;

export const initGA = (locale: Locale) => {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;

  const measurementId = getMeasurementId(locale);
  if (loadedMeasurementId === measurementId) return;
  loadedMeasurementId = measurementId;
  delete (window as unknown as Record<string, unknown>)[
    `ga-disable-${measurementId}`
  ];

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
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent())
    return;

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
  trackMetaPixelPurchase(orderData);
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent())
    return;

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
};

export const trackMetaPixelPurchase = (orderData: PurchasePayload) => {
  if (typeof window === 'undefined' || !window.fbq || !hasMarketingConsent())
    return;

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
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent())
    return;
  window.gtag('event', eventName, eventParams);
};

let metaPixelLoaded = false;

/** Loads Meta Pixel only once marketing consent exists; never from the HTML. */
export const loadMetaPixel = () => {
  if (typeof window === 'undefined' || !hasMarketingConsent()) return;
  if (metaPixelLoaded) {
    window.fbq('consent', 'grant');
    return;
  }
  metaPixelLoaded = true;

  const fbq = function (...args: unknown[]) {
    const self = fbq as unknown as {
      callMethod?: (...a: unknown[]) => void;
      queue: unknown[];
    };
    if (self.callMethod) self.callMethod(...args);
    else self.queue.push(args);
  } as unknown as Window['fbq'] & {
    push: unknown;
    loaded: boolean;
    version: string;
    queue: unknown[];
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('consent', 'grant');
  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
};

/** Expires first-party cookies on this host and on the shared parent domain. */
function deleteCookies(matches: (name: string) => boolean): void {
  const parent = window.location.hostname.replace(/^www\./, '');
  document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => name && matches(name))
    .forEach((name) => {
      for (const domain of ['', `; domain=${parent}`, `; domain=.${parent}`]) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      }
    });
}

function consentModeState(choices: ConsentChoices) {
  return {
    analytics_storage: choices.analytics ? 'granted' : 'denied',
    // No Google Ads on the site, so advertising signals stay off for Google.
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
}

/** Applies a saved decision: starts what was granted, stops and cleans up what was not. */
export const applyConsent = (choices: ConsentChoices, locale: Locale) => {
  if (typeof window === 'undefined') return;
  window.gtag?.('consent', 'update', consentModeState(choices));

  if (choices.analytics) {
    initGA(locale);
  } else {
    for (const id of Object.values(GA_MEASUREMENT_IDS)) {
      (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
    }
    loadedMeasurementId = null;
    deleteCookies(
      (name) => name === '_ga' || name.startsWith('_ga_') || name === '_gid',
    );
  }

  if (choices.marketing) {
    loadMetaPixel();
  } else {
    if (metaPixelLoaded) window.fbq('consent', 'revoke');
    deleteCookies((name) => name === '_fbp' || name === '_fbc');
  }
};

/** Resumes tracking a visitor already agreed to on an earlier visit. */
export const startConsentedTracking = (locale: Locale) => {
  const consent = readConsent();
  if (!consent) return;
  applyConsent(consent, locale);
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
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
};
