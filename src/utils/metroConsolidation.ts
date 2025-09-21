// Metro area consolidation rules for cleaner location browsing
export const texasMetroConsolidation: Record<string, string> = {
  // Dallas-Fort Worth Metroplex consolidations
  'North Richland Hills Area': 'Dallas-Fort Worth Metroplex',
  'Cedar Hill Area': 'Dallas-Fort Worth Metroplex',
  'Rockwall Area': 'Dallas-Fort Worth Metroplex',
  'Hudson Oaks Area': 'Dallas-Fort Worth Metroplex',
  'Waxahachie Area': 'Dallas-Fort Worth Metroplex',
  'Haltom City Area': 'Dallas-Fort Worth Metroplex',
  'Grapevine Area': 'Dallas-Fort Worth Metroplex',
  'Crowley Area': 'Dallas-Fort Worth Metroplex',
  'Ennis Area': 'Dallas-Fort Worth Metroplex',

  // Greater Houston Area consolidations
  'Webster Area': 'Greater Houston Area',
  'Humble Area': 'Greater Houston Area',
  'Texas City Area': 'Greater Houston Area',
  'Spring Area': 'Greater Houston Area',
  'Katy Area': 'Greater Houston Area',
  'Tomball Area': 'Greater Houston Area',
  'Cypress Area': 'Greater Houston Area',

  // Central Texas consolidations
  'Temple Area': 'Central Texas',
  'Waco Area': 'Central Texas',

  // Austin Metro consolidations
  // (Temple moved to Central Texas)

  // San Antonio Metro consolidations
  // (Waco moved to Central Texas)

  // East Texas consolidations - consolidate all into East Texas
  'Tyler Area': 'East Texas',
  'Longview Area': 'East Texas',
  'Lufkin Area': 'East Texas',
  'Gladewater Area': 'East Texas',
  'Whitehouse Area': 'East Texas',
  'Kilgore Area': 'East Texas',
  'Hawkins Area': 'East Texas',
  'Henderson Area': 'East Texas',
  'Hughes Springs Area': 'East Texas',
  'Canton Area': 'East Texas',
  'Sulphur Springs Area': 'East Texas',
  'Ore City Area': 'East Texas',

  // College Station area
  'Bryan Area': 'Bryan-College Station Area',

  // Midland-Odessa consolidations
  'Odessa Area': 'Midland-Odessa',

  // Keep as standalone metros (far from major metros)
  // 'El Paso Area' - keep separate
  // 'McAllen Area' - keep separate
  // 'Frontage Road Area' - keep separate (unclear location)
};

/**
 * Consolidates metro area names for Texas to reduce clutter in location browsing
 */
export function consolidateTexasMetro(metroArea: string, state: string): string {
  if (state !== 'Texas') {
    return metroArea;
  }

  return texasMetroConsolidation[metroArea] || metroArea;
}