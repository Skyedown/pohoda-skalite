export type AnnouncementMode = 'off' | 'disabled' | 'waitTime' | 'customNote';

export interface AdminSettings {
  mode: AnnouncementMode;
  waitTimeMinutes: number;
  customNote: string;
  disabledReason: string;
  disabledProductTypes?: ('pizza' | 'burger' | 'langos' | 'sides')[];
  cardPaymentDeliveryEnabled?: boolean;
  cardPaymentPickupEnabled?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL ?? '';

export const WAIT_TIME_OPTIONS = [
  { value: 60, label: '1 hodina' },
  { value: 90, label: '1 hodina 30 minút' },
  { value: 120, label: '2 hodiny' },
];

// Default settings
const DEFAULT_SETTINGS: AdminSettings = {
  mode: 'off',
  waitTimeMinutes: 60,
  customNote:
    'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste',
  disabledReason:
    'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
  disabledProductTypes: [],
  cardPaymentDeliveryEnabled: false,
  cardPaymentPickupEnabled: false,
};

// Fetch admin settings from server
export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const response = await fetch(`${API_URL}/api/admin-settings`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (response.ok) {
      const settings = await response.json();
      // Ensure disabledReason exists (migration for old data, only if undefined)
      if (settings.disabledReason === undefined) {
        settings.disabledReason =
          'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.';
      }
      return settings;
    }
  } catch (error) {
    console.error('Failed to load admin settings from server:', error);
  }

  return DEFAULT_SETTINGS;
}

// Save admin settings to server
export async function saveAdminSettings(
  settings: AdminSettings,
): Promise<AdminSettings | null> {
  try {
    console.log('📤 Sending to server:', JSON.stringify(settings, null, 2));

    const response = await fetch(`${API_URL}/api/admin-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('📥 Received from server:', JSON.stringify(result, null, 2));
      return result.settings;
    }
  } catch (error) {
    console.error('Failed to save admin settings to server:', error);
  }

  return null;
}

export function formatWaitTime(minutes: number): string {
  if (minutes >= 181) {
    return '3+ hodiny';
  } else if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hodina' : hours < 5 ? 'hodiny' : 'hodín'}`;
    }
    return `${hours} ${hours === 1 ? 'hodina' : hours < 5 ? 'hodiny' : 'hodín'} ${mins} minút`;
  } else {
    return `${minutes} minút`;
  }
}
