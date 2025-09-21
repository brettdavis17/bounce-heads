/**
 * Utility functions for working with Google Places photos
 */

interface GooglePhotoOptions {
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Generates a Google Places photo URL from a photo reference
 * @param photoReference - The photo reference from Google Places API
 * @param options - Size options for the photo
 * @returns The complete photo URL
 */
export function getGooglePhotoUrl(
  photoReference: string,
  options: GooglePhotoOptions = {}
): string {
  const { maxWidth = 800, maxHeight } = options;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('Google Places API key not found');
    return '';
  }

  const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
  const params = new URLSearchParams({
    photo_reference: photoReference,
    key: apiKey,
  });

  if (maxWidth) {
    params.append('maxwidth', maxWidth.toString());
  }

  if (maxHeight) {
    params.append('maxheight', maxHeight.toString());
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Gets all available photo URLs for a park (both local and Google Photos)
 * @param park - The trampoline park object
 * @param googlePhotoOptions - Options for Google Photos sizing
 * @returns Array of photo URLs with their sources
 */
export function getAllParkPhotoUrls(
  park: { images: string[]; googlePhotos?: { photoReference: string; attributions: string[] }[] },
  googlePhotoOptions: GooglePhotoOptions = {}
): Array<{ url: string; source: 'local' | 'google'; attributions?: string[] }> {
  const photos: Array<{ url: string; source: 'local' | 'google'; attributions?: string[] }> = [];

  // Add local images
  park.images.forEach(imageUrl => {
    photos.push({
      url: imageUrl,
      source: 'local'
    });
  });

  // Add Google Photos
  park.googlePhotos?.forEach(googlePhoto => {
    const url = getGooglePhotoUrl(googlePhoto.photoReference, googlePhotoOptions);
    if (url) {
      photos.push({
        url,
        source: 'google',
        attributions: googlePhoto.attributions
      });
    }
  });

  return photos;
}

