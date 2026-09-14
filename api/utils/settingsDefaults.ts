export interface LocalizedText {
  sk: string;
  pl: string;
}

export interface DeliveryCity {
  name: string;
  minOrder: number;
  fee: number;
}

export interface AdminSettingsPayload {
  mode: 'off' | 'disabled' | 'waitTime' | 'customNote';
  waitTimeMinutes: number;
  customNote: LocalizedText;
  disabledReason: LocalizedText;
  disabledProductTypes: string[];
  disabledProductIds: string[];
  cardPaymentDeliveryEnabled: boolean;
  cardPaymentPickupEnabled: boolean;
  deliveryCities: {
    sk: DeliveryCity[];
    pl: DeliveryCity[];
  };
}

export const VALID_MODES = ['off', 'disabled', 'waitTime', 'customNote'];

export const VALID_PRODUCT_TYPES = [
  'pizza',
  'burger',
  'langos',
  'sides',
  'capovane',
  'drinks',
  'snacks',
];

export const DEFAULT_DELIVERY_CITIES: AdminSettingsPayload['deliveryCities'] = {
  sk: [
    { name: 'Skalité', minOrder: 8, fee: 0 },
    { name: 'Čierne', minOrder: 8, fee: 0 },
    { name: 'Oščadnica', minOrder: 30, fee: 0 },
    { name: 'Svrčinovec', minOrder: 30, fee: 0 },
  ],
  pl: [
    { name: 'Zwardoń', minOrder: 170, fee: 0 },
    { name: 'Myto', minOrder: 170, fee: 0 },
    { name: 'Laliki', minOrder: 170, fee: 0 },
    { name: 'Rycerka Górna', minOrder: 170, fee: 0 },
    { name: 'Rycerka Dolna', minOrder: 170, fee: 0 },
    { name: 'Rycerka-Kolonia', minOrder: 170, fee: 0 },
    { name: 'Sól', minOrder: 170, fee: 0 },
    { name: 'Rajcza', minOrder: 170, fee: 0 },
    { name: 'Milówka', minOrder: 170, fee: 0 },
  ],
};

export function createDefaultSettings(): AdminSettingsPayload {
  return {
    mode: 'off',
    waitTimeMinutes: 60,
    customNote: { sk: '', pl: '' },
    disabledReason: {
      sk: 'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
      pl: 'Z powodu dużej liczby zamówień jesteśmy zmuszeni tymczasowo wstrzymać przyjmowanie nowych zamówień online. Dziękujemy za wyrozumiałość i przepraszamy za niedogodności. Spróbuj później lub skontaktuj się z nami telefonicznie.',
    },
    disabledProductTypes: [],
    disabledProductIds: [],
    cardPaymentDeliveryEnabled: false,
    cardPaymentPickupEnabled: false,
    deliveryCities: DEFAULT_DELIVERY_CITIES,
  };
}

/** Older records stored the announcement texts as plain Slovak strings. */
export function toLocalizedText(
  value: unknown,
  fallback: LocalizedText,
): LocalizedText {
  if (typeof value === 'string') {
    return { sk: value, pl: fallback.pl };
  }
  if (value && typeof value === 'object') {
    const record = value as Partial<LocalizedText>;
    return {
      sk: typeof record.sk === 'string' ? record.sk : fallback.sk,
      pl: typeof record.pl === 'string' ? record.pl : fallback.pl,
    };
  }
  return fallback;
}

export function sanitizeDeliveryCities(value: unknown): DeliveryCity[] | null {
  if (!Array.isArray(value)) return null;

  const cities: DeliveryCity[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') return null;
    const { name, minOrder, fee } = entry as Record<string, unknown>;
    if (typeof name !== 'string' || !name.trim()) return null;
    if (typeof minOrder !== 'number' || !isFinite(minOrder) || minOrder < 0) {
      return null;
    }
    if (typeof fee !== 'number' || !isFinite(fee) || fee < 0) return null;
    cities.push({ name: name.trim(), minOrder, fee });
  }
  return cities;
}
