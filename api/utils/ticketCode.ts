import type { Tenant } from './tenant.js';

/**
 * Short routing code printed at the bottom of the kitchen ticket, e.g. `R-LAL`
 * for a Slovak delivery and `R-PL-LAL` for a Polish one, so the driver can tell
 * at a glance that the address is across the border.
 *
 * Only delivery orders get a code — pickup and dine-in never leave the
 * restaurant, so there is nothing to route.
 */
export function buildTicketCode(
  tenant: Tenant,
  deliveryMethod: string | undefined,
  city: string | undefined,
): string | undefined {
  if (deliveryMethod !== 'delivery') return undefined;

  const abbreviation = abbreviateCity(city ?? '');
  if (!abbreviation) return undefined;

  return tenant === 'pl' ? `R-PL-${abbreviation}` : `R-${abbreviation}`;
}

/**
 * First three letters of the village. Several Polish villages share a first
 * word — Rycerka Górna, Rycerka Dolna, Rycerka-Kolonia — so the initial of the
 * next word is appended to keep them apart.
 */
function abbreviateCity(city: string): string {
  const words = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .toUpperCase()
    .split(/[\s-]+/)
    .filter(Boolean);

  if (words.length === 0) return '';

  const head = words[0].slice(0, 3);
  return words.length > 1 ? `${head}${words[1][0]}` : head;
}
