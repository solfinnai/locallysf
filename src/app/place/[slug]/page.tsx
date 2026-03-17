import { Metadata } from 'next';
import Link from 'next/link';
import { places } from '@/data/placesData';
import { CATEGORIES, CategoryType } from '@/data/places';
import PhotoGallery from '@/components/PhotoGallery';

interface PlacePageProps {
  params: Promise<{ slug: string }>;
}

// Only pre-render places with photos/ratings (Google data) — rest use on-demand ISR
export async function generateStaticParams() {
  return places
    .filter(p => p.rating > 0 || (p.photos && p.photos.length > 0))
    .map(p => ({ slug: p.slug }));
}

export const dynamicParams = true; // Allow on-demand rendering for non-pre-rendered slugs

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = places.find(p => p.slug === slug);
  if (!place) return { title: 'Not Found — LocallySF' };
  return {
    title: `${place.name} — LocallySF`,
    description: place.description || `${place.name} in ${place.neighborhood}, San Francisco. View photos, reviews, hours, and contact info.`,
    openGraph: {
      title: `${place.name} — LocallySF`,
      description: place.description || `${place.name} in San Francisco`,
      images: place.photos[0] ? [{ url: place.photos[0].url, width: 1200, height: 630, alt: place.name }] : [],
    },
    alternates: { canonical: `https://locallysf.com/place/${slug}` },
  };
}

