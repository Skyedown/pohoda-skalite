/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RESTAURANT_EMAIL: string
  readonly VITE_RESTAURANT_PHONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
