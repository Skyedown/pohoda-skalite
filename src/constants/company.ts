import { config } from '../config';

/**
 * Both storefronts sell under the same Slovak entity. The registration numbers
 * are public register data that never changes, so they live here rather than
 * in configuration.
 */
export const COMPANY = {
  legalName: 'M&M MIKULA s.r.o.',
  street: 'Skalité 1386',
  postalCode: '023 14',
  city: 'Skalité',
  countryCode: 'SK',
  registrationNumber: '44612516',
  taxNumber: '2022796424',
  vatNumber: 'SK2022796424',
  email: config.restaurantEmail,
  phone: config.restaurantPhone,
} as const;

export function formatPhone(phone: string): string {
  return phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
}
