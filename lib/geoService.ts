/**
 * GeoService: Location Search Autocomplete (Nominatim) & High-Accuracy HTML5 Geolocation
 */

export interface GeocodedPlace {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  category?: string;
}

// Fallback curated landmarks for instant offline autocomplete
const CURATED_LANDMARKS: GeocodedPlace[] = [
  {
    id: 'bengaluru-indiranagar',
    name: 'Indiranagar 100 Feet Road',
    displayName: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka, India',
    lat: 12.9716,
    lng: 77.6412,
    type: 'street'
  },
  {
    id: 'bengaluru-christ-univ',
    name: 'Christ University Central Campus',
    displayName: 'Hosur Road, Bhavani Nagar, S.G. Palya, Bengaluru, Karnataka, India',
    lat: 12.9345,
    lng: 77.6060,
    type: 'university'
  },
  {
    id: 'bengaluru-koramangala',
    name: 'Koramangala 5th Block',
    displayName: 'Koramangala 5th Block, Bengaluru, Karnataka, India',
    lat: 12.9352,
    lng: 77.6245,
    type: 'suburb'
  },
  {
    id: 'bengaluru-mg-road',
    name: 'MG Road Metro Station',
    displayName: 'Mahatma Gandhi Rd, Ashok Nagar, Bengaluru, Karnataka, India',
    lat: 12.9756,
    lng: 77.6066,
    type: 'station'
  },
  {
    id: 'bengaluru-majestic',
    name: 'Kempegowda Bus Station (Majestic)',
    displayName: 'Gubbi Thotadappa Rd, Majestic, Bengaluru, Karnataka, India',
    lat: 12.9778,
    lng: 77.5713,
    type: 'station'
  },
  {
    id: 'bengaluru-whitefield',
    name: 'Whitefield ITPL Main Road',
    displayName: 'ITPL Main Rd, Whitefield, Bengaluru, Karnataka, India',
    lat: 12.9863,
    lng: 77.7314,
    type: 'commercial'
  },
  {
    id: 'bengaluru-cubbon-park',
    name: 'Cubbon Park Metro & Garden',
    displayName: 'Kasturba Rd, Sampangi Rama Nagara, Bengaluru, Karnataka, India',
    lat: 12.9763,
    lng: 77.5929,
    type: 'park'
  },
  {
    id: 'coimbatore-gandhipuram',
    name: 'Gandhipuram Central',
    displayName: 'Gandhipuram, Coimbatore, Tamil Nadu, India',
    lat: 11.0168,
    lng: 76.9558,
    type: 'suburb'
  },
  {
    id: 'coimbatore-rs-puram',
    name: 'RS Puram East',
    displayName: 'R.S. Puram, Coimbatore, Tamil Nadu, India',
    lat: 11.0089,
    lng: 76.9504,
    type: 'suburb'
  }
];

// Simple in-memory cache for search requests
const searchCache = new Map<string, GeocodedPlace[]>();

/**
 * Searches places using OpenStreetMap Nominatim with fallback to curated landmarks
 */
export async function searchPlaces(
  query: string,
  options?: { signal?: AbortSignal; limit?: number }
): Promise<GeocodedPlace[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const cacheKey = trimmed.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      trimmed
    )}&addressdetails=1&limit=${options?.limit || 5}`;

    const res = await fetch(url, {
      signal: options?.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SafeCircle-WomenSafety-App/1.0',
      },
    });

    if (!res.ok) {
      throw new Error(`Nominatim error: ${res.statusText}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const places: GeocodedPlace[] = data.map((item: any) => ({
        id: `osm-${item.place_id}`,
        name: item.name || item.display_name.split(',')[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || item.class || 'location',
        category: item.category,
      }));

      searchCache.set(cacheKey, places);
      return places;
    }
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    console.warn('Nominatim geocode fallback to curated landmarks:', err.message);
  }

  // Filter curated landmarks as offline fallback
  const filtered = CURATED_LANDMARKS.filter(
    (item) =>
      item.name.toLowerCase().includes(cacheKey) ||
      item.displayName.toLowerCase().includes(cacheKey)
  );

  return filtered;
}

/**
 * High-accuracy HTML5 Geolocation API lock
 */
export function getCurrentHighAccuracyLocation(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
}> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'Could not obtain GPS position.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Reverse geocode a latitude & longitude to a human-readable street address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SafeCircle-WomenSafety-App/1.0',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    }
  } catch (err) {
    console.warn('Reverse geocode error:', err);
  }

  return `Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
}
