import { config } from '../config';

/**
 * Registration identifiers come from the container's environment, so the owner
 * can fill them in without a rebuild. Both storefronts sell under the same
 * Slovak entity.
 */
export const COMPANY = {
  legalName: 'M&M MIKULA s.r.o.',
  street: 'Skalité 1386',
  postalCode: '023 14',
  city: 'Skalité',
  countryCode: 'SK',
  registrationNumber: config.companyIco,
  taxNumber: config.companyDic,
  vatNumber: config.companyIcDph,
  email: config.restaurantEmail,
  phone: config.restaurantPhone,
} as const;

export function formatPhone(phone: string): string {
  return phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
}
