import { DEFAULT_LOCALE, LOCALES, type Locale } from './types';

const OVERRIDE_KEY = 'pohoda-locale-override';

function isLocale(value: string | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function readOverride(): Locale | null {
  try {
    const stored = sessionStorage.getItem(OVERRIDE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function writeOverride(locale: Locale): void {
  try {
    sessionStorage.setItem(OVERRIDE_KEY, locale);
  } catch {
    // Private browsing — override simply does not persist
  }
}

export function localeFromHostname(hostname: string): Locale {
  return hostname.toLowerCase().endsWith('.pl') ? 'pl' : DEFAULT_LOCALE;
}

/**
 * The Polish and Slovak sites share one build; the domain decides which one
 * this page is. `?lang=` exists so the PL site can be reviewed before DNS
 * points at the server.
 */
export function resolveLocale(hostname: string, search: string): Locale {
  const requested = new URLSearchParams(search).get('lang');
  if (isLocale(requested)) {
    writeOverride(requested);
    return requested;
  }

  const override = readOverride();
  if (override) return override;

  return localeFromHostname(hostname);
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  return resolveLocale(window.location.hostname, window.location.search);
}
