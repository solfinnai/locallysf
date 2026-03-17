import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import BlogGrid from '@/components/BlogGrid';

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
    <div style={{ background: '#F2F0ED', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ background: '#0A1628', padding: '16px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700 }}>
            Locally<span style={{ color: '#E8A838' }}>SF</span>
          </Link>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/restaurants" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' }}>Restaurants</Link>
            <Link href="/cafes" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' }}>Cafes</Link>
            <Link href="/bars" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' }}>Bars</Link>
            <Link href="/shopping" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' }}>Shopping</Link>
            <Link href="/blog" style={{ color: '#E8A838', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Blog</Link>
            <Link href="/about" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' }}>About</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: '#0A1628', padding: '60px 24px 80px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: '3rem', marginBottom: 16 }}>
          Neighborhood <span style={{ color: '#E8A838' }}>Guides</span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
          Discover San Francisco one neighborhood at a time. Local tips, hidden gems, and the best spots from people who actually live here.
        </p>
      </div>

      {/* Blog Grid with Filters */}
      <BlogGrid posts={blogPosts} />

      {/* Footer */}
      <footer style={{ background: '#0A1628', padding: '40px 24px', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>
          Locally<span style={{ color: '#E8A838' }}>SF</span>
        </Link>
        <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: 8 }}>© 2026 LocallySF. Made with ♥ in San Francisco.</p>
      </footer>
    </div>
  );
}
