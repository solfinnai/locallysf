import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/data/places';

interface PlaceCardProps {
  place: Place;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export default function PlaceCard({ place, variant = 'default', className = '' }: PlaceCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-accent">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-accent">☆</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">☆</span>
        );
      }
    }
    return stars;
  };

  const renderPriceLevel = (level: number | null) => {
    if (!level) return null;
    return (
      <span className="text-text-muted font-medium">
        {'$'.repeat(level)}
      </span>
    );
  };

  // Featured variant - tall portrait card
  if (variant === 'featured') {
    return (
      <Link 
        href={`/place/${place.slug}`}
        className={`block group ${className}`}
      >
        <div className="card-hover bg-white rounded-card overflow-hidden shadow-lg aspect-card">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            {place.photos.length > 0 ? (
              <Image
                src={place.photos[0].url}
                alt={place.name}
                fill
                className="object-cover image-zoom group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">📍</span>
              </div>
            )}
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-white px-3 py-1 text-sm font-medium rounded-pill">
                {place.subcategory}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-lg text-text-dark mb-2 group-hover:text-accent transition-colors">
              {place.name}
            </h3>
            <p className="text-text-muted text-sm mb-3">{place.neighborhood}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(place.rating)}
                </div>
                <span className="text-sm font-medium">{place.rating}</span>
                {(place.reviewCount > 0 || place.reviews?.length > 0) && (
                  <span className="text-xs text-text-muted">({(place.reviewCount || place.reviews?.length || 0).toLocaleString()})</span>
                )}
              </div>
              {renderPriceLevel(place.priceLevel)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant - horizontal layout
  if (variant === 'compact') {
    return (
      <Link 
        href={`/place/${place.slug}`}
        className={`block group ${className}`}
      >
        <div className="card-hover bg-white rounded-card overflow-hidden shadow-sm border border-gray-100">
          <div className="flex">
            {/* Image */}
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
              {place.photos.length > 0 ? (
                <Image
                  src={place.photos[0].url}
                  alt={place.name}
                  fill
                  className="object-cover image-zoom group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">📍</span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 min-w-0">
              <h3 className="font-bold text-text-dark mb-1 group-hover:text-accent transition-colors truncate">
                {place.name}
              </h3>
              <p className="text-text-muted text-sm mb-2 truncate">{place.neighborhood}</p>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(place.rating)}
                </div>
                <span className="text-sm font-medium">{place.rating}</span>
                {renderPriceLevel(place.priceLevel)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant - standard grid card
  return (
    <Link 
      href={`/place/${place.slug}`}
      className={`block group ${className}`}
    >
      <div className="card-hover bg-white rounded-card overflow-hidden shadow-lg">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {place.photos.length > 0 ? (
            <Image
              src={place.photos[0].url}
              alt={place.name}
              fill
              className="object-cover image-zoom group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">📍</span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-primary/80 text-white px-2 py-1 text-xs font-medium rounded">
              {place.subcategory}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-text-dark mb-1 group-hover:text-accent transition-colors">
            {place.name}
          </h3>
          <p className="text-text-muted text-sm mb-3">{place.neighborhood}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(place.rating)}
              </div>
              <span className="text-sm font-medium">{place.rating}</span>
              {(place.reviewCount > 0 || place.reviews?.length > 0) && (
                  <span className="text-xs text-text-muted">({(place.reviewCount || place.reviews?.length || 0).toLocaleString()})</span>
                )}
            </div>
            {renderPriceLevel(place.priceLevel)}
          </div>
          
          {place.description && (
            <p className="text-text-muted text-sm mt-3 line-clamp-2">
              {place.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}