'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrampolinePark } from '@/types/park';
import { getAllParkPhotoUrls } from '@/utils/googlePhotos';
import { GooglePhotoAttribution } from '@/components/GoogleAttribution';

interface ParkPhotoGalleryProps {
  park: TrampolinePark;
  className?: string;
  maxPhotos?: number;
  photoSize?: 'small' | 'medium' | 'large';
}

const photoSizes = {
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 800, height: 600 }
};

export default function ParkPhotoGallery({
  park,
  className = '',
  maxPhotos = 6,
  photoSize = 'medium'
}: ParkPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  const size = photoSizes[photoSize];
  const photos = getAllParkPhotoUrls(park, {
    maxWidth: size.width,
    maxHeight: size.height
  }).slice(0, maxPhotos);

  const handleImageError = (url: string) => {
    setImageLoadErrors(prev => new Set([...prev, url]));
  };

  const validPhotos = photos.filter(photo => !imageLoadErrors.has(photo.url));

  if (validPhotos.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validPhotos.map((photo, index) => (
          <div key={`${photo.url}-${index}`} className="relative group">
            <div
              className="aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer bg-gray-100"
              onClick={() => setSelectedPhoto(index)}
            >
              <Image
                src={photo.url}
                alt={`${park.name} - Photo ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                loading="lazy"
                onError={() => handleImageError(photo.url)}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />

              {/* Photo counter for first image */}
              {index === 0 && validPhotos.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  1 of {validPhotos.length}
                </div>
              )}
            </div>

            {/* Attribution for Google Photos */}
            {photo.source === 'google' && photo.attributions && (
              <GooglePhotoAttribution attributions={photo.attributions} />
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative">
              <Image
                src={validPhotos[selectedPhoto].url}
                alt={`${park.name} - Photo ${selectedPhoto + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
                onError={() => handleImageError(validPhotos[selectedPhoto].url)}
              />

              {/* Navigation arrows */}
              {validPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : validPhotos.length - 1);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(selectedPhoto < validPhotos.length - 1 ? selectedPhoto + 1 : 0);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Attribution in lightbox */}
            {validPhotos[selectedPhoto].source === 'google' && validPhotos[selectedPhoto].attributions && (
              <div className="mt-2">
                <GooglePhotoAttribution attributions={validPhotos[selectedPhoto].attributions!} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}