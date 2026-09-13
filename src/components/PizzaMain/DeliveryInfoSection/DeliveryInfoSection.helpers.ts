import type { DeliveryCity } from '../../../utils/adminSettings';

export interface DeliveryGroup {
  minOrder: number;
  fee: number;
  cities: string[];
}

/** Villages that share a minimum order are shown as one card. */
export function groupCitiesByMinOrder(cities: DeliveryCity[]): DeliveryGroup[] {
  const groups = new Map<string, DeliveryGroup>();

  for (const city of cities) {
    const key = `${city.minOrder}-${city.fee}`;
    const existing = groups.get(key);
    if (existing) {
      existing.cities.push(city.name);
    } else {
      groups.set(key, {
        minOrder: city.minOrder,
        fee: city.fee,
        cities: [city.name],
      });
    }
  }

  return [...groups.values()].sort((a, b) => a.minOrder - b.minOrder);
}

/** Two villages read better joined by "&"; a longer list needs commas. */
export function formatCityList(cities: string[]): string {
  return cities.length === 2 ? cities.join(' & ') : cities.join(', ');
}
