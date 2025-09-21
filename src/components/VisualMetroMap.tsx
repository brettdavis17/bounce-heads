'use client';

import { TrampolinePark } from '@/types/park';
import Link from 'next/link';
import { getMetroBackground, getTerrainPattern } from './MetroMapBackgrounds';

interface VisualMetroMapProps {
  parks: TrampolinePark[];
  metroName: string;
  stateName?: string;
  className?: string;
}

export default function VisualMetroMap({ parks, metroName, stateName = '', className = '' }: VisualMetroMapProps) {
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Parks Overview</h3>
          <p className="text-gray-600">Location data is being processed for {metroName}</p>
        </div>
      </div>
    );
  }

  // Get metro-specific background
  const metroBackground = getMetroBackground(metroName, stateName);
  const terrainInfo = getTerrainPattern(metroBackground.terrain);

  // Calculate relative positions for visual representation
  const lats = validParks.map(p => p.address.coordinates!.lat);
  const lngs = validParks.map(p => p.address.coordinates!.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Add padding to bounds
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;
  const padding = 0.1;

  const parksWithPositions = validParks.map((park, index) => {
    const lat = park.address.coordinates!.lat;
    const lng = park.address.coordinates!.lng;

    // Convert lat/lng to relative position (0-1)
    const x = (lng - minLng + lngRange * padding) / (lngRange * (1 + 2 * padding));
    const y = 1 - (lat - minLat + latRange * padding) / (latRange * (1 + 2 * padding)); // Invert Y for map display

    return {
      ...park,
      position: { x: Math.max(0.05, Math.min(0.95, x)), y: Math.max(0.05, Math.min(0.95, y)) },
      index: index + 1
    };
  });

  return (
    <div className={`relative ${className}`}>
      {/* Visual Map Container */}
      <div className={`w-full h-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${terrainInfo.background} border-2 border-gray-300 relative`}>

        {/* Map Base Layer - Geographic Features */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              {/* Patterns for different terrain */}
              <pattern id="urban" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect width="20" height="20" fill="#f3f4f6"/>
                <rect x="0" y="0" width="8" height="8" fill="#e5e7eb"/>
                <rect x="12" y="12" width="8" height="8" fill="#e5e7eb"/>
              </pattern>

              <pattern id="suburban" patternUnits="userSpaceOnUse" width="30" height="30">
                <rect width="30" height="30" fill="#f0fdf4"/>
                <circle cx="15" cy="15" r="3" fill="#dcfce7"/>
              </pattern>

              {/* Water pattern */}
              <pattern id="water" patternUnits="userSpaceOnUse" width="40" height="20">
                <rect width="40" height="20" fill="#dbeafe"/>
                <path d="M0,10 Q10,5 20,10 T40,10" stroke="#bfdbfe" strokeWidth="1" fill="none"/>
              </pattern>
            </defs>

            {/* Urban Areas */}
            <rect x="20%" y="30%" width="60%" height="40%" fill="url(#urban)" opacity="0.4" rx="8"/>

            {/* Suburban Areas */}
            <rect x="10%" y="20%" width="25%" height="30%" fill="url(#suburban)" opacity="0.3" rx="6"/>
            <rect x="65%" y="50%" width="30%" height="35%" fill="url(#suburban)" opacity="0.3" rx="6"/>

            {/* Water Bodies - Metro Specific */}
            {metroBackground.lakes.map((lake, idx) => (
              <ellipse
                key={`lake-${idx}`}
                cx={lake.cx}
                cy={lake.cy}
                rx={lake.rx}
                ry={lake.ry}
                fill="url(#water)"
                opacity="0.6"
              />
            ))}
            {metroBackground.rivers.map((riverPath, idx) => (
              <path
                key={`river-${idx}`}
                d={riverPath}
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                opacity="0.4"
              />
            ))}

            {/* Major Roads/Highways - Metro Specific */}
            <g strokeLinecap="round">
              {metroBackground.highways.map((highway, idx) => (
                <g key={`highway-${idx}`}>
                  {/* Highway base */}
                  <path d={highway.path} stroke="#374151" strokeWidth="12" fill="none" opacity="1"/>
                  {/* Highway center line */}
                  <path d={highway.path} stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.9"/>
                  {/* Highway markers */}
                  <path d={highway.path} stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.8" strokeDasharray="15,10"/>
                  {/* Highway label */}
                  <text
                    x={highway.labelX}
                    y={highway.labelY}
                    fill="#374151"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="drop-shadow-sm"
                    style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
                  >
                    {highway.name}
                  </text>
                </g>
              ))}
            </g>

            {/* City Blocks/Buildings */}
            <g fill="#d1d5db" opacity="0.4">
              {/* Downtown blocks */}
              <rect x="22%" y="35%" width="3%" height="8%" rx="1"/>
              <rect x="26%" y="38%" width="2%" height="6%" rx="1"/>
              <rect x="29%" y="36%" width="4%" height="7%" rx="1"/>
              <rect x="20%" y="48%" width="3%" height="5%" rx="1"/>
              <rect x="24%" y="46%" width="2%" height="8%" rx="1"/>

              {/* Midtown blocks */}
              <rect x="72%" y="28%" width="2%" height="4%" rx="1"/>
              <rect x="75%" y="30%" width="3%" height="6%" rx="1"/>
              <rect x="78%" y="27%" width="2%" height="5%" rx="1"/>

              {/* Scattered buildings */}
              <rect x="15%" y="20%" width="2%" height="3%" rx="1"/>
              <rect x="18%" y="22%" width="1.5%" height="4%" rx="1"/>
              <rect x="82%" y="60%" width="2%" height="4%" rx="1"/>
              <rect x="85%" y="58%" width="1.5%" height="3%" rx="1"/>
            </g>

            {/* Parks/Green spaces */}
            <g fill="#22c55e" opacity="0.3">
              <ellipse cx="45%" cy="30%" rx="4%" ry="3%"/>
              <ellipse cx="60%" cy="70%" rx="3%" ry="2%"/>
              <rect x="12%" y="85%" width="8%" height="4%" rx="2"/>
            </g>

            {/* Neighborhoods/Districts - Metro Specific */}
            {metroBackground.districts.map((district, idx) => (
              <text
                key={`district-${idx}`}
                x={district.x}
                y={district.y}
                fill="#374151"
                fontSize={idx === 0 ? "10" : "8"}
                fontWeight="bold"
                opacity="0.7"
                textAnchor="middle"
              >
                {district.name}
              </text>
            ))}
          </svg>
        </div>

        {/* Subtle topographic lines */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <path d="M 0 25% Q 50% 20% 100% 25%" stroke="#64748b" strokeWidth="1" fill="none"/>
            <path d="M 0 50% Q 50% 45% 100% 50%" stroke="#64748b" strokeWidth="1" fill="none"/>
            <path d="M 0 75% Q 50% 70% 100% 75%" stroke="#64748b" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        {/* Park Markers */}
        {parksWithPositions.map((park, idx) => (
          <div
            key={park.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${park.position.x * 100}%`,
              top: `${park.position.y * 100}%`,
            }}
          >
            {/* Marker - Map Pin Style */}
            <div className="relative">
              {/* Map Pin Shape */}
              <div className="relative transform transition-all duration-200 group-hover:scale-125">
                <svg width="32" height="40" viewBox="0 0 32 40" className="drop-shadow-lg">
                  <path
                    d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z"
                    fill="url(#gradient-red)"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cx="16" cy="16" r="8" fill="#ffffff"/>
                  <text x="16" y="20" textAnchor="middle" className="text-xs font-bold fill-red-600">
                    {park.index}
                  </text>
                  <defs>
                    <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444"/>
                      <stop offset="100%" stopColor="#dc2626"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Subtle shadow */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black rounded-full opacity-20 blur-sm"></div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{park.name}</div>
                  <div className="text-gray-300">{park.address.city}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Metro Area Label */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <h3 className="font-bold text-gray-900 text-sm">{metroName}</h3>
          <p className="text-xs text-gray-600">{validParks.length} Trampoline Parks</p>
        </div>
      </div>

      {/* Legend/Park List */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Park Locations</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {parksWithPositions.map((park) => (
            <Link
              key={park.id}
              href={`/park/${park.slug}`}
              className="flex items-center space-x-2 text-xs hover:bg-gray-100 p-1 rounded transition-colors"
            >
              <div className="w-6 h-6 relative flex items-center justify-center flex-shrink-0">
                <svg width="20" height="24" viewBox="0 0 32 40" className="drop-shadow-sm">
                  <path
                    d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cx="16" cy="16" r="8" fill="#ffffff"/>
                  <text x="16" y="20" textAnchor="middle" className="text-xs font-bold fill-red-600">
                    {park.index}
                  </text>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{park.name}</div>
                <div className="text-gray-500 truncate">{park.address.city}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
        <div className="w-8 h-8 relative">
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="2"/>
            <path d="M12 2 L14 10 L12 8 L10 10 Z" fill="#ef4444"/>
            <text x="12" y="6" textAnchor="middle" className="text-xs font-bold fill-gray-700">N</text>
          </svg>
        </div>
      </div>
    </div>
  );
}