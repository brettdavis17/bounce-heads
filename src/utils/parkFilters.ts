import { TrampolinePark } from '@/types/park';

/**
 * Filters out bounce house rental companies from trampoline park listings
 * to ensure only legitimate trampoline parks are displayed
 */
export function filterOutBounceRentals(parks: TrampolinePark[]): TrampolinePark[] {
  const rentalKeywords = [
    'inflatables', 'rentals', 'rental', 'party rental', 
    'bounce house', 'bouncing elephant', 'space walk',
    'funtastic events', 'mr. inflatables', 'backyard bounce',
    'slide n bounce', 'jump n party', 'mad house',
    'texas jump n splash', "let's jump rentals", 
    "jerry's jump zone party", 'kellys party rental',
    'fireball rentals', 'party rentals', 'llc rental',
    'bounce on over', 'extreme bounce house', 'bounce house rocks',
    'east texas inflatables', 'j & m inflatables', 'bounce town inflatables',
    '947 inflatables'
  ];

  return parks.filter(park => {
    const nameCheck = park.name.toLowerCase();
    const descriptionCheck = park.description?.toLowerCase() || '';
    
    // Check if name contains rental keywords
    const hasRentalKeywords = rentalKeywords.some(keyword => 
      nameCheck.includes(keyword.toLowerCase())
    );
    
    // Check description for rental indicators
    const descriptionHasRentals = [
      'rental', 'inflatable', 'party supplies', 'bounce house rental',
      'party rental service', 'bounce house delivery', 'inflatable rental'
    ].some(keyword => descriptionCheck.includes(keyword));
    
    // Filter out if it matches rental criteria
    return !hasRentalKeywords && !descriptionHasRentals;
  });
}