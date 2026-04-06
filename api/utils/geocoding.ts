/**
 * Geocoding utilities for resolving addresses to GPS coordinates
 * and generating Mapy.cz URLs
 */

interface Address {
  country: string;
  city: string;
  street?: string;
  houseNumber?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PhotonFeature {
  properties: {
    country?: string;
    housenumber?: string;
    [key: string]: unknown;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

/**
 * Build query string from address parts in the correct order
 */
function buildAddressQuery(address: Address): string {
  const parts: string[] = [];

  parts.push(address.country);
  parts.push(address.city);

  if (address.street) {
    parts.push(address.street);
  }

  if (address.houseNumber) {
    parts.push(address.houseNumber);
  }

  return parts.join(' ');
}

/**
 * Check if a Photon API feature matches the provided address
 */
function checkAddressMatch(feature: PhotonFeature, address: Address): boolean {
  const props = feature.properties;

  // Check house number if provided
  if (address.houseNumber) {
    const featureHouseNumber = props.housenumber || '';
    if (featureHouseNumber !== address.houseNumber) {
      return false;
    }
  }

  // Check country
  const featureCountry = props.country || '';
  if (featureCountry.toLowerCase() !== address.country.toLowerCase()) {
    return false;
  }

  return true;
}

/**
 * Resolve GPS coordinates from address using Photon API (OpenStreetMap)
 */
export async function resolveGPS(
  address: Address,
): Promise<Coordinates | null> {
  try {
    const query = buildAddressQuery(address);
    const params = new URLSearchParams({
      q: query,
      limit: '5',
    });

    const url = `https://photon.komoot.io/api/?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Photon API error:', response.status, response.statusText);
      return null;
    }

    const data = (await response.json()) as PhotonResponse;

    // Find the first matching feature
    for (const feature of data.features) {
      if (!checkAddressMatch(feature, address)) {
        continue;
      }

      const [lon, lat] = feature.geometry.coordinates;

      if (lat !== null && lon !== null) {
        return {
          latitude: lat,
          longitude: lon,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error resolving GPS coordinates:', error);
    return null;
  }
}

/**
 * Build Mapy.cz URL from GPS coordinates
 */
export function buildMapyCzUrl(coords: Coordinates): string {
  const params = new URLSearchParams({
    id: `${coords.longitude},${coords.latitude}`,
    source: 'coor',
  });

  return `https://mapy.cz/zakladni?${params.toString()}`;
}

/**
 * Resolve address to Mapy.cz URL (convenience function)
 */
export async function getMapyCzUrlForAddress(
  address: Address,
): Promise<string | null> {
  const coords = await resolveGPS(address);

  if (!coords) {
    return null;
  }

  return buildMapyCzUrl(coords);
}
