'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TrampolinePark } from '@/types/park';

interface BasicMapboxMapProps {
  parks: TrampolinePark[];
  metroName: string;
  className?: string;
}

export default function BasicMapboxMap({ parks, metroName, className = '' }: BasicMapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [selectedPark, setSelectedPark] = useState<TrampolinePark | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter valid parks
  const validParks = parks.filter(park =>
    park.address.coordinates &&
    park.address.coordinates.lat &&
    park.address.coordinates.lng &&
    park.address.coordinates.lat !== 0 &&
    park.address.coordinates.lng !== 0
  );

  useEffect(() => {
    console.log('🎯 BasicMapboxMap useEffect triggered', {
      validParksCount: validParks.length,
      hasContainer: !!mapContainer.current
    });

    if (!validParks.length || !mapContainer.current) return;

    let mapboxgl: any;

    const loadMap = async () => {
      try {
        console.log('🚀 Starting map load...');

        // Check token
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!token) {
          console.error('❌ No Mapbox token found');
          setError('No Mapbox token found');
          setIsLoading(false);
          return;
        }

        console.log('✅ Token found, importing Mapbox GL...');

        // Import mapbox
        mapboxgl = (await import('mapbox-gl')).default;
        mapboxgl.accessToken = token;
        console.log('📦 Mapbox GL imported and token set');

        // Calculate bounds
        const lats = validParks.map(p => p.address.coordinates!.lat);
        const lngs = validParks.map(p => p.address.coordinates!.lng);
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;

        console.log('📍 Map center calculated:', { centerLng, centerLat });

        // Create map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [centerLng, centerLat],
          zoom: 9
        });

        console.log('🗺️ Map instance created');

        map.current.on('load', () => {
          console.log('🎉 Map loaded! Adding markers...');

          // Add numbered markers
          validParks.forEach((park, index) => {
            // Create custom numbered marker element
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

            // Add click listener
            el.addEventListener('click', () => {
              console.log('📍 Marker clicked:', park.name);
              setSelectedPark(park);
            });

            // Create marker with custom element
            new mapboxgl.Marker(el)
              .setLngLat([park.address.coordinates!.lng, park.address.coordinates!.lat])
              .addTo(map.current);
          });

          console.log(`📍 Added ${validParks.length} markers`);

          // Fit to bounds
          if (validParks.length > 1) {
            const bounds = new mapboxgl.LngLatBounds();
            validParks.forEach(park => {
              bounds.extend([park.address.coordinates!.lng, park.address.coordinates!.lat]);
            });
            map.current.fitBounds(bounds, { padding: 50 });
            console.log('🗺️ Fitted bounds to show all markers');
          }

          setIsLoading(false);
          console.log('✅ Map setup complete!');
        });

      } catch (err) {
        console.error('Map error:', err);
        setError('Failed to load map');
        setIsLoading(false);
      }
    };

    loadMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [validParks]);

  if (!validParks.length) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">No parks found in {metroName}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className={`flex bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Parks List */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="p-4 border-b bg-gray-50 flex-shrink-0">
          <h3 className="font-semibold">{validParks.length} Parks in {metroName}</h3>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {validParks.map((park, index) => (
            <div
              key={park.id}
              className={`p-4 border-b cursor-pointer hover:bg-blue-50 ${
                selectedPark?.id === park.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => setSelectedPark(park)}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  selectedPark?.id === park.id ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{park.name}</div>
                  <div className="text-sm text-gray-600">
                    {park.address.street}, {park.address.city}
                  </div>
                  {park.rating && (
                    <div className="text-sm text-yellow-600">★ {park.rating}</div>
                  )}
                  <Link
                    href={`/park/${park.slug}`}
                    className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-1/2 relative h-full">
        <div ref={mapContainer} className="w-full h-full" />

        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
              <p>Loading map...</p>
            </div>
          </div>
        )}

        {/* Selected Park Popup */}
        {selectedPark && !isLoading && (
          <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{selectedPark.name}</h4>
                <p className="text-sm text-gray-600">
                  {selectedPark.address.street}, {selectedPark.address.city}
                </p>
                <div className="mt-2 space-x-2">
                  {selectedPark.contact.phone && (
                    <a
                      href={`tel:${selectedPark.contact.phone}`}
                      className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded"
                    >
                      Call
                    </a>
                  )}
                  <Link
                    href={`/park/${selectedPark.slug}`}
                    className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded"
                  >
                    Details
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setSelectedPark(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}