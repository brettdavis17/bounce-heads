'use client';

import { useState } from 'react';
import { convertPhotoUrls, convertPhotoObjectsToUrls } from '@/utils/photoUtils';
import OptimizedImage from './OptimizedImage';

interface PhotoGalleryProps {
  images: any[]; // Can be string[] (legacy) or object[] (new format)
  parkName: string;
}

export default function PhotoGallery({ images, parkName }: PhotoGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  // Handle both legacy string[] format and new object[] format
  let convertedImages: string[];

  if (typeof images[0] === 'string') {
    // Legacy format: array of URL strings
    convertedImages = convertPhotoUrls(images as string[]);
  } else {
    // New format: array of photo objects with metadata
    convertedImages = convertPhotoObjectsToUrls(images);
  }

  // Debug logging
  console.log('Raw images from props:', images.slice(0, 1));
  console.log('Converted photo URLs:', convertedImages.slice(0, 1));

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;

    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex === 0 ? convertedImages.length - 1 : selectedImageIndex - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex === convertedImages.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
  };

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos ({convertedImages.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {convertedImages.slice(0, 8).map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <OptimizedImage
                src={image}
                alt={`${parkName} - Photo ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        {convertedImages.length > 8 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => openLightbox(0)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all {convertedImages.length} photos
            </button>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl z-10 hover:text-gray-300"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm z-10 bg-black bg-opacity-50 px-3 py-1 rounded">
            {selectedImageIndex + 1} of {convertedImages.length}
          </div>

          {/* Previous button */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 hover:text-gray-300 bg-black bg-opacity-50 w-12 h-12 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
          >
            ←
          </button>

          {/* Next button */}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 hover:text-gray-300 bg-black bg-opacity-50 w-12 h-12 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
          >
            →
          </button>

          {/* Main image */}
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full h-full">
              <OptimizedImage
                src={convertedImages[selectedImageIndex]}
                alt={`${parkName} - Photo ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto p-2">
            {convertedImages.map((image, index) => (
              <button
                key={index}
                className={`relative w-16 h-16 rounded overflow-hidden flex-shrink-0 ${
                  index === selectedImageIndex ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
              >
                <OptimizedImage
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}