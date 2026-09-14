import type { Locale } from '../i18n/types';

/**
 * Both routes are registered on both domains so an old link never 404s; the
 * canonical URL always points at the locale-native path.
 */
export const LEGAL_PATHS: Record<
  'privacy' | 'terms',
  Record<Locale, string>
> = {
  privacy: {
    sk: '/ochrana-osobnych-udajov',
    pl: '/polityka-prywatnosci',
  },
  terms: {
    sk: '/obchodne-podmienky',
    pl: '/regulamin',
  },
};

export const ALL_LEGAL_ROUTES = {
  privacy: Object.values(LEGAL_PATHS.privacy),
  terms: Object.values(LEGAL_PATHS.terms),
};
