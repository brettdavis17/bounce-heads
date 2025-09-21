'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [parks, setParks] = useState<ParkFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchParks();
  }, []);

  const fetchParks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parks');
      if (!response.ok) {
        throw new Error('Failed to fetch parks');
      }
      const data = await response.json();
      setParks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load parks');
    } finally {
      setLoading(false);
    }
  };

  const filteredParks = parks.filter(park => {
    const matchesSearch = park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         park.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (park.description && park.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesState = !selectedState || park.state === selectedState;
    return matchesSearch && matchesState;
  });

  const states = [...new Set(parks.map(park => park.state))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent hover:from-purple-600 hover:via-orange-500 hover:to-red-500">
                Trampoline Parks Directory
              </Link>
              <p className="mt-2 text-lg text-gray-700 font-medium">
                Find the best trampoline parks across the United States
              </p>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Find Trampoline Parks Near You</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, city, or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading trampoline parks...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <button
              onClick={fetchParks}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredParks.map((park) => (
                <ParkCard key={park.id} park={park} />
              ))}
            </div>

            {filteredParks.length === 0 && parks.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No trampoline parks found matching your criteria.
                </p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search terms or selecting a different state.
                </p>
              </div>
            )}
          </>
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
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">{park.formattedAddress}</span>
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