import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const prisma = new PrismaClient();

// Parks to remove by ID
const PARKS_TO_REMOVE = [
  'ChIJoxvjXzQ_NoYR7hH3JDwi17s', // "Arcade" in Longview, TX
  'ChIJXV_VgYYjNoYRnjt_Ewj5-gM', // "Skydive East Texas" in Gladewater, TX
];

async function removeParksByIds(ids: string[]) {
  console.log('🗑️  Removing specific parks from database...');

  try {
    // First, show what we're about to delete
    const parksToDelete = await prisma.trampolinePark.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true
      }
    });

    if (parksToDelete.length === 0) {
      console.log('⚠️  No parks found with the specified IDs.');
      return;
    }

    console.log('\n📋 Parks to be removed:');
    parksToDelete.forEach(park => {
      console.log(`  - ${park.name} (${park.city}, ${park.state}) [ID: ${park.id}]`);
    });

    // Delete the parks
    const result = await prisma.trampolinePark.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    console.log(`\n✅ Successfully removed ${result.count} park(s)`);

    // Show updated count
    const totalParks = await prisma.trampolinePark.count();
    console.log(`📊 Total parks remaining: ${totalParks}`);

  } catch (error) {
    console.error('❌ Failed to remove parks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function removeParksByName(names: string[]) {
  console.log('🗑️  Removing parks by name...');

  try {
    // First, show what we're about to delete
    const parksToDelete = await prisma.trampolinePark.findMany({
      where: {
        name: {
          in: names
        }
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true
      }
    });

    if (parksToDelete.length === 0) {
      console.log('⚠️  No parks found with the specified names.');
      return;
    }

    console.log('\n📋 Parks to be removed:');
    parksToDelete.forEach(park => {
      console.log(`  - ${park.name} (${park.city}, ${park.state}) [ID: ${park.id}]`);
    });

    // Delete the parks
    const result = await prisma.trampolinePark.deleteMany({
      where: {
        name: {
          in: names
        }
      }
    });

    console.log(`\n✅ Successfully removed ${result.count} park(s)`);

    // Show updated count
    const totalParks = await prisma.trampolinePark.count();
    console.log(`📊 Total parks remaining: ${totalParks}`);

  } catch (error) {
    console.error('❌ Failed to remove parks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function removeFromSourceAndReimport() {
  console.log('🔄 Removing from source data and reimporting...');

  try {
    // This would require editing the texas-parks.ts file to remove the entries
    // and then running the import script again
    console.log('⚠️  This method requires manual editing of src/data/texas-parks.ts');
    console.log('   1. Remove the problematic entries from the source file');
    console.log('   2. Run: npm run tsx scripts/import-to-database.ts');

  } catch (error) {
    console.error('❌ Process failed:', error);
  }
}

async function main() {
  const method = process.argv[2] || 'ids';

  switch (method) {
    case 'ids':
      await removeParksByIds(PARKS_TO_REMOVE);
      break;
    case 'names':
      await removeParksByName(['Arcade', 'Skydive East Texas']);
      break;
    case 'source':
      await removeFromSourceAndReimport();
      break;
    default:
      console.log('Usage:');
      console.log('  npx tsx remove-parks.ts ids     # Remove by IDs (recommended)');
      console.log('  npx tsx remove-parks.ts names   # Remove by names');
      console.log('  npx tsx remove-parks.ts source  # Instructions for source removal');
  }
}

if (require.main === module) {
  main();
}