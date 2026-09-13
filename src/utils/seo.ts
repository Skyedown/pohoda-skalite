import { SITE_ORIGIN, type Locale } from '../i18n/types';
import type { TranslationKey } from '../i18n/sk';
import { COMPANY } from '../constants/company';

type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

export interface AlternateLink {
  hrefLang: string;
  href: string;
}

/**
 * Both storefronts serve the same routes, so alternates are just the same path
 * on the other origin. Paths that differ per language are passed in explicitly.
 */
export function buildAlternates(
  pathByLocale: Record<Locale, string>,
): AlternateLink[] {
  return [
    { hrefLang: 'sk', href: `${SITE_ORIGIN.sk}${pathByLocale.sk}` },
    { hrefLang: 'pl', href: `${SITE_ORIGIN.pl}${pathByLocale.pl}` },
    { hrefLang: 'x-default', href: `${SITE_ORIGIN.sk}${pathByLocale.sk}` },
  ];
}

export function canonicalUrl(locale: Locale, path: string): string {
  return `${SITE_ORIGIN[locale]}${path}`;
}

export function buildRestaurantSchema(locale: Locale, t: Translate) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Pizza Pohoda',
    legalName: COMPANY.legalName,
    description: t('seo_restaurant_description'),
    image: `${SITE_ORIGIN.sk}/images/logo-social.png`,
    url: SITE_ORIGIN[locale],
    telephone: COMPANY.phone,
    email: COMPANY.email,
    priceRange: locale === 'pl' ? 'zł zł' : '€€',
    currenciesAccepted: locale === 'pl' ? 'PLN' : 'EUR',
    servesCuisine: ['Pizza', 'Italian', 'European'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      addressLocality: COMPANY.city,
      addressRegion: 'Žilina',
      postalCode: COMPANY.postalCode,
      addressCountry: COMPANY.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.4167,
      longitude: 19.0167,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '11:00',
        closes: '22:00',
      },
    ],
    sameAs: ['https://www.facebook.com/profile.php?id=61585409280116'],
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Pizza',
          description: t('seo_menu_section_pizza_description'),
        },
        {
          '@type': 'MenuSection',
          name: t('seo_menu_section_other'),
          description: t('seo_menu_section_other_description'),
        },
      ],
    },
    acceptsReservations: false,
    paymentAccepted: 'Cash, Card',
  };
}

export function buildDeliverySchema(cities: string[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Food delivery',
    provider: { '@type': 'Restaurant', name: 'Pizza Pohoda' },
    areaServed: cities.map((name) => ({
      '@type': 'City',
      name,
      addressCountry: locale === 'pl' ? 'PL' : 'SK',
    })),
  };
}
