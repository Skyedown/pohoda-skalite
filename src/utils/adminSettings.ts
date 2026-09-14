import type { Locale, LocalizedText } from '../i18n/types';
import type { ProductType } from '../types';
import { config } from '../config';
import { adminFetch } from './adminAuth';

export type AnnouncementMode = 'off' | 'disabled' | 'waitTime' | 'customNote';

export interface DeliveryCity {
  name: string;
  minOrder: number;
  fee: number;
}

export interface AdminSettings {
  mode: AnnouncementMode;
  waitTimeMinutes: number;
  customNote: LocalizedText;
  disabledReason: LocalizedText;
  disabledProductTypes: ProductType[];
  disabledProductIds: string[];
  cardPaymentDeliveryEnabled: boolean;
  cardPaymentPickupEnabled: boolean;
  deliveryCities: Record<Locale, DeliveryCity[]>;
}

const API_URL = config.apiUrl;

export const WAIT_TIME_OPTIONS = [
  { value: 60, label: '1 hodina' },
  { value: 90, label: '1 hodina 30 minút' },
  { value: 120, label: '2 hodiny' },
];

export const DEFAULT_SETTINGS: AdminSettings = {
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
  deliveryCities: {
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
  },
};

function toLocalizedText(
  value: unknown,
  fallback: LocalizedText,
): LocalizedText {
  if (typeof value === 'string') return { sk: value, pl: fallback.pl };
  if (value && typeof value === 'object') {
    const record = value as Partial<LocalizedText>;
    return {
      sk: typeof record.sk === 'string' ? record.sk : fallback.sk,
      pl: typeof record.pl === 'string' ? record.pl : fallback.pl,
    };
  }
  return fallback;
}

function normalizeSettings(raw: Record<string, unknown>): AdminSettings {
  const cities = (raw.deliveryCities ?? {}) as Record<string, DeliveryCity[]>;

  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    customNote: toLocalizedText(raw.customNote, DEFAULT_SETTINGS.customNote),
    disabledReason: toLocalizedText(
      raw.disabledReason,
      DEFAULT_SETTINGS.disabledReason,
    ),
    disabledProductTypes: (raw.disabledProductTypes as ProductType[]) ?? [],
    disabledProductIds: (raw.disabledProductIds as string[]) ?? [],
    deliveryCities: {
      sk:
        Array.isArray(cities.sk) && cities.sk.length
          ? cities.sk
          : DEFAULT_SETTINGS.deliveryCities.sk,
      pl:
        Array.isArray(cities.pl) && cities.pl.length
          ? cities.pl
          : DEFAULT_SETTINGS.deliveryCities.pl,
    },
  };
}

export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const response = await fetch(`${API_URL}/api/admin-settings`, {
      cache: 'no-cache',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (response.ok) {
      return normalizeSettings(await response.json());
    }
  } catch (error) {
    console.error('Failed to load admin settings from server:', error);
  }

  return DEFAULT_SETTINGS;
}

export async function saveAdminSettings(
  settings: AdminSettings,
): Promise<AdminSettings | null> {
  try {
    const response = await adminFetch('/api/admin-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      const result = await response.json();
      return normalizeSettings(result.settings);
    }
  } catch (error) {
    console.error('Failed to save admin settings to server:', error);
  }

  return null;
}
