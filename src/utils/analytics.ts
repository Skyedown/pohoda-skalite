// Google Analytics 4 & Meta Pixel utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export const GA_MEASUREMENT_ID = 'G-6Q287KJ5RR';
export const META_PIXEL_ID = '695345926848903';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // Check if user has consented to analytics
  const consent = localStorage.getItem('cookie-consent');
  if (consent !== 'accepted') return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const consent = localStorage.getItem('cookie-consent');
  if (consent !== 'accepted') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track conversion - order submission with revenue
export const trackPurchase = (orderData: {
  transactionId: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const consent = localStorage.getItem('cookie-consent');
  if (consent !== 'accepted') return;

  window.gtag('event', 'purchase', {
    transaction_id: orderData.transactionId,
    value: orderData.value,
    currency: orderData.currency,
    items: orderData.items,
  });

  // Also track as a conversion event
  window.gtag('event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/conversion`,
    value: orderData.value,
    currency: orderData.currency,
    transaction_id: orderData.transactionId,
  });

  // Track Meta Pixel purchase
  trackMetaPixelPurchase(orderData);
};

// Track Meta Pixel purchase event
export const trackMetaPixelPurchase = (orderData: {
  transactionId: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const consent = localStorage.getItem('cookie-consent');
  if (consent !== 'accepted') return;

  window.fbq('track', 'Purchase', {
    value: orderData.value,
    currency: orderData.currency,
    content_type: 'product',
    content_ids: orderData.items.map(item => item.item_id),
    contents: orderData.items.map(item => ({
      id: item.item_id,
      quantity: item.quantity,
      item_price: item.price,
    })),
  });
};

// Track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const consent = localStorage.getItem('cookie-consent');
  if (consent !== 'accepted') return;

  window.gtag('event', eventName, eventParams);
};

// Update consent
export const updateConsent = (granted: boolean) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  if (granted) {
    localStorage.setItem('cookie-consent', 'accepted');
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied', // We're only using analytics
    });
    // Initialize GA after consent
    initGA();
  } else {
    localStorage.setItem('cookie-consent', 'rejected');
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};

// Set default consent (before user interaction)
export const setDefaultConsent = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 500,
  });
};
