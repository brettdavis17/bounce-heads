// Metro-specific map backgrounds based on actual geography

export const getMetroBackground = (metroName: string, stateName: string) => {
  const key = `${stateName}-${metroName}`.toLowerCase();

  switch (key) {
    case 'texas-austin metro':
    case 'texas-austin-metro':
      return {
        // Austin: Colorado River, Lake Austin, downtown core, hills
        rivers: [
          'M 10% 60% Q 30% 55% 50% 60% T 90% 65%', // Colorado River
        ],
        lakes: [
          { cx: '25%', cy: '40%', rx: '8%', ry: '4%' }, // Lake Austin
          { cx: '75%', cy: '30%', rx: '6%', ry: '3%' }, // Lake Travis area
        ],
        highways: [
          { path: 'M 0 70% L 100% 70%', name: 'I-35', labelX: '50%', labelY: '72%' },
          { path: 'M 45% 0 L 45% 100%', name: 'MoPac', labelX: '47%', labelY: '50%' },
          { path: 'M 0 40% L 100% 45%', name: 'US-290', labelX: '50%', labelY: '42%' },
        ],
        districts: [
          { name: 'DOWNTOWN', x: '45%', y: '65%' },
          { name: 'SOUTH AUSTIN', x: '45%', y: '80%' },
          { name: 'CEDAR PARK', x: '35%', y: '30%' },
          { name: 'ROUND ROCK', x: '55%', y: '25%' },
        ],
        terrain: 'hills', // Austin Hill Country
        buildings: 'scattered', // Spread out city
      };

    case 'texas-dallas-fort worth metroplex':
    case 'texas-dallas-metro':
      return {
        rivers: [
          'M 30% 100% Q 40% 80% 50% 70% T 70% 60%', // Trinity River
        ],
        lakes: [
          { cx: '20%', cy: '40%', rx: '5%', ry: '3%' }, // Lake Worth
          { cx: '80%', cy: '20%', rx: '7%', ry: '4%' }, // Lake Ray Hubbard
        ],
        highways: [
          { path: 'M 0 60% L 100% 60%', name: 'I-20', labelX: '50%', labelY: '62%' },
          { path: 'M 0 40% L 100% 40%', name: 'I-30', labelX: '50%', labelY: '42%' },
          { path: 'M 40% 0 L 40% 100%', name: 'I-35E', labelX: '42%', labelY: '50%' },
          { path: 'M 60% 0 L 60% 100%', name: 'I-35W', labelX: '62%', labelY: '50%' },
        ],
        districts: [
          { name: 'DALLAS', x: '60%', y: '50%' },
          { name: 'FORT WORTH', x: '25%', y: '55%' },
          { name: 'PLANO', x: '65%', y: '25%' },
          { name: 'ARLINGTON', x: '45%', y: '60%' },
        ],
        terrain: 'flat',
        buildings: 'dense',
      };

    case 'texas-houston metro':
    case 'texas-greater houston area':
    case 'texas-greater-houston-area':
      return {
        rivers: [
          'M 20% 0 Q 30% 30% 40% 50% T 60% 100%', // Buffalo Bayou/Ship Channel
        ],
        lakes: [
          { cx: '15%', cy: '80%', rx: '12%', ry: '8%' }, // Galveston Bay
        ],
        highways: [
          { path: 'M 0 50% L 100% 50%', name: 'I-10', labelX: '50%', labelY: '52%' },
          { path: 'M 40% 0 L 40% 100%', name: 'I-45', labelX: '42%', labelY: '50%' },
          { path: 'M 0 30% Q 50% 25% 100% 30%', name: 'US-290', labelX: '50%', labelY: '28%' },
        ],
        districts: [
          { name: 'DOWNTOWN', x: '40%', y: '50%' },
          { name: 'THE WOODLANDS', x: '45%', y: '15%' },
          { name: 'KATY', x: '15%', y: '45%' },
          { name: 'PEARLAND', x: '45%', y: '75%' },
        ],
        terrain: 'flat',
        buildings: 'sprawl',
      };

    case 'texas-longview area':
    case 'texas-longview-area':
      return {
        rivers: [
          'M 0 40% Q 40% 35% 80% 40% L 100% 45%', // Sabine River
        ],
        lakes: [
          { cx: '30%', cy: '60%', rx: '8%', ry: '5%' }, // Lake Cherokee
        ],
        highways: [
          { path: 'M 0 50% L 100% 50%', name: 'I-20', labelX: '50%', labelY: '52%' },
          { path: 'M 40% 0 L 40% 100%', name: 'US-259', labelX: '42%', labelY: '50%' },
        ],
        districts: [
          { name: 'LONGVIEW', x: '45%', y: '55%' },
          { name: 'MARSHALL', x: '15%', y: '60%' },
        ],
        terrain: 'forest',
        buildings: 'small-town',
      };

    case 'texas-tyler metro':
    case 'texas-tyler-metro':
      return {
        rivers: [
          'M 0 70% Q 50% 65% 100% 70%', // Neches River
        ],
        lakes: [
          { cx: '20%', cy: '30%', rx: '6%', ry: '4%' }, // Lake Palestine
          { cx: '75%', cy: '45%', rx: '5%', ry: '3%' }, // Lake Tyler
        ],
        highways: [
          { path: 'M 0 60% L 100% 60%', name: 'I-20', labelX: '50%', labelY: '62%' },
          { path: 'M 45% 0 L 45% 100%', name: 'US-69', labelX: '47%', labelY: '50%' },
        ],
        districts: [
          { name: 'TYLER', x: '50%', y: '55%' },
          { name: 'KILGORE', x: '65%', y: '70%' },
        ],
        terrain: 'forest',
        buildings: 'medium',
      };

    // San Francisco Bay Area
    case 'california-san francisco bay area':
    case 'california-san-francisco-bay-area':
      return {
        rivers: [],
        lakes: [
          { cx: '50%', cy: '60%', rx: '25%', ry: '15%' }, // San Francisco Bay
        ],
        highways: [
          { path: 'M 0 40% L 100% 40%', name: 'I-80', labelX: '50%', labelY: '42%' },
          { path: 'M 20% 0 L 20% 100%', name: 'I-280', labelX: '22%', labelY: '50%' },
          { path: 'M 70% 0 L 70% 100%', name: 'I-880', labelX: '72%', labelY: '50%' },
        ],
        districts: [
          { name: 'SAN FRANCISCO', x: '25%', y: '35%' },
          { name: 'OAKLAND', x: '45%', y: '45%' },
          { name: 'SAN JOSE', x: '60%', y: '80%' },
          { name: 'PALO ALTO', x: '40%', y: '70%' },
        ],
        terrain: 'hills',
        buildings: 'dense',
      };

    // Default fallback for unknown metros
    default:
      return {
        rivers: [
          'M 20% 100% Q 40% 70% 70% 80% T 90% 20%',
        ],
        lakes: [
          { cx: '70%', cy: '30%', rx: '8%', ry: '5%' },
        ],
        highways: [
          { path: 'M 0 50% L 100% 50%', name: 'Main St', labelX: '50%', labelY: '52%' },
          { path: 'M 40% 0 L 40% 100%', name: 'Central Ave', labelX: '42%', labelY: '50%' },
        ],
        districts: [
          { name: 'DOWNTOWN', x: '45%', y: '55%' },
          { name: 'UPTOWN', x: '60%', y: '35%' },
        ],
        terrain: 'mixed',
        buildings: 'medium',
      };
  }
};

export const getTerrainPattern = (terrain: string) => {
  switch (terrain) {
    case 'hills':
      return {
        background: 'from-green-100 via-yellow-50 to-green-50',
        pattern: 'hills',
      };
    case 'flat':
      return {
        background: 'from-gray-50 via-green-50 to-gray-100',
        pattern: 'flat',
      };
    case 'forest':
      return {
        background: 'from-green-200 via-green-100 to-green-50',
        pattern: 'forest',
      };
    default:
      return {
        background: 'from-gray-100 via-green-50 to-gray-50',
        pattern: 'mixed',
      };
  }
};