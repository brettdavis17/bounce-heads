const { PrismaClient, Prisma } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCyjZvaGjF_IwUY8qT75iKQpMXWU3_0Crk';
const MAX_PHOTOS_PER_PARK = 5; // Limit photos per park
const DELAY_BETWEEN_REQUESTS = 100; // ms delay to avoid rate limits

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPlacePhotos(placeId) {
  try {
    console.log(`Fetching photos for place: ${placeId}`);

    // Step 1: Get photo metadata
    const photosResponse = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=photos&key=${GOOGLE_PLACES_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'photos',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY
        }
      }
    );

    if (!photosResponse.ok) {
      console.error(`Failed to fetch photos metadata for ${placeId}: ${photosResponse.status}`);
      return [];
    }

    const photosData = await photosResponse.json();

    if (!photosData.photos || photosData.photos.length === 0) {
      console.log(`No photos found for place: ${placeId}`);
      return [];
    }

    console.log(`Found ${photosData.photos.length} photos for ${placeId}`);

    // Step 2: Build photo URLs (we'll store the photo reference and construct URLs dynamically)
    const photoReferences = photosData.photos
      .slice(0, MAX_PHOTOS_PER_PARK)
      .map(photo => ({
        name: photo.name,
        widthPx: photo.widthPx,
        heightPx: photo.heightPx,
        authorAttributions: photo.authorAttributions || []
      }));

    return photoReferences;

  } catch (error) {
    console.error(`Error fetching photos for ${placeId}:`, error.message);
    return [];
  }
}

async function updateParkPhotos() {
  try {
    console.log('Starting photo fetch process...');

    // Get all parks that don't have photos yet
    const parks = await prisma.trampolinePark.findMany({
      where: {
        OR: [
          { images: { equals: Prisma.DbNull } },
          { images: { equals: Prisma.JsonNull } }
        ]
      },
      select: {
        id: true,
        name: true,
        city: true
      }
    });

    console.log(`Found ${parks.length} parks without photos`);

    let successCount = 0;
    let errorCount = 0;

    for (const park of parks) {
      try {
        console.log(`\nProcessing: ${park.name} (${park.city})`);

        // Fetch photos for this park
        const photos = await fetchPlacePhotos(park.id);

        if (photos.length > 0) {
          // Update the park with photo data
          await prisma.trampolinePark.update({
            where: { id: park.id },
            data: {
              images: photos
            }
          });

          console.log(`✅ Updated ${park.name} with ${photos.length} photos`);
          successCount++;
        } else {
          console.log(`⚠️  No photos found for ${park.name}`);
        }

        // Rate limiting delay
        await delay(DELAY_BETWEEN_REQUESTS);

      } catch (error) {
        console.error(`❌ Error processing ${park.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n=== Photo Fetch Complete ===`);
    console.log(`✅ Successfully updated: ${successCount} parks`);
    console.log(`❌ Errors: ${errorCount} parks`);
    console.log(`⚠️  No photos: ${parks.length - successCount - errorCount} parks`);

  } catch (error) {
    console.error('Error in updateParkPhotos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to generate photo URL from stored data
function generatePhotoUrl(photoName, maxWidth = 400, maxHeight = 400) {
  // Extract the photo ID from the full name
  const photoId = photoName.split('/').pop();
  return `https://places.googleapis.com/v1/places/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${GOOGLE_PLACES_API_KEY}`;
}

// Export the helper function
module.exports = { generatePhotoUrl };

// Run the script if called directly
if (require.main === module) {
  updateParkPhotos()
    .then(() => {
      console.log('Photo fetch process completed');
    })
    .catch(error => {
      console.error('Photo fetch process failed:', error);
      process.exit(1);
    });
}