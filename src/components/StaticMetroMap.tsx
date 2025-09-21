'use client';

import { TrampolinePark } from '@/types/park';
import Link from 'next/link';

interface StaticMetroMapProps {
  parks: TrampolinePark[];
  metroName: string;
  className?: string;
}

export default function StaticMetroMap({ parks, metroName, className = '' }: StaticMetroMapProps) {
  // Filter parks with valid coordinates
  const validParks = parks.filter(park =>
    park.address.coordinates &&
    park.address.coordinates.lat !== 0 &&
    park.address.coordinates.lng !== 0
  );

  if (validParks.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Coming Soon</h3>
          <p className="text-gray-600">Location data is being processed for {metroName}</p>
        </div>
      </div>
    );
  }

  // Calculate bounds for static map
  const lats = validParks.map(p => p.address.coordinates!.lat);
  const lngs = validParks.map(p => p.address.coordinates!.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Add padding to bounds
  const latPadding = (maxLat - minLat) * 0.1 || 0.01;
  const lngPadding = (maxLng - minLng) * 0.1 || 0.01;

  // Create markers string for static map
  const markers = validParks.map((park, index) =>
    `&markers=color:blue%7Clabel:${index + 1}%7C${park.address.coordinates!.lat},${park.address.coordinates!.lng}`
  ).join('');

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?` +
    `center=${centerLat},${centerLng}` +
    `&zoom=11` +
    `&size=800x400` +
    `&maptype=roadmap` +
    `&style=feature:poi.business%7Celement:labels%7Cvisibility:off` +
    `&style=feature:poi.park%7Celement:labels%7Cvisibility:off` +
    `&style=feature:transit%7Celement:labels%7Cvisibility:off` +
    `&style=feature:road%7Celement:geometry%7Cvisibility:on%7Ccolor:0xffffff` +
    `&style=feature:road.highway%7Celement:geometry%7Cvisibility:on%7Ccolor:0xffeb3b%7Cweight:2` +
    `&style=feature:road.arterial%7Celement:geometry%7Cvisibility:on%7Ccolor:0xffffff%7Cweight:1` +
    `&style=feature:road%7Celement:labels%7Cvisibility:on` +
    `&style=feature:administrative%7Celement:geometry%7Cvisibility:on` +
    `&style=feature:administrative%7Celement:labels%7Cvisibility:on` +
    markers +
    `&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full rounded-xl overflow-hidden shadow-lg bg-gray-100">
        <img
          src={staticMapUrl}
          alt={`Map of trampoline parks in ${metroName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if static map fails
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                  <div class="text-center p-8">
                    <div class="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Map Temporarily Unavailable</h3>
                    <p class="text-gray-600">Please check the park list below</p>
                  </div>
                </div>
              `;
            }
          }}
        />
      </div>

      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
          {validParks.length} Parks in {metroName}
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {validParks.map((park, index) => (
            <div key={park.id} className="flex items-center text-xs">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 text-xs font-bold">
                {index + 1}
              </div>
              <Link
                href={`/park/${park.slug}`}
                className="text-gray-700 hover:text-blue-600 truncate font-medium"
                title={park.name}
              >
                {park.name.length > 20 ? park.name.substring(0, 20) + '...' : park.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Click overlay for larger maps */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity rounded-xl">
        <div className="bg-white rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-700 font-medium">Click markers for park details</p>
        </div>
      </div>
    </div>
  );
}