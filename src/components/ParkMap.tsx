'use client';

import { useEffect, useRef, useState } from 'react';
import { TrampolinePark } from '@/types/park';

interface ParkMapProps {
  park: TrampolinePark;
  className?: string;
}

export default function ParkMap({ park, className = '' }: ParkMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we have valid coordinates
  const hasValidCoords = park.address.coordinates &&
    park.address.coordinates.lat &&
    park.address.coordinates.lng &&
    park.address.coordinates.lat !== 0 &&
    park.address.coordinates.lng !== 0;

  useEffect(() => {
    if (!hasValidCoords || !mapContainer.current) {
      setIsLoading(false);
      return;
    }

    let mapboxgl: any;

    const loadMap = async () => {
      try {
        // Check token
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!token) {
          setError('Map configuration error');
          setIsLoading(false);
          return;
        }

        // Import mapbox
        mapboxgl = (await import('mapbox-gl')).default;
        mapboxgl.accessToken = token;

        // Create map centered on the park
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [park.address.coordinates.lng, park.address.coordinates.lat],
          zoom: 12
        });

        map.current.on('load', () => {
          // Add a marker for the park
          new mapboxgl.Marker({
            color: '#2563eb'
          })
            .setLngLat([park.address.coordinates.lng, park.address.coordinates.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div class="p-2">
                  <h3 class="font-semibold">${park.name}</h3>
                  <p class="text-sm text-gray-600">${park.address.street}</p>
                  <p class="text-sm text-gray-600">${park.address.city}, ${park.address.state}</p>
                </div>`
              )
            )
            .addTo(map.current);

          setIsLoading(false);
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
  }, [hasValidCoords, park]);

  if (!hasValidCoords) {
    return (
      <div className={`aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-gray-500">Location information unavailable</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`aspect-[4/3] bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full aspect-[4/3] rounded-lg" />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}