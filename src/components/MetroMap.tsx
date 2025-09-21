'use client';

import { useEffect, useRef, useState } from 'react';
import { TrampolinePark } from '@/types/park';

interface MetroMapProps {
  parks: TrampolinePark[];
  metroName: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function MetroMap({ parks, metroName, className = '' }: MetroMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.');
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = (error) => {
        console.error('Failed to load Google Maps API:', error);
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Calculate center point from parks
      const validParks = parks.filter(park =>
        park.address.coordinates &&
        park.address.coordinates.lat !== 0 &&
        park.address.coordinates.lng !== 0
      );

      if (validParks.length === 0) {
        setIsLoaded(true);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      validParks.forEach(park => {
        bounds.extend(new window.google.maps.LatLng(park.address.coordinates!.lat, park.address.coordinates!.lng));
      });

      const center = bounds.getCenter();

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 10,
        styles: [
          // Hide most POI labels but keep important ones
          {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          // Hide transit labels but keep transit lines visible
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          // Enhance road visibility
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { color: '#ffffff' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { color: '#ffeb3b' }, { weight: 2 }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 1 }]
          },
          // Keep road labels visible
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          // Keep administrative boundaries
          {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'administrative',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Add markers for each park
      validParks.forEach((park, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: park.address.coordinates!.lat, lng: park.address.coordinates!.lng },
          map: mapInstance,
          title: park.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="#ffffff" stroke-width="3"/>
                <circle cx="16" cy="16" r="6" fill="#ffffff"/>
                <text x="16" y="20" font-family="Arial" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">${index + 1}</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-bold text-gray-900 mb-1">${park.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${park.address.street}, ${park.address.city}</p>
              ${park.contact.phone ? `<p class="text-sm text-blue-600">${park.contact.phone}</p>` : ''}
              <a href="/park/${park.slug}" class="inline-block mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                View Details
              </a>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });
      });

      // Fit map to show all markers
      if (validParks.length > 1) {
        mapInstance.fitBounds(bounds);
        // Add some padding
        const listener = window.google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
          if (mapInstance.getZoom() > 12) {
            mapInstance.setZoom(12);
          }
          window.google.maps.event.removeListener(listener);
        });
      }

      setMap(mapInstance);
      setIsLoaded(true);
    };

    loadGoogleMaps();
  }, [parks]);

  if (parks.filter(p => p.address.coordinates?.lat && p.address.coordinates?.lng).length === 0) {
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

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden shadow-lg" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
          {parks.filter(p => p.address.coordinates?.lat && p.address.coordinates?.lng).length} Parks in {metroName}
        </h4>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          Click markers for details
        </div>
      </div>
    </div>
  );
}