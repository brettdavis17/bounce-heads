'use client';

import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  onClick,
  fill = false,
  sizes,
  priority = false
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.log('Image failed to load:', src);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // For Google Places API URLs and our proxy API, use regular img tag to avoid Next.js optimization
  const isGooglePlacesUrl = src.includes('places.googleapis.com') || src.includes('maps.googleapis.com') || src.startsWith('/api/photo');

  // Debug logging
  console.log('OptimizedImage src:', src);
  console.log('isGooglePlacesUrl:', isGooglePlacesUrl);
  console.log('src.startsWith("/api/"):', src.startsWith('/api/'));
  console.log('src.startsWith("/images/"):', src.startsWith('/images/'));
  console.log('Should use regular img:', isGooglePlacesUrl || src.startsWith('/api/') || src.startsWith('/images/'));
  console.log('Using Next.js Image:', !(isGooglePlacesUrl || src.startsWith('/api/') || src.startsWith('/images/')));

  if (hasError) {
    return (
      <img
        src="/placeholder-image.svg"
        alt={alt}
        className={className}
        onClick={onClick}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      />
    );
  }

  // Use regular img tag for proxy URLs, Google Places URLs, and local images
  if (isGooglePlacesUrl || src.startsWith('/api/') || src.startsWith('/images/')) {
    return (
      <div className={fill ? 'relative w-full h-full' : ''}>
        {isLoading && (
          <div className={`${fill ? 'absolute inset-0' : 'w-full h-48'} bg-gray-200 animate-pulse flex items-center justify-center`}>
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onClick={onClick}
          onError={handleError}
          onLoad={handleLoad}
          style={fill ? {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          } : undefined}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    );
  }

  // For non-Google URLs, we can safely use Next.js Image
  const Image = require('next/image').default;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onClick={onClick}
      onError={handleError}
    />
  );
}