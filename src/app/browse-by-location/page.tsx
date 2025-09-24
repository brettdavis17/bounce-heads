import Link from 'next/link';
import { HeaderBannerAd, ContentAd, FooterAd } from '@/components/AdSense';
import { PrismaClient } from '@prisma/client';

interface ParkFromDB {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  street: string;
  city: string;
  state: string;
  zipCode: string | null;
  metroArea: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  hours: any;
  amenities: any;
  features: any;
  ageGroups: any;
  pricing: any;
  images: any;
  lastUpdated: string;
  createdAt: Date;
  updatedAt: Date;
}

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

const prisma = new PrismaClient();

async function getParks(): Promise<ParkFromDB[]> {
  try {
    const parks = await prisma.trampolinePark.findMany({
      orderBy: [
        { rating: 'desc' },
        { name: 'asc' }
      ]
    });

    return parks.map(park => ({
      id: park.id,
      name: park.name,
      slug: park.slug,
      description: park.description,
      street: park.street,
      city: park.city,
      state: park.state,
      zipCode: park.zipCode,
      metroArea: park.metroArea,
      formattedAddress: park.formattedAddress,
      latitude: park.latitude,
      longitude: park.longitude,
      phone: park.phone,
      website: park.website,
      rating: park.rating,
      reviewCount: park.reviewCount,
      hours: park.hours,
      amenities: park.amenities,
      features: park.features,
      ageGroups: park.ageGroups,
      pricing: park.pricing,
      images: park.images,
      lastUpdated: park.lastUpdated,
      createdAt: park.createdAt,
      updatedAt: park.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching parks:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export const metadata = {
  title: 'Browse Trampoline Parks by Location | State & Metro Directory',
  description: 'Browse trampoline parks by state and metro area. Find parks in your area with our comprehensive location-based directory across the United States.',
};

export default async function BrowseByLocationPage() {
  const parks = await getParks();

  // Group parks by state and metro area
  const locationHierarchy = parks.reduce((acc, park) => {
    const state = park.state;
    const metro = park.metroArea;
    
    if (!acc[state]) {
      acc[state] = {
        parks: 0,
        metros: {}
      };
    }
    
    acc[state].parks++;
    
    if (!acc[state].metros[metro]) {
      acc[state].metros[metro] = {
        parks: 0,
        sections: new Set()
      };
    }
    
    acc[state].metros[metro].parks++;
    
    // Note: citySection is not in the current database schema
    // if (park.citySection) {
    //   acc[state].metros[metro].sections.add(park.citySection);
    // }
    
    return acc;
  }, {} as Record<string, { 
    parks: number; 
    metros: Record<string, { 
      parks: number; 
      sections: Set<string>; 
    }> 
  }>);

  const sortedStates = Object.keys(locationHierarchy).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="inline-block">
                <img
                  src="/wordmark.png"
                  alt="Trampoline Parks Directory"
                  width={300}
                  height={100}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <Link
                href="/directory"
                className="btn gradient-primary text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
              >
                Find Parks
              </Link>
            </div>
          </nav>

          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Browse by Location</span>
          </nav>

          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Browse Trampoline Parks by Location
            </h1>
            <p className="mt-3 text-lg text-gray-700 font-medium">
              Find trampoline parks in your state and metro area
            </p>
          </div>
        </div>
      </header>

      {/* Header Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <HeaderBannerAd className="mb-8" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {sortedStates.map(state => {
            const stateData = locationHierarchy[state];
            const stateSlug = createSlug(state);
            const sortedMetros = Object.keys(stateData.metros).sort();
            
            return (
              <div key={state} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <Link 
                    href={`/state/${stateSlug}`}
                    className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {state}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {stateData.parks} park{stateData.parks !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {sortedMetros.map(metro => {
                    const metroData = stateData.metros[metro];
                    const metroSlug = createSlug(metro);
                    const sectionsArray = Array.from(metroData.sections);
                    
                    return (
                      <div key={metro} className="border-l-2 border-blue-100 pl-4">
                        <div className="flex items-center justify-between">
                          <Link 
                            href={`/state/${stateSlug}/${metroSlug}`}
                            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                          >
                            {metro}
                          </Link>
                          <span className="text-xs text-gray-500">
                            {metroData.parks} park{metroData.parks !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {sectionsArray.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {sectionsArray.sort().map(section => (
                              <Link
                                key={section}
                                href={`/state/${stateSlug}/${metroSlug}/${createSlug(section)}`}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                              >
                                {section}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link 
                    href={`/state/${stateSlug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View all parks in {state} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Ad */}
        <div className="mt-12 mb-12">
          <ContentAd />
        </div>

        <section className="mt-16 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Browse by Location?
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Our location-based directory makes it easy to find trampoline parks near you. 
              We organize parks by state and metropolitan area, and for larger metro areas 
              like New York City, we break them down into specific boroughs and sections 
              for easier navigation.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Each location page provides detailed information about local trampoline parks, 
              including pricing, hours, amenities, and customer reviews to help you choose 
              the perfect destination for your family&apos;s bouncing adventure.
            </p>
          </div>
        </section>

        {/* Footer Ad */}
        <div className="mt-12">
          <FooterAd />
        </div>
      </main>
    </div>
  );
}