const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCyjZvaGjF_IwUY8qT75iKQpMXWU3_0Crk';
const DELAY_BETWEEN_REQUESTS = 200; // ms delay to avoid rate limits
const IMAGE_QUALITY = 800; // pixels for both width and height

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

async function downloadImage(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);
    return buffer.length;
  } catch (error) {
    console.error(`Failed to download image: ${error.message}`);
    throw error;
  }
}

function generateGooglePhotoUrl(photoData, placeId) {
  if (!photoData || !photoData.name) {
    throw new Error('Invalid photo data');
  }

  // Extract photo reference from the name field
  const nameParts = photoData.name.split('/');
  if (nameParts.length < 4) {
    throw new Error(`Invalid photo name format: ${photoData.name}`);
  }

  const photoReference = nameParts[3];
  return `https://places.googleapis.com/v1/places/${placeId}/photos/${photoReference}/media?maxHeightPx=${IMAGE_QUALITY}&maxWidthPx=${IMAGE_QUALITY}&key=${GOOGLE_PLACES_API_KEY}`;
}

function getImageExtension(contentType) {
  switch (contentType) {
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return '.jpg'; // Default fallback
  }
}

async function downloadParkImages() {
  try {
    console.log('Starting image download process...');

    // Ensure base images directory exists
    const baseImagesDir = path.join(process.cwd(), 'public', 'images', 'parks');
    await ensureDirectoryExists(baseImagesDir);

    // Get all parks that have photo metadata
    const parks = await prisma.trampolinePark.findMany({
      where: {
        images: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        images: true
      }
    });

    console.log(`Found ${parks.length} parks with photos to download`);

    let totalDownloaded = 0;
    let totalSize = 0;
    let errorCount = 0;

    for (const park of parks) {
      try {
        console.log(`\\nProcessing: ${park.name} (${park.city})`);

        const parkDir = path.join(baseImagesDir, park.slug);
        await ensureDirectoryExists(parkDir);

        const images = Array.isArray(park.images) ? park.images : [];
        const localImagePaths = [];

        for (let i = 0; i < images.length; i++) {
          const photoData = images[i];

          try {
            // Generate Google Places photo URL
            const googleUrl = generateGooglePhotoUrl(photoData, park.id);

            // First, get the image to determine content type
            const response = await fetch(googleUrl);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            const extension = getImageExtension(contentType);
            const fileName = `${i + 1}${extension}`;
            const filePath = path.join(parkDir, fileName);
            const relativePath = `/images/parks/${park.slug}/${fileName}`;

            // Download and save the image
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.writeFile(filePath, buffer);

            localImagePaths.push({
              path: relativePath,
              width: photoData.widthPx,
              height: photoData.heightPx,
              authorAttributions: photoData.authorAttributions
            });

            totalSize += buffer.length;
            totalDownloaded++;

            console.log(`  ✅ Downloaded photo ${i + 1}: ${fileName} (${(buffer.length / 1024).toFixed(1)}KB)`);

            // Rate limiting delay
            await delay(DELAY_BETWEEN_REQUESTS);

          } catch (error) {
            console.error(`  ❌ Failed to download photo ${i + 1}: ${error.message}`);
            errorCount++;
          }
        }

        // Update database with local image paths
        if (localImagePaths.length > 0) {
          await prisma.trampolinePark.update({
            where: { id: park.id },
            data: {
              images: localImagePaths
            }
          });
          console.log(`  📁 Updated database with ${localImagePaths.length} local image paths`);
        }

      } catch (error) {
        console.error(`❌ Error processing ${park.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\\n=== Image Download Complete ===`);
    console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
    console.log(`📊 Total size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`💰 Estimated API cost: $${((totalDownloaded / 1000) * 7).toFixed(2)}`);

  } catch (error) {
    console.error('Error in downloadParkImages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script if called directly
if (require.main === module) {
  downloadParkImages()
    .then(() => {
      console.log('\\nImage download process completed successfully!');
      console.log('You can now update your components to use local image paths.');
    })
    .catch(error => {
      console.error('Image download process failed:', error);
      process.exit(1);
    });
}

module.exports = { downloadParkImages };