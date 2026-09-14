export type Tenant = 'sk' | 'pl';
export type Currency = 'EUR' | 'PLN';

export const CURRENCY_BY_TENANT: Record<Tenant, Currency> = {
  sk: 'EUR',
  pl: 'PLN',
};

const COUNTRY_BY_TENANT: Record<Tenant, string> = {
  sk: 'Slovensko',
  pl: 'Polska',
};

/** Postal codes per storefront, used to disambiguate the geocoding lookup. */
const POSTAL_CODES: Record<Tenant, Record<string, string>> = {
  sk: {
    skalite: '02314',
    cierne: '02313',
    svrcinovec: '02312',
    oscadnica: '02301',
  },
  pl: {
    zwardon: '34-373',
    myto: '34-373',
    laliki: '34-373',
    'rycerka gorna': '34-370',
    'rycerka dolna': '34-370',
    'rycerka-kolonia': '34-370',
    sol: '34-373',
    rajcza: '34-370',
    milowka: '34-360',
  },
};

export function isTenant(value: unknown): value is Tenant {
  return value === 'sk' || value === 'pl';
}

export function toTenant(value: unknown, fallback: Tenant = 'sk'): Tenant {
  return isTenant(value) ? value : fallback;
}

/**
 * Orders created before the Polish launch carry no `tenant` field, so the
 * Slovak filter has to treat a missing value as Slovak.
 */
export function tenantFilter(tenant: Tenant): Record<string, unknown> {
  return tenant === 'sk'
    ? { $or: [{ tenant: 'sk' }, { tenant: { $exists: false } }] }
    : { tenant: 'pl' };
}

export function currencyFor(tenant: Tenant): Currency {
  return CURRENCY_BY_TENANT[tenant];
}

export function countryFor(tenant: Tenant): string {
  return COUNTRY_BY_TENANT[tenant];
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .toLowerCase()
    .trim();
}

export function postalCodeFor(tenant: Tenant, city: string): string {
  return POSTAL_CODES[tenant][normalizeText(city)] ?? '';
}

/** "170,00 zł (40,00 €)" — the bracket is dropped on Slovak orders. */
export function formatMoneyWithEur(
  amount: number,
  amountEur: number,
  currency: Currency,
): string {
  const primary = formatMoney(amount, currency);
  if (currency === 'EUR') return primary;
  return `${primary} (${formatMoney(amountEur, 'EUR')})`;
}

/**
 * Polish addresses read "Street 12, Town"; Slovak village addresses are just
 * "Village 123" because the houses carry no street name.
 */
export function formatAddress(delivery: {
  street?: string;
  houseNumber?: string;
  city?: string;
}): string {
  const street = delivery.street?.trim();
  const houseNumber = delivery.houseNumber?.trim() ?? '';
  const city = delivery.city?.trim() ?? '';

  if (street) {
    return `${street} ${houseNumber}, ${city}`.replace(' ,', ',');
  }

  return `${city} ${houseNumber}`.trim();
}

const CURRENCY_LOCALE: Record<Currency, string> = {
  EUR: 'sk-SK',
  PLN: 'pl-PL',
};

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
