const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function createSlug(name, city, existingSlugs = new Set()) {
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

  let slug = baseSlug;
  let counter = 1;

  // If slug exists, append city
  if (existingSlugs.has(slug)) {
    const citySlug = city.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    slug = `${baseSlug}-${citySlug}`;
  }

  // If still exists, append counter
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  existingSlugs.add(slug);
  return slug;
}

function parseAddress(address) {
  const parts = address.split(', ');
  const street = parts[0];
  const city = parts[1];
  const stateZip = parts[2]?.split(' ') || [];
  const state = stateZip[0];
  const zipCode = stateZip[1];

  return { street, city, state, zipCode };
}

async function importParks() {
  const parks = [];
  const existingSlugs = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/brettdavis/xstudio/trampoline-parks-directory/texas_parks_raw_data.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.keep === 'TRUE') {
          const { street, city, state, zipCode } = parseAddress(row.address);

          parks.push({
            id: row.place_id,
            name: row.name,
            slug: createSlug(row.name, city, existingSlugs),
            description: null,
            street: street,
            city: city,
            state: state,
            zipCode: zipCode,
            metroArea: city, // Using city as metro area for now
            formattedAddress: row.address,
            latitude: parseFloat(row.lat),
            longitude: parseFloat(row.lng),
            phone: null,
            website: null,
            rating: row.rating ? parseFloat(row.rating) : null,
            reviewCount: row.review_count ? parseInt(row.review_count) : null,
            hours: null,
            amenities: null,
            features: null,
            ageGroups: null,
            pricing: null,
            images: null,
            lastUpdated: new Date().toISOString(),
          });
        }
      })
      .on('end', async () => {
        try {
          console.log(`Importing ${parks.length} parks...`);

          for (const park of parks) {
            await prisma.trampolinePark.upsert({
              where: { id: park.id },
              update: park,
              create: park,
            });
          }

          console.log('Import completed successfully!');
          resolve(parks.length);
        } catch (error) {
          console.error('Error importing parks:', error);
          reject(error);
        } finally {
          await prisma.$disconnect();
        }
      })
      .on('error', reject);
  });
}

importParks()
  .then((count) => {
    console.log(`Successfully imported ${count} trampoline parks`);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });