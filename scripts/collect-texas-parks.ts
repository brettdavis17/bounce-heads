import dotenv from 'dotenv';
import { TrampolinePark } from '../src/types/park';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// You'll need to set your Google Places API key
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

async function searchTrampolineParks(): Promise<PlaceResult[]> {
  console.log('Searching for trampoline parks in Texas...');
  
  const searches = [
    'trampoline park Texas',
    'urban air Texas',
    'sky zone Texas',
    'altitude trampoline Texas',
    'ground control trampoline Texas',
    'airtopia adventure park Texas',
    'pump it up Texas',
    'jumping world Texas',
    'trampoline center Texas',

    // Austin area searches
    'urban air Austin Texas',
    'urban air South Austin',
    'urban air Cedar Park Texas',
    'urban air Bee Cave Texas',
    'urban air Pleasant Valley Austin',
    'urban air Ranch Road 620 Austin',
    'trampoline park Round Rock Texas',
    'trampoline park Cedar Park Texas',
    'trampoline park Bee Cave Texas',

    // San Antonio area searches
    'trampoline park San Antonio Texas',
    'urban air San Antonio',
    'altitude trampoline San Antonio',
    'ground control San Antonio',
    'airtopia San Antonio',
    'pump it up San Antonio',
    'rush fun park San Antonio',
    'trampoline park New Braunfels Texas',
    'trampoline park Schertz Texas',

    // Houston area searches
    'urban air Houston',
    'altitude trampoline Houston',
    'sky zone Houston',
    'trampoline park Houston Texas',
    'trampoline park Katy Texas',
    'trampoline park Sugar Land Texas',
    'trampoline park Spring Texas',

    // Dallas area searches
    'urban air Dallas',
    'sky zone Dallas',
    'altitude trampoline Dallas',
    'trampoline park Dallas Texas',
    'trampoline park Plano Texas',
    'trampoline park Frisco Texas',
    'trampoline park Arlington Texas',

    // Generic searches
    'bounce house Texas',
    'jumping center Texas'
  ];
  
  const allResults: PlaceResult[] = [];
  const seenPlaceIds = new Set<string>();
  
  for (const query of searches) {
    try {
      console.log(`Searching: ${query}`);
      
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
                latitude: 25.8371,
                longitude: -106.6456
              },
              high: {
                latitude: 36.5007,
                longitude: -93.5080
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
        // Convert new API format to our expected format
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
        
        // Filter for Texas locations and avoid duplicates
        if (result.formatted_address.includes('TX') && 
            !seenPlaceIds.has(result.place_id)) {
          seenPlaceIds.add(result.place_id);
          allResults.push(result);
        }
      }
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
    }
  }
  
  console.log(`Found ${allResults.length} unique trampoline parks in Texas`);
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
    
    // Convert new API format to our expected format
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
    console.error(`Error getting details for place ${placeId}:`, error);
    return null;
  }
}

function parseAddress(formattedAddress: string) {
  // Parse "123 Main St, Austin, TX 78701, USA" format
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
  const stateZip = parts[2]; // "TX 78701"
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
      // For the new Places API (v1), photo references are in format "places/{place_id}/photos/{photo_id}"
      // We need to extract just the photo_id part for the legacy photo API
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
      metroArea: determineMetroArea(address.city),
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
    amenities: [], // Will need to be filled manually or from reviews
    pricing: {}, // Will need to be filled manually
    images: details.photos ? generatePhotoUrls(details.photos) : [],
    rating: details.rating,
    reviewCount: details.user_ratings_total,
    features: [], // Will need to be determined from business type or reviews
    ageGroups: ['kids', 'teens', 'adults'], // Default assumption
    slug: generateSlug(details.name, address.city),
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

function determineMetroArea(city: string): string {
  // Basic metro area mapping - can be refined after analyzing results
  const lowerCity = city.toLowerCase();
  
  if (['dallas', 'plano', 'frisco', 'mckinney', 'allen', 'richardson', 'garland', 'mesquite', 'carrollton'].includes(lowerCity)) {
    return 'Dallas-Fort Worth Metroplex';
  }
  if (['fort worth', 'arlington', 'irving', 'grand prairie', 'euless', 'bedford', 'hurst'].includes(lowerCity)) {
    return 'Dallas-Fort Worth Metroplex';
  }
  if (['houston', 'sugar land', 'the woodlands', 'pearland', 'pasadena', 'baytown', 'league city', 'missouri city'].includes(lowerCity)) {
    return 'Greater Houston Area';
  }
  if (['austin', 'round rock', 'cedar park', 'pflugerville', 'georgetown', 'leander', 'bee cave', 'lakeway', 'west lake hills'].includes(lowerCity)) {
    return 'Austin Metro';
  }
  if (['san antonio', 'new braunfels', 'schertz', 'universal city', 'converse'].includes(lowerCity)) {
    return 'San Antonio Metro';
  }
  
  return `${city} Area`;
}

async function main() {
  console.log('🏀 Starting Texas trampoline park collection...');
  
  try {
    // Search for parks
    const parks = await searchTrampolineParks();
    
    if (parks.length === 0) {
      console.log('No parks found. Check your API key and search terms.');
      return;
    }
    
    console.log('\n📍 Found parks in these cities:');
    const cities = [...new Set(parks.map(park => {
      const address = parseAddress(park.formatted_address);
      return address.city;
    }))].sort();
    cities.forEach(city => console.log(`  - ${city}`));
    
    // Get detailed information for each park
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
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save results
    const outputPath = path.join(__dirname, '../src/data/texas-parks.ts');
    const fileContent = `import { TrampolinePark } from '@/types/park';

export const texasParks: TrampolinePark[] = ${JSON.stringify(detailedParks, null, 2)};
`;
    
    fs.writeFileSync(outputPath, fileContent);
    
    console.log(`\n✅ Collected ${detailedParks.length} trampoline parks`);
    console.log(`📁 Data saved to: ${outputPath}`);
    
    // Show metro area distribution
    console.log('\n📊 Distribution by metro area:');
    const metroCount: { [key: string]: number } = {};
    detailedParks.forEach(park => {
      metroCount[park.address.metroArea] = (metroCount[park.address.metroArea] || 0) + 1;
    });
    
    Object.entries(metroCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([metro, count]) => {
        console.log(`  ${metro}: ${count} parks`);
      });
      
  } catch (error) {
    console.error('Error collecting park data:', error);
  }
}

if (require.main === module) {
  main();
}