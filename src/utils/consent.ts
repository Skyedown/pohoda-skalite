/**
 * Cookie consent record. Bumping CONSENT_VERSION asks everyone again, which is
 * required whenever the purposes or providers listed in the banner change.
 */
export const CONSENT_VERSION = 2;
export const CONSENT_CHANGE_EVENT = 'cookieConsentChange';
export const OPEN_COOKIE_SETTINGS_EVENT = 'openCookieSettings';

const STORAGE_KEY = 'pohoda-cookie-consent';
const LEGACY_STORAGE_KEY = 'cookie-consent';
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export interface ConsentChoices {
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent extends ConsentChoices {
  version: number;
  decidedAt: string;
}

export const NO_OPTIONAL_CONSENT: ConsentChoices = {
  analytics: false,
  marketing: false,
};

function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.version === 'number' &&
    typeof record.decidedAt === 'string' &&
    typeof record.analytics === 'boolean' &&
    typeof record.marketing === 'boolean'
  );
}

/** Null means no valid decision: never asked, outdated version or expired. */
export function readConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredConsent(parsed) || parsed.version !== CONSENT_VERSION) {
      return null;
    }
    const age = Date.now() - new Date(parsed.decidedAt).getTime();
    return age >= 0 && age < MAX_AGE_MS ? parsed : null;
  } catch {
    return null;
  }
}

export function saveConsent(choices: ConsentChoices): StoredConsent {
  const record: StoredConsent = {
    ...choices,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    // The old banner only stored "accepted" without naming purposes.
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  return record;
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  return readConsent()?.marketing === true;
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
