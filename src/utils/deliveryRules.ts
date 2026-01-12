export interface DeliveryRule {
  minOrder: number;
  fee: number;
  displayName: string;
}

export const DELIVERY_RULES: Record<string, DeliveryRule> = {
  'Skalité': { minOrder: 8.0, fee: 0, displayName: 'Skalité' },
  'Skalite': { minOrder: 8.0, fee: 0, displayName: 'Skalité' },
  'Čierne': { minOrder: 8.0, fee: 0, displayName: 'Čierne' },
  'Cierne': { minOrder: 8.0, fee: 0, displayName: 'Čierne' },
  'Oščadnica': { minOrder: 30, fee: 0, displayName: 'Oščadnica' },
  'Oscadnica': { minOrder: 30, fee: 0, displayName: 'Oščadnica' },
  'Svrčinovec': { minOrder: 30, fee: 0, displayName: 'Svrčinovec' },
  'Svrcinovec': { minOrder: 30, fee: 0, displayName: 'Svrčinovec' },
};

export const DEFAULT_RULE: DeliveryRule = {
  minOrder: 0,
  fee: 0,
  displayName: 'Iné mesto'
};

export function getDeliveryRule(city: string): DeliveryRule {
  const normalizedCity = city.trim();
  return DELIVERY_RULES[normalizedCity] || DEFAULT_RULE;
}

export function isMinimumOrderMet(city: string, orderTotal: number): boolean {
  const rule = getDeliveryRule(city);
  return orderTotal >= rule.minOrder;
}

export function getMinimumOrderMessage(city: string, orderTotal: number): string | null {
  const rule = getDeliveryRule(city);

  if (rule.minOrder === 0) {
    return null;
  }

  const remaining = rule.minOrder - orderTotal;

  if (remaining > 0) {
    return `Minimálna suma objednávky pre ${rule.displayName} je ${rule.minOrder.toFixed(2)}€. Do minimálnej sumy chýba ešte ${remaining.toFixed(2)}€.`;
  }

  return null;
}
