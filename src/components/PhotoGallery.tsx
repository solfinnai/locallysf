'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback, useRef } from 'react';

interface Photo {
  url: string;
  attribution?: string;
  alt?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  placeName: string;
}

export default function PhotoGallery({ photos, placeName }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const openLightbox = useCallback(() => {
    setLightbox(true);
    triggerRef.current?.focus();
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightbox, closeLightbox, goToPrevious, goToNext]);

  if (!photos || photos.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
        <div
          className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center"
          role="img"
          aria-label={`No photos available for ${placeName}`}
        >
          <div className="text-center text-gray-400">
            <span className="text-5xl">📍</span>
            <p className="mt-2 text-sm">No photos available for {placeName}</p>
          </div>
        </div>
      </div>
    );
  }

  const active = photos[activeIndex];

  if (lightbox) {
    return (
      <div
        ref={lightboxRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo gallery for ${placeName}`}
        className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center cursor-zoom-out"
        onClick={closeLightbox}
      >
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close gallery"
        >
          ✕
        </button>

        <img
          src={active.url}
          alt={active.alt || `${placeName} photo ${activeIndex + 1}`}
          className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg cursor-default"
          onClick={(e) => e.stopPropagation()}
        />

        <div
          className="flex gap-2 mt-6 overflow-x-auto max-w-[90vw] px-2"
          onClick={(e) => e.stopPropagation()}
          role="list"
          aria-label="Photo thumbnails"
        >
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(i);
              }}
              className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-white opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-75'
              }`}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <p className="text-white/50 text-sm mt-4" aria-live="polite">
          {activeIndex + 1} / {photos.length}
        </p>

        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous photo"
          >
            ←
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next photo"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
        <div
          onClick={openLightbox}
          className="rounded-xl overflow-hidden cursor-zoom-in"
          ref={triggerRef}
          tabIndex={0}
          role="button"
          aria-label={`Open photo in gallery for ${placeName}`}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox()}
        >
          <img
            src={photos[0].url}
            alt={photos[0].alt || placeName}
            className="w-full aspect-video object-cover"
          />
        </div>
        {photos[0].attribution && (
          <p className="text-center text-xs text-gray-500 mt-2">
            Photo by {photos[0].attribution}
          </p>
        )}
      </div>
    );
  }

  const thumbs = photos.filter((_, i) => i !== activeIndex).slice(0, 3);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
      <div className="hidden sm:block">
        <div
          className="grid gap-1 rounded-xl overflow-hidden"
          style={{
            gridTemplateColumns: thumbs.length > 0 ? '2fr 1fr' : '1fr',
          }}
        >
          <div
            className="cursor-zoom-in relative"
            onClick={openLightbox}
            ref={triggerRef}
            tabIndex={0}
            role="button"
            aria-label={`Open photo ${activeIndex + 1} in gallery`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox()}
          >
            <img
              src={active.url}
              alt={active.alt || `${placeName} photo ${activeIndex + 1}`}
              className="w-full object-cover"
              style={{ aspectRatio: thumbs.length > 0 ? 'auto' : '16/9', height: thumbs.length > 0 ? '100%' : 'auto' }}
            />
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              📷 {activeIndex + 1} / {photos.length}
            </div>
          </div>

          {thumbs.length > 0 && (
            <div
              className="grid gap-1"
              style={{
                gridTemplateRows:
                  thumbs.length === 1
                    ? '1fr'
                    : thumbs.length === 2
                    ? '1fr 1fr'
                    : '1fr 1fr 1fr',
              }}
            >
              {thumbs.map((photo, i) => {
                const origIdx = photos.indexOf(photo);
                return (
                  <div
                    key={i}
                    onClick={() => setActiveIndex(origIdx)}
                    className="cursor-pointer overflow-hidden hover:opacity-80 transition-opacity"
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo ${origIdx + 1}`}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(origIdx)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt || `${placeName} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="sm:hidden">
        <div
          onClick={openLightbox}
          className="rounded-xl overflow-hidden cursor-zoom-in relative"
          ref={triggerRef}
          tabIndex={0}
          role="button"
          aria-label={`Open photo ${activeIndex + 1} in gallery`}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox()}
        >
          <img
            src={active.url}
            alt={active.alt || `${placeName} photo ${activeIndex + 1}`}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {activeIndex + 1} / {photos.length}
          </div>
        </div>

        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-18 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-accent'
                  : 'border-transparent opacity-50'
              }`}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {active.attribution && (
        <p className="text-center text-xs text-gray-500 mt-2">
          Photo by {active.attribution}
        </p>
      )}
    </div>
  );
}
