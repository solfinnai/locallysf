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
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Navigation variant="dark" />

      <header className="relative h-[450px] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#E8A838] text-[#0A1628] px-4 py-1.5 rounded-full text-sm font-semibold">
                {post.neighborhood}
              </span>
              <span className="bg-white/20 backdrop-blur text-white px-4 py-1.5 rounded-full text-sm">
                {post.readTime}
              </span>
              <span className="text-white/70 text-sm">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <h1 className="font-serif text-white text-3xl md:text-4xl lg:text-5xl leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <p className="text-xl text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
            {post.excerpt}
          </p>

          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-16 pt-12 border-t-2 border-[#E8A838]">
          <h2 className="font-serif text-[#0A1628] text-2xl md:text-3xl mb-8">
            More Neighborhood Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="block group">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={rp.coverImage}
                      alt={rp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[#E8A838] text-xs font-bold uppercase tracking-wide">
                      {rp.neighborhood}
                    </span>
                    <h3 className="font-serif text-[#0A1628] text-base mt-2 leading-snug group-hover:text-[#E8A838] transition-colors">
                      {rp.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer variant="dark" />
    </div>
  );
}
