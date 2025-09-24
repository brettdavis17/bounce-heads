import { notFound } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import ParkMap from '@/components/ParkMap';
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

interface ParkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const prisma = new PrismaClient();

async function getPark(slug: string): Promise<ParkFromDB | null> {
  try {
    const park = await prisma.trampolinePark.findUnique({
      where: { slug }
    });

    if (!park) {
      return null;
    }

    return {
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
    };
  } catch (error) {
    console.error('Error fetching park:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function generateMetadata({ params }: ParkPageProps) {
  const resolvedParams = await params;
  const park = await getPark(resolvedParams.slug);

  if (!park) {
    return {
      title: 'Park Not Found',
    };
  }

  return {
    title: `${park.name} - ${park.city}, ${park.state} | Trampoline Park`,
    description: `${park.description || 'Trampoline park'} Hours, pricing, amenities, and photos for ${park.name} in ${park.city}, ${park.state}.`,
  };
}

export default async function ParkPage({ params }: ParkPageProps) {
  const resolvedParams = await params;
  const park = await getPark(resolvedParams.slug);

  if (!park) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="inline-block">
                <img
                  src="/wordmark.png"
                  alt="Trampoline Parks Directory"
                  width={300}
                  height={100}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <Link
                href="/directory"
                className="btn gradient-primary text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
              >
                Find Parks
              </Link>
              <Link
                href="/browse-by-location"
                className="btn border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Browse by Location
              </Link>
            </div>
          </nav>

          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/directory" className="hover:text-blue-600">Directory</Link>
            <span>›</span>
            <Link href={`/state/${park.state.toLowerCase()}`} className="hover:text-blue-600">{park.state}</Link>
            <span>›</span>
            <Link href={`/state/${park.state.toLowerCase()}/${park.metroArea.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600">{park.metroArea}</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{park.name}</span>
          </nav>
          
          <div className="lg:flex lg:items-start lg:justify-between lg:space-x-8">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-3">
                {park.name}
              </h1>
              <div className="flex items-center text-gray-600 mb-4 lg:mb-6">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">
                  {park.street}, {park.city}, {park.state} {park.zipCode}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-0 lg:space-y-4">
              {park.rating && (
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xl font-medium text-gray-900">
                    {park.rating}
                  </span>
                  <span className="text-gray-500 ml-2">({park.reviewCount} reviews)</span>
                </div>
              )}
              {park.phone && (
                <a
                  href={`tel:${park.phone}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
                >
                  Call {park.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Header Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <HeaderBannerAd className="mb-8" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div>
            {/* Description & Features */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Park</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {park.description || 'This trampoline park offers fun activities for all ages with a variety of features and amenities.'}
              </p>

              {/* Features Grid */}
              {park.features && Array.isArray(park.features) && park.features.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {park.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Age Groups */}
              {park.ageGroups && Array.isArray(park.ageGroups) && park.ageGroups.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Perfect For:</h3>
                  <div className="flex flex-wrap gap-2">
                    {park.ageGroups.map((group, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hours & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hours & Contact */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hours & Contact</h2>

            {/* Hours */}
            {park.hours && Object.keys(park.hours).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hours of Operation</h3>
                <div className="space-y-2">
                  {Object.entries(park.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-4">
              {park.phone && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a
                    href={`tel:${park.phone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {park.phone}
                  </a>
                </div>
              )}
              {park.website && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                  <a
                    href={park.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div className="text-gray-600">
                  {park.street}<br/>
                  {park.city}, {park.state} {park.zipCode}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
            <ParkMap park={{
              ...park,
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
              features: Array.isArray(park.features) ? park.features : [],
              ageGroups: Array.isArray(park.ageGroups) ? park.ageGroups : [],
              description: park.description || '',
              slug: park.slug,
              lastUpdated: park.lastUpdated,
              rating: park.rating || undefined,
              reviewCount: park.reviewCount || undefined
            }} />
          </div>
        </div>

        {/* Photos Section */}
        {park.images && Array.isArray(park.images) && park.images.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <ImageGallery images={park.images} parkName={park.name} />
          </div>
        )}

        {/* Pricing & Additional Info */}
        {park.pricing && Object.keys(park.pricing).length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(park.pricing).map(([type, price]) => (
                <div key={type} className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">{type}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">{price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Ad */}
        <div className="mt-12">
          <ContentAd />
        </div>

        {/* Footer Ad */}
        <div className="mt-12">
          <FooterAd />
        </div>
      </main>
    </div>
  );
}