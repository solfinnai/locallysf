import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES, CategoryType } from '@/lib/types';
import { places } from '@/data/placesData';
import { HeroFilterBar, SectionFilterBar } from '@/components/FilterBar';

const CATEGORY_IMAGES: Record<string, string> = {
  restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
  cafes: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
  bars: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop',
  shopping: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop',
  attractions: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop',
  services: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
  healthcare: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
  education: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop',
  government: 'https://images.unsplash.com/photo-1555364367-7fa525a78174?w=600&h=400&fit=crop',
  parks: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop',
  finance: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
  religious: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&h=400&fit=crop',
};

export default function HomePage() {
  const featured = places
    .filter(p => p.rating >= 4.5 && p.photos && p.photos.length > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const editorial = places
    .filter(p => p.photos && p.photos.length >= 2 && p.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const topRated = places
    .filter(p => p.rating > 0 && p.photos && p.photos.length > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  const featuredReviews = places
    .filter(p => p.reviews.length > 0 && p.reviews[0].rating >= 4 && p.reviews[0].text.length > 60)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const categoryEntries = Object.entries(CATEGORIES) as [CategoryType, typeof CATEGORIES[CategoryType]][];

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden" style={{ height: '65vh', minHeight: '520px' }}>
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80"
            alt="San Francisco Golden Gate Bridge"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        <nav className="relative z-20 flex items-center justify-between px-8 lg:px-16 py-5 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white text-sm font-medium font-display">◎ LocallySF</Link>
            <Link href="/restaurants" className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full hover:bg-white/25 transition-colors">🔍 Search</Link>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/80 text-xs">
            <Link href="/restaurants" className="hover:text-white transition-colors">Restaurants</Link>
            <Link href="/cafes" className="hover:text-white transition-colors">Cafes</Link>
            <Link href="/bars" className="hover:text-white transition-colors">Bars</Link>
            <Link href="/shopping" className="hover:text-white transition-colors">Shopping</Link>
            <Link href="/attractions" className="hover:text-white transition-colors">Attractions</Link>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center px-6" style={{ height: 'calc(100% - 160px)' }}>
          <h1 className="text-white text-center leading-[0.85] font-display" style={{ fontSize: 'clamp(56px, 10vw, 120px)', fontWeight: 700 }}>
            Discover
          </h1>
          <p className="text-white/75 text-sm mt-5 max-w-sm text-center leading-relaxed">
            Explore San Francisco with intention. Every restaurant, café, bar, shop, and hidden gem — all in one place.
          </p>
        </div>
      </section>

      <div className="relative z-30 px-6 lg:px-16" style={{ marginTop: -52 }}>
        <div className="max-w-[1100px] mx-auto">
          <HeroFilterBar />
        </div>
      </div>

      <section className="bg-background py-5 border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-6 flex items-center gap-6 text-xs text-text-muted">
          <span>◆ {places.length}+ Places Listed</span>
          <span>★ Real Google Reviews</span>
          <span>◆ 12 Categories</span>
          <span className="hidden md:inline">★ Updated March 2026</span>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-text-dark leading-[1.15] font-display" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
            LocallySF means<br />
            <em>Going Local</em>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-7">
            <div className="w-2 h-2 rounded-full bg-text-dark" />
            <div className="w-28 border-t border-dashed border-gray-300" />
            <div className="w-5 h-5 rounded-full border-2 border-text-dark flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-text-dark" />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block border border-text-dark text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                ✦ 01 &nbsp; Our Mission
              </span>
              <h3 className="text-text-dark mb-5 leading-tight font-display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700 }}>
                Not Your Boring<br />City Directory
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-7 max-w-sm">
                We curate the best of San Francisco with real Google reviews, real photos, and real local insight. No ads, no fake listings — just honest recommendations for every neighborhood.
              </p>
              <Link href="/about" className="inline-block bg-text-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                Learn More
              </Link>
            </div>
            <div className="relative" style={{ height: '420px' }}>
              {editorial[0] && (
                <div className="absolute top-0 left-0 w-[58%] rounded-xl overflow-hidden shadow-lg z-10" style={{ height: '65%' }}>
                  <Image
                    src={editorial[0].photos[0].url}
                    alt={editorial[0].name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {editorial[0].neighborhood}
                  </div>
                </div>
              )}
              {editorial[1] && (
                <div className="absolute top-[18%] right-0 w-[48%] rounded-xl overflow-hidden shadow-lg z-20" style={{ height: '50%' }}>
                  <Image
                    src={editorial[1].photos[0].url}
                    alt={editorial[1].name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {editorial[1].neighborhood}
                  </div>
                </div>
              )}
              {editorial[2] && (
                <div className="absolute bottom-0 left-[12%] w-[42%] rounded-xl overflow-hidden shadow-lg z-30" style={{ height: '42%' }}>
                  <Image
                    src={editorial[2].photos[0].url}
                    alt={editorial[2].name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {editorial[2].neighborhood}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <span className="inline-block border border-text-dark text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                ✦ Popular Places 2026
              </span>
              <h3 className="text-text-dark font-display" style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700 }}>
                Pick the Place
              </h3>
            </div>
            <p className="text-text-muted text-xs max-w-[220px] leading-relaxed mt-4 md:mt-0">
              We have great options for everyone and cozy spots for your squad to enjoy together!
            </p>
          </div>

          <SectionFilterBar />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map((place, index) => (
              <Link key={place.id} href={`/place/${place.slug}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-text-dark text-base group-hover:text-accent transition-colors">{place.name}</h4>
                      <p className="text-text-muted text-xs mt-0.5">{place.subcategory} · {place.neighborhood}</p>
                    </div>
                    {(place.reviewCount > 0 || place.reviews?.length > 0) && (
                      <span className="flex items-center gap-1 text-xs text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                        {(place.reviewCount || place.reviews?.length || 0).toLocaleString()} reviews
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-4">
                  <div className="relative rounded-lg overflow-hidden" style={{ height: '180px' }}>
                    <Image
                      src={place.photos[0]?.url || ''}
                      alt={place.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index === 0}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
                      ★ {place.rating}
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-3 flex items-center gap-4 text-[10px] text-text-muted">
                  {place.priceLevel && <span>💰 {'$'.repeat(place.priceLevel)}</span>}
                  <span>📍 San Francisco</span>
                  {place.phone && <span>📞 Has phone</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block border border-text-dark text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              ✦ Categories
            </span>
            <h3 className="text-text-dark font-display" style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700 }}>
              Explore by Type
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryEntries.map(([key, cat]) => {
              const count = places.filter(p => p.category === key).length;
              const photo = places.find(p => p.category === key && p.photos.length > 0)?.photos[0]?.url || CATEGORY_IMAGES[key];
              return (
                <Link key={key} href={`/${key}`} className="group relative rounded-xl overflow-hidden aspect-[4/3]">
                  <Image
                    src={photo}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-bold text-sm">{cat.name}</h4>
                    <p className="text-white/50 text-xs">{count} places</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block border border-text-dark text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              ✦ Top Rated 2026
            </span>
            <h3 className="text-text-dark font-display" style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700 }}>
              Highest Rated in SF
            </h3>
          </div>

          <div className="space-y-2.5">
            {topRated.map((place, i) => (
              <Link key={place.id} href={`/place/${place.slug}`} className="flex items-center gap-4 bg-white rounded-xl p-3.5 border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="w-8 h-8 bg-text-dark text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {i + 1}
                </div>
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={place.photos[0]?.url || ''}
                    alt={place.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-dark text-sm group-hover:text-accent transition-colors truncate">{place.name}</h4>
                  <p className="text-text-muted text-xs truncate">{place.subcategory} · {place.neighborhood}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-accent text-xs">★</span>
                  <span className="font-bold text-text-dark text-sm">{place.rating}</span>
                  {(place.reviewCount > 0 || place.reviews?.length > 0) && (
                    <span className="text-text-muted text-[10px] ml-0.5">({(place.reviewCount || place.reviews?.length || 0).toLocaleString()})</span>
                  )}
                </div>
                {place.priceLevel && (
                  <span className="text-gray-300 text-xs flex-shrink-0 hidden md:block">{'$'.repeat(place.priceLevel)}</span>
                )}
                <span className="text-gray-300 group-hover:text-accent transition-colors flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block border border-text-dark text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              ✦ Real Reviews
            </span>
            <h3 className="text-text-dark font-display" style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700 }}>
              What People Say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredReviews.map(place => {
              const r = place.reviews[0];
              return (
                <a key={place.id} href={place.googleMapsUrl || `/place/${place.slug}`} target={place.googleMapsUrl ? '_blank' : '_self'} rel="noopener noreferrer" className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 block">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-accent text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <span className="text-gray-300 text-[10px]">via Google ↗</span>
                  </div>
                  <p className="text-text-dark text-sm leading-relaxed mb-4 line-clamp-4">
                    &ldquo;{r.text.slice(0, 180)}{r.text.length > 180 ? '…' : ''}&rdquo;
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-text-dark flex items-center justify-center text-white text-[10px] font-bold">{r.author[0]}</div>
                    <div>
                      <p className="font-semibold text-xs text-text-dark">{r.author}</p>
                      <p className="text-text-muted text-[10px]">on {place.name}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-text-dark">
        <div className="max-w-md mx-auto px-6 text-center">
          <h3 className="text-white text-2xl md:text-3xl mb-2 font-display" style={{ fontWeight: 700 }}>
            Stay Local
          </h3>
          <p className="text-white/40 text-xs mb-6">Weekly guides to the best of San Francisco. No spam.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="flex-1 bg-white px-4 py-3 rounded-lg text-sm text-text-dark placeholder-gray-400 outline-none" />
            <button className="bg-accent text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-accent/90 transition-colors">Subscribe</button>
          </div>
        </div>
      </section>

      <footer className="bg-text-dark border-t border-white/5 py-8">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-white/20 text-xs">
          <span className="text-white/50 font-medium font-display">◎ LocallySF</span>
          <div className="flex items-center gap-6 mt-3 md:mt-0">
            {categoryEntries.map(([key, cat]) => (
              <Link key={key} href={`/${key}`} className="hover:text-white/50 transition-colors hidden md:inline">{cat.name}</Link>
            ))}
            <Link href="/about" className="hover:text-white/50 transition-colors">About</Link>
          </div>
          <p className="mt-3 md:mt-0">© 2026 LocallySF</p>
        </div>
      </footer>
    </main>
  );
}
