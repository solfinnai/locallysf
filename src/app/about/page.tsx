import { Metadata } from 'next';
import Link from 'next/link';
import { places } from '@/data/placesData';
import { CATEGORIES } from '@/data/places';

export const metadata: Metadata = {
  title: 'About — LocallySF',
  description: 'LocallySF is the complete guide to San Francisco. Real photos, real reviews, real local insight.',
  alternates: { canonical: 'https://locallysf.com/about' },
};

export default function AboutPage() {
  return (
    <main className="bg-[#F2F0ED]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E5E5E5] px-6 lg:px-12 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
        <Link href="/" className="text-[#1A1A1A] text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>◎ LocallySF</Link>
        <div className="hidden md:flex items-center gap-6 text-[#777] text-xs">
          <Link href="/restaurants" className="hover:text-[#1A1A1A] transition-colors">Restaurants</Link>
          <Link href="/cafes" className="hover:text-[#1A1A1A] transition-colors">Cafes</Link>
          <Link href="/bars" className="hover:text-[#1A1A1A] transition-colors">Bars</Link>
          <Link href="/shopping" className="hover:text-[#1A1A1A] transition-colors">Shopping</Link>
          <Link href="/attractions" className="hover:text-[#1A1A1A] transition-colors">Attractions</Link>
          <Link href="/blog" className="hover:text-[#1A1A1A] transition-colors">Blog</Link>
          <Link href="/about" className="text-[#1A1A1A] font-semibold">About</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '40vh', minHeight: '300px' }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            About Locally<span className="text-[#E8A838]">SF</span>
          </h1>
          <p className="text-white/70 text-sm mt-3">The Yellow Pages of Humanity</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Our Mission</h2>
          <p className="text-[#777] text-sm leading-relaxed mb-8">
            LocallySF is your comprehensive guide to San Francisco&apos;s vibrant local scene. We connect you with the best restaurants, cafes, bars, shops, attractions, and services — powered by real Google reviews and photos. No ads, no fake listings, just honest recommendations.
          </p>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-display)' }}>The Vision</h2>
          <p className="text-[#777] text-sm leading-relaxed mb-8">
            Remember the Yellow Pages? LocallySF is that concept reimagined for the digital age. We don&apos;t just list businesses — we showcase the people behind the places. Starting in San Francisco, expanding to Oakland, South SF, and Daly City.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 my-12">
            <div className="bg-white rounded-xl p-5 border border-[#E5E5E5] text-center">
              <p className="text-2xl font-bold text-[#1A1A1A]">{places.length}+</p>
              <p className="text-[#999] text-xs mt-1">Places</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-[#E5E5E5] text-center">
              <p className="text-2xl font-bold text-[#1A1A1A]">{Object.keys(CATEGORIES).length}</p>
              <p className="text-[#999] text-xs mt-1">Categories</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-[#E5E5E5] text-center">
              <p className="text-2xl font-bold text-[#1A1A1A]">100%</p>
              <p className="text-[#999] text-xs mt-1">Real Reviews</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-display)' }}>How It Works</h2>
          <div className="space-y-4 mb-12">
            {[
              ['1', 'Real Data', 'Sourced from Google Places for accuracy and freshness.'],
              ['2', 'Real Photos', 'Every photo from actual visitors and business owners.'],
              ['3', 'Real Reviews', 'Honest feedback from real customers.'],
            ].map(([n, title, desc]) => (
              <div key={n} className="flex gap-4 items-start bg-white rounded-xl p-4 border border-[#E5E5E5]">
                <div className="w-8 h-8 bg-[#E8A838] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{n}</div>
                <div>
                  <h4 className="font-semibold text-[#1A1A1A] text-sm">{title}</h4>
                  <p className="text-[#999] text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/restaurants" className="inline-block bg-[#1A1A1A] text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#333] transition-colors">
              Start Exploring
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-8">
        <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center text-white/20 text-xs">
          <span className="text-white/50" style={{ fontFamily: 'var(--font-display)' }}>◎ LocallySF</span>
          <p>© 2026 LocallySF</p>
        </div>
      </footer>
    </main>
  );
}
