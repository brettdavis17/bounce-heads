const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Map city names to consolidated metro areas
const cityToMetroMap = {
  // Dallas-Fort Worth Metroplex
  'Dallas': 'Dallas-Fort Worth Metroplex',
  'Fort Worth': 'Dallas-Fort Worth Metroplex',
  'Arlington': 'Dallas-Fort Worth Metroplex',
  'Irving': 'Dallas-Fort Worth Metroplex',
  'Garland': 'Dallas-Fort Worth Metroplex',
  'Grand Prairie': 'Dallas-Fort Worth Metroplex',
  'McKinney': 'Dallas-Fort Worth Metroplex',
  'Frisco': 'Dallas-Fort Worth Metroplex',
  'Allen': 'Dallas-Fort Worth Metroplex',
  'Mesquite': 'Dallas-Fort Worth Metroplex',
  'Richardson': 'Dallas-Fort Worth Metroplex',
  'Cedar Hill': 'Dallas-Fort Worth Metroplex',
  'North Richland Hills': 'Dallas-Fort Worth Metroplex',
  'Bedford': 'Dallas-Fort Worth Metroplex',
  'Grapevine': 'Dallas-Fort Worth Metroplex',
  'Crowley': 'Dallas-Fort Worth Metroplex',
  'Waxahachie': 'Dallas-Fort Worth Metroplex',
  'Rockwall': 'Dallas-Fort Worth Metroplex',
  'Hudson Oaks': 'Dallas-Fort Worth Metroplex',

  // Greater Houston Area
  'Houston': 'Greater Houston Area',
  'Webster': 'Greater Houston Area',
  'Humble': 'Greater Houston Area',
  'Katy': 'Greater Houston Area',
  'Spring': 'Greater Houston Area',
  'Sugar Land': 'Greater Houston Area',
  'Pasadena': 'Greater Houston Area',
  'Texas City': 'Greater Houston Area',
  'Baytown': 'Greater Houston Area',
  'League City': 'Greater Houston Area',
  'The Woodlands': 'Greater Houston Area',

  // Austin Metro
  'Austin': 'Austin Metro Area',
  'Cedar Park': 'Austin Metro Area',
  'Round Rock': 'Austin Metro Area',
  'Bee Cave': 'Austin Metro Area',

  // San Antonio Metro
  'San Antonio': 'San Antonio Metro Area',
  'Universal City': 'San Antonio Metro Area',
  'New Braunfels': 'San Antonio Metro Area',

  // East Texas
  'Tyler': 'East Texas',
  'Longview': 'East Texas',
  'Lufkin': 'East Texas',

  // Bryan-College Station
  'Bryan': 'Bryan-College Station Area',

  // Central Texas
  'Temple': 'Central Texas',
  'Waco': 'Central Texas',
  'Killeen': 'Central Texas',

  // Rio Grande Valley
  'McAllen': 'Rio Grande Valley',

  // Midland-Odessa
  'Odessa': 'Midland-Odessa',

  // South Texas
  'Corpus Christi': 'South Texas',
  'Beaumont': 'South Texas',

  // West Texas
  'El Paso': 'West Texas',

  // Other (keep as-is for now)
  'Frontage Road': 'Frontage Road'
};

async function updateMetroAreas() {
  console.log('Starting metro area updates...');

  try {
    // Get all parks
    const parks = await prisma.trampolinePark.findMany({
      select: { id: true, city: true, metroArea: true }
    });

    console.log(`Found ${parks.length} parks to process`);

    let updatedCount = 0;

    for (const park of parks) {
      const newMetroArea = cityToMetroMap[park.city];

      if (newMetroArea && newMetroArea !== park.metroArea) {
        await prisma.trampolinePark.update({
          where: { id: park.id },
          data: { metroArea: newMetroArea }
        });

        console.log(`Updated ${park.city}: "${park.metroArea}" -> "${newMetroArea}"`);
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} metro areas`);

    // Show the new distribution
    const metroDistribution = await prisma.trampolinePark.groupBy({
      by: ['metroArea'],
      _count: true,
      orderBy: { _count: { metroArea: 'desc' } }
    });

    console.log('\nNew metro area distribution:');
    metroDistribution.forEach(metro => {
      console.log(`${metro.metroArea}: ${metro._count} parks`);
    });

  } catch (error) {
    console.error('Error updating metro areas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMetroAreas();