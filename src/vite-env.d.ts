/// <reference types="vite/client" />

declare const __BUILD_DATE__: string;

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_RESTAURANT_EMAIL?: string;
  readonly VITE_RESTAURANT_PHONE?: string;
  readonly VITE_PREORDER_START_TIME?: string;
  readonly VITE_OPENING_TIME?: string;
  readonly VITE_LAST_ORDER_TIME?: string;
  readonly VITE_CLOSING_TIME?: string;
  readonly VITE_COMPANY_ICO?: string;
  readonly VITE_COMPANY_DIC?: string;
  readonly VITE_COMPANY_IC_DPH?: string;
  readonly VITE_GA_ID_SK?: string;
  readonly VITE_GA_ID_PL?: string;
  readonly VITE_META_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
