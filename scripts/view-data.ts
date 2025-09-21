import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function viewData() {
  console.log('🏀 Trampoline Parks Database Overview\n');
  
  // Total count
  const total = await prisma.trampolinePark.count();
  console.log(`📊 Total parks: ${total}\n`);
  
  // Sample parks
  const sampleParks = await prisma.trampolinePark.findMany({
    take: 5,
    select: {
      name: true,
      city: true,
      state: true,
      rating: true,
      phone: true,
      website: true
    },
    orderBy: { rating: 'desc' }
  });
  
  console.log('⭐ Top 5 Rated Parks:');
  sampleParks.forEach((park, i) => {
    console.log(`${i + 1}. ${park.name}`);
    console.log(`   📍 ${park.city}, ${park.state}`);
    console.log(`   ⭐ ${park.rating || 'No rating'}`);
    console.log(`   📞 ${park.phone || 'No phone'}`);
    console.log(`   🌐 ${park.website || 'No website'}\n`);
  });
  
  // Cities with most parks
  const cityCounts = await prisma.trampolinePark.groupBy({
    by: ['city'],
    _count: { city: true },
    orderBy: { _count: { city: 'desc' } },
    take: 5
  });
  
  console.log('🏙️ Cities with Most Parks:');
  cityCounts.forEach((city, i) => {
    console.log(`${i + 1}. ${city.city}: ${city._count.city} parks`);
  });
  
  await prisma.$disconnect();
}

viewData().catch(console.error);