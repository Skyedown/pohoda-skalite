export type Locale = 'sk' | 'pl';

export type Currency = 'EUR' | 'PLN';

export interface LocalizedText {
  sk: string;
  pl: string;
}

export interface LocalizedPrice {
  EUR: number;
  PLN: number;
}

export const LOCALES: readonly Locale[] = ['sk', 'pl'];

export const DEFAULT_LOCALE: Locale = 'sk';

export const CURRENCY_BY_LOCALE: Record<Locale, Currency> = {
  sk: 'EUR',
  pl: 'PLN',
};

export const INTL_LOCALE: Record<Locale, string> = {
  sk: 'sk-SK',
  pl: 'pl-PL',
};

export const SITE_ORIGIN: Record<Locale, string> = {
  sk: 'https://pizzapohoda.sk',
  pl: 'https://pizzapohoda.pl',
};

export const HTML_LANG: Record<Locale, string> = {
  sk: 'sk',
  pl: 'pl',
};
