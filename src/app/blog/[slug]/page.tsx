import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Not Found — LocallySF' };
  return {
    title: `${post.title} — LocallySF Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: 'LocallySF' },
    publisher: { '@type': 'Organization', name: 'LocallySF', url: 'https://locallysf.com' },
  };

  return (
    <div style={{ background: '#F2F0ED', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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

      {/* Hero Image */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(10,22,40,0.85))' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, padding: '0 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <span style={{ background: '#E8A838', color: '#0A1628', padding: '4px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>{post.neighborhood}</span>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: '0.8rem' }}>{post.readTime}</span>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: '2.4rem', lineHeight: 1.2 }}>{post.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, fontSize: '0.85rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
          <Link href="/blog" style={{ color: '#E8A838', textDecoration: 'none' }}>Blog</Link>
          <span>/</span>
          <span>{post.neighborhood}</span>
        </div>

        <article
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', lineHeight: 1.8, color: '#374151' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related */}
        <div style={{ marginTop: 80, borderTop: '2px solid #E8A838', paddingTop: 40 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#0A1628', marginBottom: 24 }}>More Neighborhood Guides</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <img src={rp.coverImage} alt={rp.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <div style={{ padding: 16 }}>
                    <span style={{ color: '#E8A838', fontSize: '0.75rem', fontWeight: 600 }}>{rp.neighborhood}</span>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#0A1628', marginTop: 4, lineHeight: 1.3 }}>{rp.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

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
