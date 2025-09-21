import dotenv from 'dotenv';
import { TrampolinePark } from '../src/types/park';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

if (!API_KEY) {
  console.error('Please set GOOGLE_PLACES_API_KEY environment variable');
  process.exit(1);
}

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
  types: string[];
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{ photo_reference: string }>;
  types: string[];
}

async function searchSanAntonioParks(): Promise<PlaceResult[]> {
  console.log('🔍 Searching specifically for San Antonio area trampoline parks...');

  const searches = [
    'trampoline park San Antonio Texas',
    'trampoline park San Antonio TX',
    'urban air San Antonio',
    'sky zone San Antonio',
    'altitude trampoline San Antonio',
    'bounce house San Antonio',
    'jumping world San Antonio',
    'trampoline center San Antonio',
    'adventure park San Antonio',
    'jump zone San Antonio',
    'trampoline park New Braunfels Texas',
    'trampoline park Schertz Texas',
    'trampoline park Universal City Texas',
    'trampoline park Converse Texas',
    'trampoline park Selma Texas',
    'trampoline park Live Oak Texas',
    'trampoline park Kirby Texas',
    'bounce San Antonio',
    'indoor playground San Antonio trampoline'
  ];

  const allResults: PlaceResult[] = [];
  const seenPlaceIds = new Set<string>();

  for (const query of searches) {
    try {
      console.log(`  Searching: ${query}`);

      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.businessStatus,places.types'
        },
        body: JSON.stringify({
          textQuery: query,
          locationRestriction: {
            rectangle: {
              low: {
                latitude: 29.1,  // South of San Antonio
                longitude: -98.8
              },
              high: {
                latitude: 29.8,  // North of San Antonio
                longitude: -98.2
              }
            }
          },
          maxResultCount: 20
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const results = data.places || [];

      for (const place of results) {
        const result: PlaceResult = {
          place_id: place.id,
          name: place.displayName?.text || '',
          formatted_address: place.formattedAddress || '',
          geometry: {
            location: {
              lat: place.location?.latitude || 0,
              lng: place.location?.longitude || 0
            }
          },
          rating: place.rating,
          user_ratings_total: place.userRatingCount,
          business_status: place.businessStatus,
          types: place.types || []
        };

        // Filter for San Antonio area and avoid duplicates
        if ((result.formatted_address.includes('San Antonio') ||
             result.formatted_address.includes('New Braunfels') ||
             result.formatted_address.includes('Schertz') ||
             result.formatted_address.includes('Universal City') ||
             result.formatted_address.includes('Converse') ||
             result.formatted_address.includes('Selma') ||
             result.formatted_address.includes('Live Oak')) &&
            result.formatted_address.includes('TX') &&
            !seenPlaceIds.has(result.place_id)) {
          seenPlaceIds.add(result.place_id);
          allResults.push(result);
          console.log(`    ✅ Found: ${result.name} - ${result.formatted_address}`);
        }
      }

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 150));

    } catch (error) {
      console.error(`❌ Error searching for "${query}":`, error);
    }
  }

  console.log(`\n📊 Found ${allResults.length} unique parks in San Antonio area`);
  return allResults;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,nationalPhoneNumber,websiteUri,regularOpeningHours,rating,userRatingCount,photos,types'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const place = await response.json();

    const result: PlaceDetails = {
      place_id: place.id,
      name: place.displayName?.text || '',
      formatted_address: place.formattedAddress || '',
      geometry: {
        location: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0
        }
      },
      formatted_phone_number: place.nationalPhoneNumber,
      website: place.websiteUri,
      opening_hours: place.regularOpeningHours ? {
        weekday_text: place.regularOpeningHours.weekdayDescriptions || []
      } : undefined,
      rating: place.rating,
      user_ratings_total: place.userRatingCount,
      photos: place.photos?.map((photo: any) => ({
        photo_reference: photo.name
      })) || [],
      types: place.types || []
    };

    return result;
  } catch (error) {
    console.error(`❌ Error getting details for place ${placeId}:`, error);
    return null;
  }
}

