import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

if (!API_KEY) {
  console.error('Please set GOOGLE_PLACES_API_KEY environment variable');
  process.exit(1);
}

async function testPhotoRetrieval() {
  console.log('🧪 Testing photo retrieval...');
  
  try {
    // Search for a known Austin trampoline park
    const searchResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: 'Urban Air Austin Texas',
        locationRestriction: {
          rectangle: {
            low: { latitude: 30.0, longitude: -98.0 },
            high: { latitude: 30.5, longitude: -97.5 }
          }
        }
      })
    });
    
    const searchData = await searchResponse.json();
    const places = searchData.places || [];
    
    if (places.length === 0) {
      console.log('❌ No places found in search');
      return;
    }
    
    const place = places[0];
    console.log(`✅ Found: ${place.displayName?.text}`);
    console.log(`📍 Address: ${place.formattedAddress}`);
    
    // Get detailed info with photos
    const detailsResponse = await fetch(`https://places.googleapis.com/v1/places/${place.id}`, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,photos'
      }
    });
    
    const details = await detailsResponse.json();
    console.log(`📸 Found ${details.photos?.length || 0} photos`);
    
    if (details.photos && details.photos.length > 0) {
      console.log('\\n🖼️  Photo references:');
      details.photos.slice(0, 3).forEach((photo: any, index: number) => {
        console.log(`  ${index + 1}. ${photo.name}`);
        
        // Generate photo URL
        const photoId = photo.name.split('/').pop();
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoId}&maxwidth=800&key=${API_KEY}`;
        console.log(`     URL: ${photoUrl}`);
      });
      
      console.log('\\n✅ Photo collection is working! You can test these URLs in a browser.');
    } else {
      console.log('❌ No photos found for this place');
    }
    
  } catch (error) {
    console.error('❌ Error testing photos:', error);
  }
}

if (require.main === module) {
  testPhotoRetrieval();
}