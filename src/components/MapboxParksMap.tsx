'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TrampolinePark } from '@/types/park';
import Link from 'next/link';

interface MapboxParksMapProps {
  parks: TrampolinePark[];
  metroName: string;
  className?: string;
}

export default function MapboxParksMap({ parks, metroName, className = '' }: MapboxParksMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPark, setSelectedPark] = useState<TrampolinePark | null>(null);
  const [hoveredPark, setHoveredPark] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Filter parks with valid coordinates
  const validParks = parks.filter(park =>
    park.address.coordinates &&
    park.address.coordinates.lat !== 0 &&
    park.address.coordinates.lng !== 0
  );

  useEffect(() => {
    if (!mapContainer.current || !validParks.length) return;

    // Initialize map
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox access token is required. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN environment variable.');
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')));
      return;
    }

    console.log('Mapbox token found, initializing map for', validParks.length, 'parks in', metroName);

    mapboxgl.accessToken = mapboxToken;

    // Calculate center and bounds
    const bounds = new mapboxgl.LngLatBounds();
    validParks.forEach(park => {
      bounds.extend([park.address.coordinates!.lng, park.address.coordinates!.lat]);
    });

    const center = bounds.getCenter();

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Use v11 for better compatibility
      center: [center.lng, center.lat],
      zoom: 10,
      attributionControl: false,
      crossSourceCollisions: false // Prevent layer conflicts
    });

    // Add custom attribution
    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-right');

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add error handling
    map.current.on('error', (e) => {
      console.error('Mapbox error:', e);
    });

    map.current.on('load', () => {
      console.log('Mapbox map loaded successfully');
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add markers for each park
      validParks.forEach((park, index) => {
        // Create custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'park-marker';
        markerEl.innerHTML = `
          <div class="marker-pin ${selectedPark?.id === park.id ? 'selected' : ''} ${hoveredPark === park.id ? 'hovered' : ''}">
            <div class="marker-content">
              <span class="marker-number">${index + 1}</span>
            </div>
          </div>
        `;

        // Add styles for marker
        const style = document.createElement('style');
        style.textContent = `
          .park-marker {
            cursor: pointer;
          }
          .marker-pin {
            width: 32px;
            height: 40px;
            position: relative;
            background: #2563eb;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            margin: 20px auto;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          }
          .marker-pin.selected {
            background: #dc2626;
            transform: rotate(-45deg) scale(1.2);
          }
          .marker-pin.hovered {
            transform: rotate(-45deg) scale(1.1);
          }
          .marker-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          }
          .marker-number {
            color: white;
            font-weight: bold;
            font-size: 12px;
          }
        `;
        document.head.appendChild(style);

        // Create marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([park.address.coordinates!.lng, park.address.coordinates!.lat])
          .addTo(map.current!);

        // Add click handler
        markerEl.addEventListener('click', () => {
          setSelectedPark(park);
          // Optionally center map on selected park
          map.current?.flyTo({
            center: [park.address.coordinates!.lng, park.address.coordinates!.lat],
            zoom: 12,
            duration: 1000
          });
        });

        markersRef.current.push(marker);
      });

      // Fit map to show all markers
      if (validParks.length > 1) {
        map.current?.fitBounds(bounds, {
          padding: 50,
          maxZoom: 12
        });
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [validParks, selectedPark, hoveredPark]);

  // Update marker styles when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const markerEl = marker.getElement();
      const pin = markerEl.querySelector('.marker-pin');
      if (pin) {
        pin.className = `marker-pin ${selectedPark?.id === validParks[index]?.id ? 'selected' : ''} ${hoveredPark === validParks[index]?.id ? 'hovered' : ''}`;
      }
    });
  }, [selectedPark, hoveredPark, validParks]);

  if (!validParks.length) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
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

  return (
    <div className={`flex h-full bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Parks List - Left Side (Scrollable) */}
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
                onMouseEnter={() => setHoveredPark(park.id)}
                onMouseLeave={() => setHoveredPark(null)}
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

                    <div className="flex items-center mt-2 space-x-4">
                      {park.rating && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-700">{park.rating} ({park.reviewCount})</span>
                        </div>
                      )}

                      {park.contact.phone && (
                        <a
                          href={`tel:${park.contact.phone}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {park.contact.phone}
                        </a>
                      )}
                    </div>

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

        {/* Selected Park Info Overlay */}
        {selectedPark && (
          <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{selectedPark.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedPark.address.street}, {selectedPark.address.city}
                </p>
                {selectedPark.rating && (
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-700">{selectedPark.rating} ({selectedPark.reviewCount} reviews)</span>
                  </div>
                )}
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