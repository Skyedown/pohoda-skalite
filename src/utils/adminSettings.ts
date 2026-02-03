export type AnnouncementMode = 'off' | 'disabled' | 'waitTime';

export interface AdminSettings {
  mode: AnnouncementMode;
  waitTimeMinutes: number;
}

const API_URL = import.meta.env.VITE_API_URL ?? '';

export const WAIT_TIME_OPTIONS = [
  { value: 30, label: '30 minút' },
  { value: 45, label: '45 minút' },
  { value: 60, label: '1 hodina' },
  { value: 75, label: '1 hodina 15 minút' },
  { value: 90, label: '1 hodina 30 minút' },
  { value: 105, label: '1 hodina 45 minút' },
  { value: 120, label: '2 hodiny' },
  { value: 135, label: '2 hodiny 15 minút' },
  { value: 150, label: '2 hodiny 30 minút' },
  { value: 165, label: '2 hodiny 45 minút' },
  { value: 180, label: '3 hodiny' },
  { value: 181, label: '3+ hodiny' },
];

// Default settings
const DEFAULT_SETTINGS: AdminSettings = {
  mode: 'off',
  waitTimeMinutes: 60,
};

// Fetch admin settings from server
export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const response = await fetch(`${API_URL}/api/admin-settings`);
    if (response.ok) {
      const settings = await response.json();
      return settings;
    }
  } catch (error) {
    console.error('Failed to load admin settings from server:', error);
  }

  return DEFAULT_SETTINGS;
}

// Save admin settings to server
export async function saveAdminSettings(settings: AdminSettings): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/admin-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error('Failed to save admin settings to server:', error);
  }

  return false;
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
