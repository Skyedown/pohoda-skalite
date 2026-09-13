import {
  CURRENCY_BY_LOCALE,
  INTL_LOCALE,
  type Currency,
  type Locale,
  type LocalizedPrice,
  type LocalizedText,
} from './types';

const LOCALE_BY_CURRENCY: Record<Currency, Locale> = {
  EUR: 'sk',
  PLN: 'pl',
};

const formatters = new Map<Currency, Intl.NumberFormat>();

function getFormatter(currency: Currency): Intl.NumberFormat {
  const cached = formatters.get(currency);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(
    INTL_LOCALE[LOCALE_BY_CURRENCY[currency]],
    {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
  formatters.set(currency, formatter);
  return formatter;
}

export function formatPrice(amount: number, currency: Currency): string {
  return getFormatter(currency).format(amount);
}

export function formatPriceForLocale(amount: number, locale: Locale): string {
  return formatPrice(amount, CURRENCY_BY_LOCALE[locale]);
}

export function pickPrice(price: LocalizedPrice, locale: Locale): number {
  return price[CURRENCY_BY_LOCALE[locale]];
}

export function pickText(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export type PluralCategory = 'one' | 'few' | 'many';

const pluralRules = new Map<Locale, Intl.PluralRules>();

/**
 * Slovak and Polish share the one / 2–4 / 5+ split, so three buckets cover both.
 */
export function pluralCategory(count: number, locale: Locale): PluralCategory {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(INTL_LOCALE[locale]);
    pluralRules.set(locale, rules);
  }

  const category = rules.select(count);
  if (category === 'one') return 'one';
  if (category === 'few') return 'few';
  return 'many';
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
