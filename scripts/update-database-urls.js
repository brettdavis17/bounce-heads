require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function updateImageUrls() {
  try {
    // Load URL mappings from the upload script
    if (!fs.existsSync('./url-mappings.json')) {
      throw new Error('URL mappings file not found! Run upload-to-cloud-storage.js first.');
    }

    const urlMappings = JSON.parse(fs.readFileSync('./url-mappings.json', 'utf8'));
    console.log(`Loaded ${Object.keys(urlMappings).length} URL mappings`);

    // Get all parks with images
    const parks = await prisma.trampolinePark.findMany({
      where: {
        images: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        images: true
      }
    });

    console.log(`Found ${parks.length} parks with images to update`);

    let totalUpdated = 0;

    for (const park of parks) {
      let images = park.images;
      let updated = false;

      // Handle array of image objects (new format)
      if (Array.isArray(images)) {
        images = images.map(image => {
          if (image && image.path && urlMappings[image.path]) {
            console.log(`  Updating: ${image.path} -> ${urlMappings[image.path]}`);
            updated = true;
            return {
              ...image,
              path: urlMappings[image.path]
            };
          }
          return image;
        });
      }
      // Handle array of strings (legacy format)
      else if (typeof images === 'object' && images !== null) {
        // This might be a legacy format, skip for now
        console.log(`  Skipping ${park.name}: legacy image format`);
        continue;
      }

      if (updated) {
        await prisma.trampolinePark.update({
          where: { id: park.id },
          data: { images: images }
        });
        totalUpdated++;
        console.log(`✓ Updated ${park.name}`);
      } else {
        console.log(`  No updates needed for ${park.name}`);
      }
    }

    console.log(`\n✅ Database update complete!`);
    console.log(`📊 Updated ${totalUpdated} parks with new Cloud Storage URLs`);

  } catch (error) {
    console.error('❌ Database update failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
if (require.main === module) {
  updateImageUrls()
    .then(() => {
      console.log('\n🎉 All database URLs updated successfully!');
      console.log('\nNext steps:');
      console.log('1. Test your website to ensure images load from Cloud Storage');
      console.log('2. Update Next.js image configuration for the new domain');
      console.log('3. Remove local images from repository');
    })
    .catch((error) => {
      console.error('Update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateImageUrls };