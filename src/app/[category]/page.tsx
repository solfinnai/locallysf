import { Metadata } from 'next';
import Link from 'next/link';
import { places } from '@/data/placesData';
import { CATEGORIES, CategoryType } from '@/data/places';

const validCategories = Object.keys(CATEGORIES) as CategoryType[];

export function generateStaticParams() {
  return validCategories.map(cat => ({ category: cat }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES[category as CategoryType];
  if (!cat) return { title: 'Not Found — LocallySF' };
  return {
    title: `Best ${cat.name} in San Francisco — LocallySF`,
    description: `Discover the best ${cat.name.toLowerCase()} in San Francisco. Browse ${places.filter(p => p.category === category).length} local spots with photos, reviews, and ratings.`,
    alternates: { canonical: `https://locallysf.com/${category}` },
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-[#E8A838] text-sm">
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? '☆' : ''}
      {'☆'.repeat(5 - Math.ceil(rating))}
    </span>
  );
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>; searchParams: Promise<{ neighborhood?: string; price?: string; rating?: string }> }) {
  const { category } = await params;
  const filters = await searchParams;
  const cat = CATEGORIES[category as CategoryType];

  if (!cat) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F2F0ED]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0A1628] mb-4">Category Not Found</h1>
          <Link href="/" className="text-[#E8A838] font-semibold hover:underline">← Back to Home</Link>
        </div>
      </main>
    );
  }

  let categoryPlaces = places
    .filter(p => p.category === category);

  // Apply query param filters
  if (filters.neighborhood) {
    categoryPlaces = categoryPlaces.filter(p =>
      p.neighborhood.toLowerCase().includes(filters.neighborhood!.toLowerCase())
    );
  }
  if (filters.price) {
    const priceLevel = parseInt(filters.price);
    if (!isNaN(priceLevel)) {
      categoryPlaces = categoryPlaces.filter(p => p.priceLevel === priceLevel);
    }
  }
  if (filters.rating) {
    const minRating = parseFloat(filters.rating);
    if (!isNaN(minRating)) {
      categoryPlaces = categoryPlaces.filter(p => p.rating >= minRating);
    }
  }

  categoryPlaces = categoryPlaces.sort((a, b) => b.rating - a.rating);

  return (
    <main className="bg-[#F2F0ED] min-h-screen">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 lg:px-12 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
        <Link href="/" className="text-[#0A1628] text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          ◎ LocallySF
        </Link>
        <div className="hidden md:flex items-center gap-8 text-gray-500 text-sm">
          {(['restaurants', 'cafes', 'bars', 'shopping', 'attractions'] as const).map(c => (
            <Link key={c} href={`/${c}`} className={`hover:text-[#0A1628] transition-colors ${category === c ? 'text-[#0A1628] font-semibold' : ''}`}>
              {CATEGORIES[c].name}
            </Link>
          ))}
          <Link href="/blog" className="hover:text-[#0A1628] transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-[#0A1628] transition-colors">About</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#0A1628] py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="text-4xl mb-4 block">{cat.icon}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            {cat.name}
          </h1>
          <p className="text-white/60 text-lg">
            {categoryPlaces.length} places in {filters.neighborhood || 'San Francisco'}
            {filters.rating ? ` · ${filters.rating}+ stars` : ''}
            {filters.price ? ` · ${'$'.repeat(parseInt(filters.price))}` : ''}
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryPlaces.map((place) => (
            <Link key={place.id} href={`/place/${place.slug}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                {place.photos && place.photos[0] ? (
                  <img src={place.photos[0].url} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl text-gray-300">{cat.icon}</div>
                )}
                {place.rating > 0 && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-sm">
                    <span className="text-[#E8A838]">★</span>
                    <span className="font-semibold text-[#0A1628]">{place.rating}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0A1628] group-hover:text-[#E8A838] transition-colors">{place.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{place.subcategory} · {place.neighborhood}</p>
                {place.rating > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Stars rating={place.rating} />
                    <span className="text-gray-400 text-xs">{place.rating}</span>
                    {(place.reviewCount > 0 || place.reviews?.length > 0) && (
                      <span className="text-gray-400 text-xs">({(place.reviewCount || place.reviews?.length || 0).toLocaleString()} reviews)</span>
                    )}
                  </div>
                )}
                {place.priceLevel && place.priceLevel > 0 && (
                  <span className="text-gray-400 text-xs mt-1 block">{'$'.repeat(place.priceLevel)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

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
