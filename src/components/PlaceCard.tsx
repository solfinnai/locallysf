import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/lib/types';

interface PlaceCardProps {
  place: Place;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  priority?: boolean;
}

function renderStars(rating: number): React.ReactNode {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="text-accent">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="text-accent">☆</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300">☆</span>);
    }
  }
  return stars;
}

function renderPriceLevel(level: number | null): React.ReactNode {
  if (!level) return null;
  return <span className="text-text-muted font-medium">{'$'.repeat(level)}</span>;
}

export default function PlaceCard({ place, variant = 'default', className = '', priority = false }: PlaceCardProps) {
  const hasPhotos = place.photos && place.photos.length > 0;
  const photoUrl = hasPhotos ? place.photos[0].url : null;
  const reviewCount = place.reviewCount > 0 ? place.reviewCount : place.reviews?.length || 0;

  if (variant === 'featured') {
    return (
      <Link href={`/place/${place.slug}`} className={`block group ${className}`}>
        <div className="bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
          <div className="relative h-64 overflow-hidden">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={place.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={priority}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">📍</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-white px-3 py-1 text-sm font-medium rounded-full">
                {place.subcategory}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-bold text-lg text-text-dark mb-2 group-hover:text-accent transition-colors">
              {place.name}
            </h3>
            <p className="text-text-muted text-sm mb-3">{place.neighborhood}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(place.rating)}</div>
                <span className="text-sm font-medium">{place.rating}</span>
                {reviewCount > 0 && (
                  <span className="text-xs text-text-muted">({reviewCount.toLocaleString()})</span>
                )}
              </div>
              {renderPriceLevel(place.priceLevel)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/place/${place.slug}`} className={`block group ${className}`}>
        <div className="bg-white rounded-card overflow-hidden shadow-sm border border-gray-100 hover:shadow-card-hover transition-shadow">
          <div className="flex">
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={place.name}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={priority}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">📍</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 min-w-0">
              <h3 className="font-bold text-text-dark mb-1 group-hover:text-accent transition-colors truncate">
                {place.name}
              </h3>
              <p className="text-text-muted text-sm mb-2 truncate">{place.neighborhood}</p>

              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(place.rating)}</div>
                <span className="text-sm font-medium">{place.rating}</span>
                {renderPriceLevel(place.priceLevel)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/place/${place.slug}`} className={`block group ${className}`}>
      <div className="bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
        <div className="relative h-48 overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={place.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">📍</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-primary/80 text-white px-2 py-1 text-xs font-medium rounded">
              {place.subcategory}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-text-dark mb-1 group-hover:text-accent transition-colors">
            {place.name}
          </h3>
          <p className="text-text-muted text-sm mb-3">{place.neighborhood}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(place.rating)}</div>
              <span className="text-sm font-medium">{place.rating}</span>
              {reviewCount > 0 && (
                <span className="text-xs text-text-muted">({reviewCount.toLocaleString()})</span>
              )}
            </div>
            {renderPriceLevel(place.priceLevel)}
          </div>

          {place.description && (
            <p className="text-text-muted text-sm mt-3 line-clamp-2">{place.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
