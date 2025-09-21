/**
 * Google Places API attribution component
 * Required when using Google Places photos or data
 */

export function GooglePlacesAttribution({ className = '' }: { className?: string }) {
  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <span>Powered by </span>
      <a
        href="https://www.google.com/maps"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Google
      </a>
    </div>
  );
}

/**
 * Individual photo attribution for Google Places photos
 */
export function GooglePhotoAttribution({
  attributions,
  className = ''
}: {
  attributions: string[];
  className?: string;
}) {
  if (!attributions?.length) return null;

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      {attributions.map((attribution, index) => (
        <span key={index} dangerouslySetInnerHTML={{ __html: attribution }} />
      ))}
    </div>
  );
}