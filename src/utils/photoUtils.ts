/**
 * Converts a Google Places API photo URL to use our local proxy API or returns direct URL if CORS allows
 * Handles both legacy and new Google Places API formats
 */
export function convertToProxyPhotoUrl(googlePhotoUrl: string): string {
  try {
    const url = new URL(googlePhotoUrl);

    // Check if this is a new Google Places API v1 URL
    if (googlePhotoUrl.includes('places.googleapis.com/v1/places/') && googlePhotoUrl.includes('/photos/') && googlePhotoUrl.includes('/media')) {
      // New Places API v1 format - extract place ID and photo reference
      const placeIdMatch = googlePhotoUrl.match(/\/places\/([^\/]+)\/photos/);
      const photoRefMatch = googlePhotoUrl.match(/\/photos\/([^\/]+)\/media/);

      if (placeIdMatch && photoRefMatch && placeIdMatch[1] && photoRefMatch[1]) {
        const placeId = placeIdMatch[1];
        const photoReference = photoRefMatch[1];
        console.log('Converting Places API v1 URL to proxy:', googlePhotoUrl.substring(0, 100) + '...');
        return `/api/photo?ref=${encodeURIComponent(photoReference)}&placeId=${encodeURIComponent(placeId)}&maxwidth=800`;
      }
    }

    // Legacy format handling
    const photoReference = url.searchParams.get('photoreference');
    const maxWidth = url.searchParams.get('maxwidth') || '800';

    if (!photoReference) {
      console.warn('No photo reference found in legacy URL:', googlePhotoUrl);
      return '/placeholder-image.svg'; // Fallback to a placeholder
    }

    // Debug logging to see what we're converting
    console.log('Converting legacy Google URL:', googlePhotoUrl.substring(0, 100) + '...');
    console.log('Extracted photo reference:', photoReference.substring(0, 50) + '...');

    return `/api/photo?ref=${encodeURIComponent(photoReference)}&maxwidth=${maxWidth}`;
  } catch (error) {
    console.warn('Invalid photo URL:', googlePhotoUrl, error);
    return '/placeholder-image.svg'; // Fallback to a placeholder
  }
}

/**
 * Converts an array of photo URLs to proxy URLs
 */
export function convertPhotoUrls(photoUrls: string[]): string[] {
  return photoUrls.map(url => {
    // Handle Google Cloud Storage URLs
    if (url.startsWith('https://storage.googleapis.com/')) {
      return `/api/image?url=${encodeURIComponent(url)}`;
    }
    // Handle Google Places API URLs
    return convertToProxyPhotoUrl(url);
  });
}

/**
 * Generate Google Places photo URL from stored photo reference object
 * Uses a proxy API to avoid CORS issues
 */
export function generatePhotoUrl(photoData: any, maxWidth = 400, maxHeight = 400): string {
  if (!photoData || !photoData.name) {
    return '/placeholder-image.svg';
  }

  // Extract photo reference from the name field
  // Format: places/PLACE_ID/photos/PHOTO_REFERENCE/media
  const nameParts = photoData.name.split('/');
  if (nameParts.length < 4) {
    console.warn('Invalid photo name format:', photoData.name);
    return '/placeholder-image.svg';
  }

  const placeId = nameParts[1];
  const photoReference = nameParts[3];

  // Use local proxy API to avoid CORS issues
  return `/api/photo?ref=${encodeURIComponent(photoReference)}&placeId=${encodeURIComponent(placeId)}&maxwidth=${maxWidth}&maxheight=${maxHeight}`;
}

/**
 * Convert array of photo objects from database to URLs
 * Now handles both legacy Google references and new local paths
 */
export function convertPhotoObjectsToUrls(photos: any[], maxWidth = 400, maxHeight = 400): string[] {
  if (!photos || !Array.isArray(photos)) {
    return [];
  }

  return photos
    .filter(photo => photo && (photo.path || photo.name))
    .map(photo => {
      // New format: Google Cloud Storage paths - use proxy for CORS
      if (photo.path && photo.path.startsWith('https://storage.googleapis.com/')) {
        return `/api/image?url=${encodeURIComponent(photo.path)}`;
      }
      // New format: other local file paths
      if (photo.path) {
        return photo.path;
      }
      // Legacy format: Google Places API references
      if (photo.name) {
        return generatePhotoUrl(photo, maxWidth, maxHeight);
      }
      return '/placeholder-image.svg';
    })
    .filter(url => url && url !== '/placeholder-image.svg');
}