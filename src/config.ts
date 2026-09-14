/**
 * Runtime configuration.
 *
 * Vite inlines `import.meta.env` at build time, which would force a rebuild for
 * every configuration change. Instead the nginx container writes `config.js`
 * from its environment on startup, so one image can run with any `.env`.
 *
 * Resolution order: runtime `config.js` → build-time env (used by `npm run dev`)
 * → the defaults below.
 */

export interface AppConfig {
  apiUrl: string;
  restaurantEmail: string;
  restaurantPhone: string;
  preorderStartTime: string;
  openingTime: string;
  lastOrderTime: string;
  closingTime: string;
  gaIdSk: string;
  gaIdPl: string;
  metaPixelId: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: Partial<Record<keyof AppConfig, string>>;
  }
}

const DEFAULTS: AppConfig = {
  apiUrl: '',
  restaurantEmail: 'objednavky@pizzapohoda.sk',
  restaurantPhone: '+421918175571',
  preorderStartTime: '10:00',
  openingTime: '11:00',
  lastOrderTime: '21:30',
  closingTime: '22:00',
  gaIdSk: 'G-6Q287KJ5RR',
  gaIdPl: 'G-9LEFZGNPWY',
  metaPixelId: '695345926848903',
};

function pick(
  key: keyof AppConfig,
  buildTimeValue: string | undefined,
): string {
  const runtimeValue =
    typeof window === 'undefined' ? undefined : window.__APP_CONFIG__?.[key];

  if (runtimeValue) return runtimeValue;
  if (buildTimeValue) return buildTimeValue;
  return DEFAULTS[key];
}

export const config: AppConfig = {
  apiUrl: pick('apiUrl', import.meta.env.VITE_API_URL),
  restaurantEmail: pick(
    'restaurantEmail',
    import.meta.env.VITE_RESTAURANT_EMAIL,
  ),
  restaurantPhone: pick(
    'restaurantPhone',
    import.meta.env.VITE_RESTAURANT_PHONE,
  ),
  preorderStartTime: pick(
    'preorderStartTime',
    import.meta.env.VITE_PREORDER_START_TIME,
  ),
  openingTime: pick('openingTime', import.meta.env.VITE_OPENING_TIME),
  lastOrderTime: pick('lastOrderTime', import.meta.env.VITE_LAST_ORDER_TIME),
  closingTime: pick('closingTime', import.meta.env.VITE_CLOSING_TIME),
  gaIdSk: pick('gaIdSk', import.meta.env.VITE_GA_ID_SK),
  gaIdPl: pick('gaIdPl', import.meta.env.VITE_GA_ID_PL),
  metaPixelId: pick('metaPixelId', import.meta.env.VITE_META_PIXEL_ID),
};
