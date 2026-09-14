import type { DeliveryCity } from './adminSettings';

export interface DeliveryRule {
  minOrder: number;
  fee: number;
  displayName: string;
}

export const DEFAULT_RULE: DeliveryRule = {
  minOrder: 0,
  fee: 0,
  displayName: '',
};

function normalize(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Matching ignores diacritics so "Oscadnica" resolves the same as "Oščadnica". */
export function getDeliveryRule(
  cities: DeliveryCity[],
  city: string,
): DeliveryRule {
  if (!city) return DEFAULT_RULE;

  const target = normalize(city);
  const match = cities.find((entry) => normalize(entry.name) === target);

  return match
    ? { minOrder: match.minOrder, fee: match.fee, displayName: match.name }
    : DEFAULT_RULE;
}

export function isMinimumOrderMet(
  cities: DeliveryCity[],
  city: string,
  orderTotal: number,
): boolean {
  return orderTotal >= getDeliveryRule(cities, city).minOrder;
}

export function getMinimumOrderShortfall(
  cities: DeliveryCity[],
  city: string,
  orderTotal: number,
): { rule: DeliveryRule; remaining: number } | null {
  const rule = getDeliveryRule(cities, city);
  if (rule.minOrder === 0) return null;

  const remaining = rule.minOrder - orderTotal;
  return remaining > 0 ? { rule, remaining } : null;
}