function parseAddress(formattedAddress: string) {
  const parts = formattedAddress.split(', ');

  if (parts.length < 3) {
    return {
      street: formattedAddress,
      city: 'Unknown',
      state: 'Texas',
      zipCode: '',
    };
  }

  const street = parts[0];
  const city = parts[1];
  const stateZip = parts[2];
  const stateParts = stateZip.split(' ');
  const state = stateParts[0] === 'TX' ? 'Texas' : stateParts[0];
  const zipCode = stateParts[1] || '';

  return {
    street,
    city,
    state,
    zipCode,
  };
}

function parseHours(weekdayText?: string[]): { [key: string]: string } {
  if (!weekdayText) return {};

  const hours: { [key: string]: string } = {};
  const dayMap: { [key: string]: string } = {
    'Monday': 'monday',
    'Tuesday': 'tuesday',
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday',
    'Saturday': 'saturday',
    'Sunday': 'sunday'
  };

  for (const text of weekdayText) {
    const colonIndex = text.indexOf(':');
    if (colonIndex > 0) {
      const day = text.substring(0, colonIndex).trim();
      const time = text.substring(colonIndex + 1).trim();
      const dayKey = dayMap[day];
      if (dayKey) {
        hours[dayKey] = time;
      }
    }
  }

  return hours;
}

function generateSlug(name: string, city: string): string {
  return `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function generatePhotoUrls(photos: Array<{ photo_reference: string }>, maxPhotos: number = 5): string[] {
  return photos
    .slice(0, maxPhotos)
    .map(photo => {
      const photoId = photo.photo_reference.split('/').pop() || photo.photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoId}&maxwidth=800&key=${API_KEY}`;
    });
}

function convertToTrampolinePark(details: PlaceDetails): TrampolinePark {
  const address = parseAddress(details.formatted_address);

  return {
    id: details.place_id,
    name: details.name,
    description: `Trampoline park located in ${address.city}, Texas.`,
    address: {
      ...address,
      metroArea: 'San Antonio Metro',
      coordinates: {
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      },
    },
    contact: {
      phone: details.formatted_phone_number || '',
      website: details.website,
    },
    hours: parseHours(details.opening_hours?.weekday_text),
    amenities: [],
    pricing: {},
    images: details.photos ? generatePhotoUrls(details.photos) : [],
    rating: details.rating,
    reviewCount: details.user_ratings_total,
    features: [],
    ageGroups: ['kids', 'teens', 'adults'],
    slug: generateSlug(details.name, address.city),
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

async function main() {
  console.log('🏀 Starting targeted San Antonio trampoline park search...');

  try {
    const parks = await searchSanAntonioParks();

    if (parks.length === 0) {
      console.log('❌ No additional parks found in San Antonio area');
      return;
    }

    console.log('\n🔍 Getting detailed information...');
    const detailedParks: TrampolinePark[] = [];

    for (let i = 0; i < parks.length; i++) {
      const park = parks[i];
      console.log(`Processing ${i + 1}/${parks.length}: ${park.name}`);

      const details = await getPlaceDetails(park.place_id);
      if (details) {
        const trampolinePark = convertToTrampolinePark(details);
        detailedParks.push(trampolinePark);
      }

      await new Promise(resolve => setTimeout(resolve, 150));
    }

    console.log(`\n✅ Found ${detailedParks.length} San Antonio area parks:`);
    detailedParks.forEach(park => {
      console.log(`  - ${park.name} (${park.address.city})`);
    });

    // Save to separate file for review
    const outputPath = path.join(__dirname, '../san-antonio-parks-found.json');
    fs.writeFileSync(outputPath, JSON.stringify(detailedParks, null, 2));
    console.log(`\n📁 Parks saved to: ${outputPath}`);
    console.log(`\n💡 Review these parks and manually add any missing ones to your main texas-parks.ts file`);

  } catch (error) {
    console.error('💥 Error collecting San Antonio park data:', error);
  }
}

if (require.main === module) {
  main();
}