function Stars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-sm';
  return (
    <span className={`text-[#E8A838] ${cls}`}>
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? '☆' : ''}
      {'☆'.repeat(5 - Math.ceil(rating))}
    </span>
  );
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = places.find(p => p.slug === slug);

  if (!place) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0A1628] mb-4">Place Not Found</h1>
          <Link href="/" className="text-[#E8A838] font-semibold hover:underline">← Back to Home</Link>
        </div>
      </main>
    );
  }

  const catInfo = CATEGORIES[place.category as CategoryType];
  const nearby = places
    .filter(p => p.id !== place.id && p.category === place.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <main className="bg-[#F2F0ED]">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "LocalBusiness",
        "name": place.name, "description": place.description,
        "address": { "@type": "PostalAddress", "streetAddress": place.address, "addressLocality": "San Francisco", "addressRegion": "CA", "addressCountry": "US" },
        "telephone": place.phone, "url": place.website,
        "aggregateRating": (place.rating > 0 && (place.reviewCount > 0 || place.reviews.length > 0)) ? { "@type": "AggregateRating", "ratingValue": place.rating, "reviewCount": place.reviewCount || place.reviews.length } : undefined,
        "priceRange": place.priceLevel ? '$'.repeat(place.priceLevel) : undefined,
        "image": place.photos.map(p => p.url),
        "review": place.reviews.map(r => ({
          "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": r.rating },
          "author": { "@type": "Person", "name": r.author }, "reviewBody": r.text
        }))
      })}} />

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 lg:px-12 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
        <Link href="/" className="text-[#0A1628] text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          ◎ LocallySF
        </Link>
        <div className="hidden md:flex items-center gap-8 text-gray-500 text-sm">
          <Link href="/restaurants" className="hover:text-[#0A1628] transition-colors">Restaurants</Link>
          <Link href="/cafes" className="hover:text-[#0A1628] transition-colors">Cafes</Link>
          <Link href="/bars" className="hover:text-[#0A1628] transition-colors">Bars</Link>
          <Link href="/shopping" className="hover:text-[#0A1628] transition-colors">Shopping</Link>
          <Link href="/attractions" className="hover:text-[#0A1628] transition-colors">Attractions</Link>
          <Link href="/blog" className="hover:text-[#0A1628] transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-[#0A1628] transition-colors">About</Link>
        </div>
      </nav>

      {/* Photo Gallery */}
      <PhotoGallery photos={place.photos} placeName={place.name} />

      {/* Breadcrumbs */}
      <div className="max-w-[1200px] mx-auto px-6 py-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-[#E8A838] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${place.category}`} className="hover:text-[#E8A838] transition-colors">{catInfo?.name || place.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#0A1628]">{place.name}</span>
      </div>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left — Details */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-block bg-[#0A1628] text-white text-xs px-3 py-1 rounded-full mb-4">{place.subcategory}</span>
              <h1 className="text-3xl md:text-5xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                {place.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <Stars rating={place.rating} size="lg" />
                <span className="text-2xl font-bold text-[#0A1628]">{place.rating}</span>
                {(place.reviewCount > 0 || place.reviews.length > 0) && (
                  <span className="text-gray-400">({(place.reviewCount || place.reviews.length).toLocaleString()} reviews)</span>
                )}
                {place.priceLevel && <span className="text-gray-400 text-lg">{'$'.repeat(place.priceLevel)}</span>}
              </div>
            </div>

            {/* Description */}
            {place.description && (
              <div className="mb-10">
                <p className="text-gray-500 text-lg leading-relaxed">{place.description}</p>
              </div>
            )}

            {/* Reviews */}
            {place.reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'var(--font-playfair)' }}>
                      Reviews
                    </h2>
                    {(place.reviewCount || 0) > place.reviews.length && (
                      <p className="text-gray-400 text-xs mt-1">
                        Showing {place.reviews.length} of {place.reviewCount.toLocaleString()} reviews
                      </p>
                    )}
                  </div>
                  {place.googleMapsUrl && (
                    <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E8A838] hover:underline flex items-center gap-1 bg-[#FFF7ED] px-3 py-1.5 rounded-full">
                      <span>View all {(place.reviewCount || 0) > 5 ? place.reviewCount.toLocaleString() : ''} on Google</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
                <div className="space-y-6">
                  {place.reviews.map((review, i) => (
                    <a key={i} href={place.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" className="block border-b border-gray-100 pb-6 last:border-b-0 hover:bg-gray-50/50 -mx-3 px-3 py-3 rounded-lg transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center text-white font-bold text-sm">
                          {review.author[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#0A1628] text-sm">{review.author}</p>
                          <Stars rating={review.rating} size="sm" />
                        </div>
                        <span className="text-gray-300 text-xs">via Google ↗</span>
                      </div>
                      <p className="text-gray-500 leading-relaxed text-sm">{review.text}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#FAFAFA] rounded-2xl p-6 sticky top-8">
              {/* Contact */}
              <h3 className="font-bold text-[#0A1628] mb-5 text-sm uppercase tracking-wider">Contact</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5">📍</span>
                  <div>
                    <p className="text-[#0A1628] text-sm">{place.address}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{place.neighborhood}</p>
                  </div>
                </div>
                {place.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">📞</span>
                    <a href={`tel:${place.phone}`} className="text-[#E8A838] text-sm font-medium hover:underline">{place.phone}</a>
                  </div>
                )}
                {place.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">🌐</span>
                    <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-[#E8A838] text-sm font-medium hover:underline truncate">Visit Website</a>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                {place.googleMapsUrl && (
                  <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center bg-[#0A1628] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#162240] transition-colors">
                    Open in Google Maps
                  </a>
                )}
                {place.phone && (
                  <a href={`tel:${place.phone}`}
                    className="block w-full text-center border-2 border-[#0A1628] text-[#0A1628] py-3 rounded-xl text-sm font-semibold hover:bg-[#0A1628] hover:text-white transition-colors">
                    Call Now
                  </a>
                )}
              </div>

              {/* Hours */}
              {place.hours && place.hours.length > 0 && (
                <div>
                  <h3 className="font-bold text-[#0A1628] mb-3 text-sm uppercase tracking-wider">Hours</h3>
                  <div className="space-y-1.5">
                    {place.hours.map((h, i) => (
                      <p key={i} className="text-gray-500 text-xs">{h}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Places */}
      {nearby.length > 0 && (
        <section className="py-16 bg-[#FAFAFA]">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#0A1628] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
              More {catInfo?.name || 'Places'} in SF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearby.map(p => (
                <Link key={p.id} href={`/place/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    {p.photos[0] ? (
                      <img src={p.photos[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl text-gray-300">📍</div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-sm">
                      <span className="text-[#E8A838]">★</span>
                      <span className="font-semibold text-[#0A1628]">{p.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0A1628] group-hover:text-[#E8A838] transition-colors text-sm">{p.name}</h3>
                    <p className="text-gray-400 text-xs mt-1">
                      {p.subcategory}
                      {(p.reviewCount > 0 || p.reviews?.length > 0) ? ` · ${(p.reviewCount || p.reviews?.length || 0).toLocaleString()} reviews` : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0A1628] py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-white/30 text-sm">
          <Link href="/" className="text-white font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>◎ LocallySF</Link>
          <p className="mt-3 md:mt-0">© 2026 LocallySF. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
