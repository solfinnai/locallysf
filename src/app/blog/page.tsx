import { Metadata } from 'next';
import { blogPosts } from '@/data/blog-posts';
import BlogGrid from '@/components/BlogGrid';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SF Neighborhood Guides — LocallySF Blog',
  description: 'Discover San Francisco neighborhood by neighborhood. Local guides to the best restaurants, cafes, bars, shopping, and hidden gems in every SF district.',
  openGraph: {
    title: 'SF Neighborhood Guides — LocallySF Blog',
    description: 'Discover San Francisco neighborhood by neighborhood.',
  },
};

export default function BlogPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation variant="dark" />

      <div className="bg-primary pt-24 pb-16 text-center">
        <h1 className="font-display text-white text-5xl mb-4">
          Neighborhood <span className="text-accent">Guides</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Discover San Francisco one neighborhood at a time. Local tips, hidden gems, and the best spots from people who actually live here.
        </p>
      </div>

      <BlogGrid posts={blogPosts} />

      <Footer variant="dark" />
    </div>
  );
}
