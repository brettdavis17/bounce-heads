import Link from 'next/link';
import MapboxParksMap from '@/components/MapboxParksMap';
import { HeaderBannerAd, ContentAd, FooterAd } from '@/components/AdSense';

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

interface MetroPageProps {
  params: Promise<{
    state: string;
    metro: string;
  }>;
}

function slugToMetroArea(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function getParksInMetro(metroSlug: string): Promise<ParkFromDB[]> {
  try {
    const metroArea = slugToMetroArea(metroSlug);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/parks`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return [];
    }

    const allParks = await response.json();

    // Filter parks by metro area (case insensitive, handle hyphens and spaces)
    const normalizeForComparison = (str: string) =>
      str.toLowerCase().replace(/[-\s]/g, '');

    const normalizedMetroArea = normalizeForComparison(metroArea);

    return allParks.filter((park: ParkFromDB) => {
      const normalizedParkMetro = normalizeForComparison(park.metroArea);
      return normalizedParkMetro.includes(normalizedMetroArea) ||
             normalizedMetroArea.includes(normalizedParkMetro);
    });
  } catch (error) {
    console.error('Error fetching parks:', error);
    return [];
  }
}

// Transform database parks to TrampolinePark interface for map component
function transformParksForMap(dbParks: ParkFromDB[]) {
  return dbParks.map(park => ({
    id: park.id,
    name: park.name,
    slug: park.slug,
    description: park.description || '',
    address: {
      street: park.street,
      city: park.city,
      state: park.state,
      zipCode: park.zipCode || '',
      metroArea: park.metroArea,
      coordinates: {
        lat: park.latitude,
        lng: park.longitude
      }
    },
    contact: {
      phone: park.phone || '',
      website: park.website || ''
    },
    hours: park.hours || {},
    amenities: Array.isArray(park.amenities) ? park.amenities : [],
    pricing: park.pricing || {},
    images: Array.isArray(park.images) ? park.images : [],
    rating: park.rating || undefined,
    reviewCount: park.reviewCount || undefined,
    features: Array.isArray(park.features) ? park.features : [],
    ageGroups: Array.isArray(park.ageGroups) ? park.ageGroups : [],
    lastUpdated: park.lastUpdated
  }));
}

export async function generateMetadata({ params }: MetroPageProps) {
  const { state, metro } = await params;
  const metroDisplayName = slugToMetroArea(metro);
  const stateDisplayName = state.toUpperCase();
  const dbParks = await getParksInMetro(metro);

  const title = `${dbParks.length} Trampoline Parks in ${metroDisplayName}, ${stateDisplayName} | Directory`;
  const description = `Find the best trampoline parks in ${metroDisplayName}, ${stateDisplayName}. View locations, hours, pricing, and reviews for ${dbParks.length} parks in the ${metroDisplayName} area.`;

  return {
    title,
    description,
    keywords: `trampoline parks ${metroDisplayName}, ${stateDisplayName} trampoline parks, family fun ${metroDisplayName}, indoor activities ${metroDisplayName}, birthday parties ${metroDisplayName}`,
    openGraph: {
      title,
      description,
      url: `https://trampolineparks.directory/state/${state}/${metro}`,
      siteName: "Trampoline Parks Directory",
      images: [
        {
          url: "https://trampolineparks.directory/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Trampoline Parks in ${metroDisplayName}, ${stateDisplayName}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://trampolineparks.directory/twitter-image.jpg"],
    },
    alternates: {
      canonical: `https://trampolineparks.directory/state/${state}/${metro}`,
    },
  };
}

export default async function MetroPage({ params }: MetroPageProps) {
  const { state, metro } = await params;
  const dbParks = await getParksInMetro(metro);
  const metroDisplayName = slugToMetroArea(metro);
  const parks = transformParksForMap(dbParks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/directory" className="hover:text-blue-600">Directory</Link>
            <span>›</span>
            <Link href={`/state/${state}`} className="hover:text-blue-600">{state.toUpperCase()}</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{metroDisplayName}</span>
          </nav>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trampoline Parks in {metroDisplayName}
            </h1>
            <p className="text-lg text-gray-600">
              {parks.length} trampoline park{parks.length !== 1 ? 's' : ''} found in the {metroDisplayName} area
            </p>
          </div>
        </div>
      </header>

      {/* Header Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <HeaderBannerAd className="mb-8" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {parks.length > 0 ? (
          <>
            {/* Map Section */}
            <div className="mb-12">
              <div className="h-96 lg:h-[600px] w-full">
                <MapboxParksMap
                  parks={parks}
                  metroName={metroDisplayName}
                  className="h-full"
                />
              </div>
            </div>

            {/* Park Cards Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Parks</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dbParks.map((park) => (
                  <ParkCard key={park.id} park={park} />
                ))}
              </div>
            </div>

            {/* Content Ad */}
            <div className="mt-12">
              <ContentAd />
            </div>

            {/* Footer Ad */}
            <div className="mt-12">
              <FooterAd />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No trampoline parks found in {metroDisplayName}.
            </p>
            <Link
              href="/directory"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse All Parks
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function ParkCard({ park }: { park: ParkFromDB }) {
  const features = park.features ? (Array.isArray(park.features) ? park.features : []) : [];
  const pricing = park.pricing ? (typeof park.pricing === 'object' ? park.pricing : {}) : {};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          <Link href={`/park/${park.slug}`} className="hover:text-blue-600">
            {park.name}
          </Link>
        </h3>

        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600">
            {park.city}, {park.state}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {park.description || 'Trampoline park offering fun activities for all ages.'}
        </p>

        <div className="flex items-center justify-between mb-4">
          {park.rating && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-700 font-medium">
                {park.rating} {park.reviewCount && `(${park.reviewCount} reviews)`}
              </span>
            </div>
          )}
          {pricing.general && (
            <div className="text-blue-600 font-semibold">
              {pricing.general}
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{features.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">{park.street}</span>
          </div>
          {park.phone && (
            <a
              href={`tel:${park.phone}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {park.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}