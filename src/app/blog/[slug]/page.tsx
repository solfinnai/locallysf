import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blog-posts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
    <div className="bg-background min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Navigation variant="dark" />

      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/80" />
        <div className="absolute bottom-10 left-0 right-0 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent text-primary px-4 py-1.5 rounded-full text-sm font-semibold">{post.neighborhood}</span>
              <span className="bg-white/15 text-white px-4 py-1.5 rounded-full text-sm">{post.readTime}</span>
            </div>
            <h1 className="font-display text-white text-4xl md:text-5xl leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex gap-2 mb-8 text-sm text-text-muted">
          <Link href="/blog" className="text-accent hover:underline">Blog</Link>
          <span>/</span>
          <span>{post.neighborhood}</span>
        </div>

        <article
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t-2 border-accent">
          <h2 className="font-display text-primary text-3xl mb-6">More Neighborhood Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="block">
                <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="relative h-36">
                    <Image
                      src={rp.coverImage}
                      alt={rp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-accent text-xs font-semibold">{rp.neighborhood}</span>
                    <h3 className="font-display text-primary text-base mt-1 leading-snug">{rp.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer variant="dark" />
    </div>
  );
}
