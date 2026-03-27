import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { places } from '@/data/placesData';
import { CATEGORIES } from '@/lib/types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About — LocallySF',
  description: 'LocallySF is the complete guide to San Francisco. Real photos, real reviews, real local insight.',
  alternates: { canonical: 'https://locallysf.com/about' },
};

export default function AboutPage() {
  const features = [
    { num: '1', title: 'Real Data', desc: 'Sourced from Google Places for accuracy and freshness.' },
    { num: '2', title: 'Real Photos', desc: 'Every photo from actual visitors and business owners.' },
    { num: '3', title: 'Real Reviews', desc: 'Honest feedback from real customers.' },
  ];

  return (
    <main className="bg-background">
      <Navigation variant="light" />

      <section className="relative h-[40vh] min-h-[300px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80"
            alt="San Francisco"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold font-display">
            About Locally<span className="text-accent">SF</span>
          </h1>
          <p className="text-white/70 text-sm mt-3">The Yellow Pages of Humanity</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-text-dark mb-4 font-display">Our Mission</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            LocallySF is your comprehensive guide to San Francisco&apos;s vibrant local scene. We connect you with the best restaurants, cafes, bars, shops, attractions, and services — powered by real Google reviews and photos. No ads, no fake listings, just honest recommendations.
          </p>

          <h2 className="text-2xl font-bold text-text-dark mb-4 font-display">The Vision</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Remember the Yellow Pages? LocallySF is that concept reimagined for the digital age. We don&apos;t just list businesses — we showcase the people behind the places. Starting in San Francisco, expanding to Oakland, South SF, and Daly City.
          </p>

          <div className="grid grid-cols-3 gap-4 my-12">
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-text-dark">{places.length}+</p>
              <p className="text-text-muted text-xs mt-1">Places</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-text-dark">{Object.keys(CATEGORIES).length}</p>
              <p className="text-text-muted text-xs mt-1">Categories</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-text-dark">100%</p>
              <p className="text-text-muted text-xs mt-1">Real Reviews</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-text-dark mb-4 font-display">How It Works</h2>
          <div className="space-y-4 mb-12">
            {features.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4 items-start bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{num}</div>
                <div>
                  <h4 className="font-semibold text-text-dark text-sm">{title}</h4>
                  <p className="text-text-muted text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/restaurants" className="inline-block bg-text-dark text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Start Exploring
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </main>
  );
}
