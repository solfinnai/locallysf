'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/data/blog-posts';

interface BlogGridProps {
  posts: BlogPost[];
}

function FilterButton({
  active,
  onClick,
  children,
  dark = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm transition-all ${
        active
          ? dark
            ? 'bg-accent text-primary font-semibold'
            : 'bg-primary text-white font-semibold'
          : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
      }`}
    >
      {children}
    </button>
  );
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const [activeNeighborhood, setActiveNeighborhood] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const neighborhoods = ['all', ...Array.from(new Set(posts.map(p => p.neighborhood)))];
  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchNeighborhood = activeNeighborhood === 'all' || post.neighborhood === activeNeighborhood;
    const matchCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchNeighborhood && matchCategory;
  });

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap gap-2 mb-3 -mt-16 relative z-10">
          <span className="text-gray-500 text-sm self-center mr-1">Neighborhood:</span>
          {neighborhoods.map(n => (
            <FilterButton
              key={n}
              active={activeNeighborhood === n}
              onClick={() => setActiveNeighborhood(n)}
            >
              {n === 'all' ? 'All' : n}
            </FilterButton>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-gray-500 text-sm self-center mr-1">Category:</span>
          {categories.map(c => (
            <FilterButton
              key={c}
              active={activeCategory === c}
              onClick={() => setActiveCategory(c)}
              dark
            >
              {c === 'all' ? 'All Topics' : c}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pb-20 relative z-0">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No guides found for this filter combination.</p>
            <button
              type="button"
              onClick={() => { setActiveNeighborhood('all'); setActiveCategory('all'); }}
              className="mt-4 px-6 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block no-underline">
                <article className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow h-full">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-accent text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {post.neighborhood}
                    </div>
                    <div className="absolute top-3 right-3 bg-primary/70 text-white px-3 py-1 rounded-full text-xs capitalize">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-3 mb-2 text-sm text-gray-500">
                      <span>{post.publishedAt}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="font-display text-primary text-xl mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 text-accent text-sm font-semibold">
                      Read Guide →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
