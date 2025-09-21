import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Photo API called with URL:', request.url);

  const { searchParams } = new URL(request.url);
  const photoReference = searchParams.get('ref');
  const maxWidth = searchParams.get('maxwidth') || '800';

  console.log('Photo reference:', photoReference?.substring(0, 50) + '...');
  console.log('Max width:', maxWidth);

  if (!photoReference) {
    console.log('No photo reference provided');
    return NextResponse.json({ error: 'Photo reference is required' }, { status: 400 });
  }

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!API_KEY) {
    console.log('No API key found');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Check if this looks like a Places API v1 photo reference (starts with AciIO2)
    if (photoReference.startsWith('AciIO2')) {
      // Extract place ID and photo name from the URL parameters
      const placeIdParam = searchParams.get('placeId');
      if (!placeIdParam) {
        console.log('Places API v1 photo reference but no place ID provided');
        return new NextResponse(null, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
          }
        });
      }

      // Construct the Google Places API v1 photo URL
      const photoUrl = `https://places.googleapis.com/v1/places/${placeIdParam}/photos/${photoReference}/media?maxHeightPx=${maxWidth}&maxWidthPx=${maxWidth}&key=${API_KEY}`;
      console.log('Fetching from Google Places API v1:', photoUrl.substring(0, 120) + '...');

      // Fetch the image from Google
      const response = await fetch(photoUrl);
      console.log('Google response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Google error response:', errorText);
        return new NextResponse(null, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
          }
        });
      }

      // Get the image data
      const imageData = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      console.log('Returning Places API v1 image, content-type:', contentType, 'size:', imageData.byteLength);

      // Return the image with proper headers
      return new NextResponse(imageData, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
      });
    }

    // Construct the Google Places photo URL (legacy format)
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=${maxWidth}&key=${API_KEY}`;
    console.log('Fetching from Google legacy API:', photoUrl.substring(0, 120) + '...');

    // Fetch the image from Google
    const response = await fetch(photoUrl);
    console.log('Google response status:', response.status);
    console.log('Google response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Google error response:', errorText);

      // If it's a 403 error, return a proper placeholder instead of failing
      if (response.status === 403) {
        console.log('Returning placeholder due to 403 error');
        // Return a simple placeholder response
        return new NextResponse(null, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
          }
        });
      }

      throw new Error(`Failed to fetch photo: ${response.status} - ${errorText}`);
    }

    // Get the image data
    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    console.log('Returning legacy image, content-type:', contentType, 'size:', imageData.byteLength);

    // Return the image with proper headers
    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}