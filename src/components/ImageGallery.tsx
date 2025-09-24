'use client';

import { useState } from 'react';
import { convertPhotoUrls, convertPhotoObjectsToUrls } from '@/utils/photoUtils';

interface ImageGalleryProps {
  images: any[]; // Can be string[] (legacy) or object[] (new format)
  parkName: string;
}

export default function ImageGallery({ images, parkName }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

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

  const handleImageError = (index: number) => {
    console.error(`Failed to load image ${index}:`, convertedImages[index]);
    setImageErrors(prev => new Set(prev).add(index));
  };

  const handleImageLoad = (index: number) => {
    console.log(`Successfully loaded image ${index}:`, convertedImages[index]);
    setLoadedImages(prev => new Set(prev).add(index));
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
              {/* Simple image with background color fallback */}
              <img
                src={image}
                alt={`${parkName} - Photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onLoad={() => {
                  console.log(`Image ${index} loaded successfully:`, image);
                  handleImageLoad(index);
                }}
                onError={(e) => {
                  console.error(`Image ${index} failed to load:`, image, e);
                  handleImageError(index);
                }}
                loading={index < 4 ? 'eager' : 'lazy'}
                crossOrigin="anonymous"
                style={{
                  backgroundColor: '#f3f4f6', // Gray fallback
                  minHeight: '100%',
                  display: 'block'
                }}
              />

              {/* Loading overlay */}
              {!loadedImages.has(index) && !imageErrors.has(index) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500 text-sm">Loading...</div>
                </div>
              )}

              {/* Error overlay */}
              {imageErrors.has(index) && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs">Image unavailable</div>
                  </div>
                </div>
              )}

              {/* Hover overlay - only show when image is loaded */}
              {loadedImages.has(index) && !imageErrors.has(index) && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
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
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-gray-300 w-12 h-12 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-lg z-10 bg-black bg-opacity-70 px-4 py-2 rounded-lg">
            {selectedImageIndex + 1} of {convertedImages.length}
          </div>

          {/* Previous button */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10 hover:text-gray-300 bg-black bg-opacity-70 w-16 h-16 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
          >
            ←
          </button>

          {/* Next button */}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10 hover:text-gray-300 bg-black bg-opacity-70 w-16 h-16 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
          >
            →
          </button>

          {/* Main image */}
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full h-full flex items-center justify-center">
              {!loadedImages.has(selectedImageIndex) && !imageErrors.has(selectedImageIndex) && (
                <div className="text-white text-xl">Loading image...</div>
              )}

              {imageErrors.has(selectedImageIndex) && (
                <div className="text-white text-xl text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Failed to load image
                </div>
              )}

              <img
                src={convertedImages[selectedImageIndex]}
                alt={`${parkName} - Photo ${selectedImageIndex + 1}`}
                className={`max-w-full max-h-full object-contain ${
                  loadedImages.has(selectedImageIndex) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(selectedImageIndex)}
                onError={() => handleImageError(selectedImageIndex)}
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto p-2 bg-black bg-opacity-50 rounded-lg">
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
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}