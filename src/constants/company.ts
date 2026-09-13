/**
 * Registration identifiers are supplied through the build environment so the
 * owner can fill them in without a code change. Both storefronts sell under the
 * same Slovak entity.
 */
export const COMPANY = {
  legalName: 'M&M MIKULA s.r.o.',
  street: 'Skalité 1386',
  postalCode: '023 14',
  city: 'Skalité',
  countryCode: 'SK',
  registrationNumber: import.meta.env.VITE_COMPANY_ICO ?? '',
  taxNumber: import.meta.env.VITE_COMPANY_DIC ?? '',
  vatNumber: import.meta.env.VITE_COMPANY_IC_DPH ?? '',
  email: import.meta.env.VITE_RESTAURANT_EMAIL ?? 'objednavky@pizzapohoda.sk',
  phone: import.meta.env.VITE_RESTAURANT_PHONE ?? '+421918175571',
} as const;

export function formatPhone(phone: string): string {
  return phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
}
