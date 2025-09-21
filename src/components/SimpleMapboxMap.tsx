'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TrampolinePark } from '@/types/park';

interface SimpleMapboxMapProps {
  parks: TrampolinePark[];
  metroName: string;
  className?: string;
}

export default function SimpleMapboxMap({ parks, metroName, className = '' }: SimpleMapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [selectedPark, setSelectedPark] = useState<TrampolinePark | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Filter parks with valid coordinates
  const validParks = parks.filter(park =>
    park.address.coordinates &&
    park.address.coordinates.lat !== 0 &&
    park.address.coordinates.lng !== 0
  );

  useEffect(() => {
    if (!mapContainer.current || !validParks.length || map.current) return;

    const initMap = async () => {
      try {
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!mapboxToken) {
          setMapError('Mapbox token required');
          return;
        }

        console.log('🚀 Starting minimal Mapbox setup...', {
          tokenPresent: !!mapboxToken,
          parksCount: validParks.length
        });

        // Import Mapbox with better error handling
        let mapboxgl;
        try {
          mapboxgl = await import('mapbox-gl');
          console.log('📦 Mapbox GL loaded successfully');
        } catch (importError) {
          console.error('❌ Failed to import Mapbox GL:', importError);
          setMapError('Failed to load map library');
          return;
        }

        // Ensure we have the right object structure
        if (!mapboxgl.default || !mapboxgl.default.Map) {
          console.error('❌ Mapbox GL structure invalid:', mapboxgl);
          setMapError('Invalid map library');
          return;
        }

        mapboxgl.default.accessToken = mapboxToken;

        // Calculate center
        const lats = validParks.map(p => p.address.coordinates!.lat);
        const lngs = validParks.map(p => p.address.coordinates!.lng);
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

        console.log(`📍 Map center: [${centerLng.toFixed(4)}, ${centerLat.toFixed(4)}]`);

        // Create map with absolute minimal config
        try {
          map.current = new mapboxgl.default.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [centerLng, centerLat],
            zoom: 10
          });
          console.log('🗺️ Map instance created successfully');
        } catch (mapError) {
          console.error('❌ Failed to create map instance:', mapError);
          setMapError('Failed to create map');
          return;
        }

        // ONLY listen for load event - ignore ALL error events
        map.current.on('load', () => {
          console.log('✅ Map loaded successfully!');
          setMapLoaded(true);
          setMapError(null);

          // Add simple markers
          validParks.forEach((park, index) => {
            const el = document.createElement('div');
            el.style.cssText = `
              width: 30px;
              height: 30px;
              background: #2563eb;
              border: 2px solid white;
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            `;
            el.textContent = (index + 1).toString();
            el.addEventListener('click', () => setSelectedPark(park));

            new mapboxgl.default.Marker(el)
              .setLngLat([park.address.coordinates!.lng, park.address.coordinates!.lat])
              .addTo(map.current);
          });

          // Fit bounds if multiple parks
          if (validParks.length > 1) {
            const bounds = new mapboxgl.default.LngLatBounds();
            validParks.forEach(park => {
              bounds.extend([park.address.coordinates!.lng, park.address.coordinates!.lat]);
            });
            map.current.fitBounds(bounds, { padding: 50 });
          }
        });

        // Set timeout for loading
        setTimeout(() => {
          if (!mapLoaded) {
            console.warn('⏰ Map taking longer than expected');
            setMapError('Map is loading slowly. Please wait...');
          }
        }, 10000);

      } catch (error) {
        console.error('❌ Map initialization failed:', error);
        setMapError('Failed to initialize map');
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [validParks]);

  if (!validParks.length) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Parks Found</h3>
          <p className="text-gray-600">No parks with valid coordinates in {metroName}</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700 text-sm">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Parks List - Left Side */}
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            {validParks.length} Trampoline Parks in {metroName}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {validParks.map((park, index) => (
              <div
                key={park.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-blue-50 ${
                  selectedPark?.id === park.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => setSelectedPark(park)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    selectedPark?.id === park.id ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {park.name}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {park.address.street}, {park.address.city}
                    </p>

                    {park.rating && (
                      <div className="flex items-center mt-2">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-700">{park.rating}</span>
                      </div>
                    )}

                    <div className="mt-2">
                      <Link
                        href={`/park/${park.slug}`}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map - Right Side */}
      <div className="w-1/2 relative">
        <div ref={mapContainer} className="w-full h-full" />

        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* Selected Park Info */}
        {selectedPark && mapLoaded && (
          <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{selectedPark.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedPark.address.street}, {selectedPark.address.city}
                </p>
                <div className="flex space-x-2">
                  {selectedPark.contact.phone && (
                    <a
                      href={`tel:${selectedPark.contact.phone}`}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Call
                    </a>
                  )}
                  <Link
                    href={`/park/${selectedPark.slug}`}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Details
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setSelectedPark(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}