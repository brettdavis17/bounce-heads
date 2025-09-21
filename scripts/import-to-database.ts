import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { texasParks } from '../src/data/texas-parks';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function importParks() {
  console.log('🚀 Starting database import...');
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.trampolinePark.deleteMany();
    
    console.log(`📦 Importing ${texasParks.length} trampoline parks...`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const park of texasParks) {
      try {
        await prisma.trampolinePark.create({
          data: {
            id: park.id,
            name: park.name,
            slug: park.slug,
            description: park.description,
            
            // Address information
            street: park.address.street,
            city: park.address.city,
            state: park.address.state,
            zipCode: park.address.zipCode || null,
            metroArea: park.address.metroArea,
            formattedAddress: `${park.address.street}, ${park.address.city}, ${park.address.state} ${park.address.zipCode || ''}`.trim(),
            
            // Geographic coordinates
            latitude: park.address.coordinates?.lat || 0,
            longitude: park.address.coordinates?.lng || 0,
            
            // Contact information
            phone: park.contact.phone || null,
            website: park.contact.website || null,
            
            // Business details
            rating: park.rating || null,
            reviewCount: park.reviewCount || null,
            
            // JSON fields
            hours: park.hours,
            amenities: park.amenities,
            features: park.features,
            ageGroups: park.ageGroups,
            pricing: park.pricing,
            images: park.images,
            
            // Metadata
            lastUpdated: park.lastUpdated,
          },
        });
        
        imported++;
        
        if (imported % 10 === 0) {
          console.log(`  ✅ Imported ${imported}/${texasParks.length} parks...`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to import park "${park.name}":`, error);
        skipped++;
      }
    }
    
    console.log(`\n🎉 Import completed!`);
    console.log(`  ✅ Successfully imported: ${imported} parks`);
    console.log(`  ❌ Skipped due to errors: ${skipped} parks`);
    
    // Show some statistics
    const totalParks = await prisma.trampolinePark.count();
    console.log(`\n📊 Database statistics:`);
    console.log(`  Total parks: ${totalParks}`);
    
    // Show distribution by metro area
    const metroDistribution = await prisma.trampolinePark.groupBy({
      by: ['metroArea'],
      _count: { metroArea: true },
      orderBy: { _count: { metroArea: 'desc' } }
    });
    
    console.log(`\n🏙️  Parks by metro area:`);
    metroDistribution.slice(0, 10).forEach(metro => {
      console.log(`  ${metro.metroArea}: ${metro._count.metroArea} parks`);
    });
    
  } catch (error) {
    console.error('💥 Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Location-based query examples
async function testLocationQueries() {
  console.log('\n🗺️  Testing location-based queries...');
  
  try {
    // Find parks in specific cities
    const houstonParks = await prisma.trampolinePark.findMany({
      where: {
        city: 'Houston'
      },
      select: {
        name: true,
        city: true,
        rating: true
      }
    });
    
    console.log(`\n🏙️  Houston parks (${houstonParks.length}):`);
    houstonParks.forEach(park => {
      console.log(`  - ${park.name} (⭐ ${park.rating || 'N/A'})`);
    });
    
    // Find parks within a coordinate range (simple bounding box)
    const dallasArea = await prisma.$queryRaw`
      SELECT name, city, latitude, longitude, rating,
             (
               6371 * acos(
                 cos(radians(32.7767)) * cos(radians(latitude)) *
                 cos(radians(longitude) - radians(-96.7970)) +
                 sin(radians(32.7767)) * sin(radians(latitude))
               )
             ) AS distance_km
      FROM trampoline_parks
      WHERE (
        6371 * acos(
          cos(radians(32.7767)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(-96.7970)) +
          sin(radians(32.7767)) * sin(radians(latitude))
        )
      ) < 50
      ORDER BY distance_km
      LIMIT 5;
    `;
    
    console.log(`\n📍 Parks within 50km of Dallas:`);
    (dallasArea as any[]).forEach((park: any) => {
      console.log(`  - ${park.name} in ${park.city} (${Math.round(park.distance_km * 10) / 10}km away)`);
    });
    
  } catch (error) {
    console.error('❌ Location query test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await importParks();
  await testLocationQueries();
}

if (require.main === module) {
  main();
}