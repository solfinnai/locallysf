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
      className={`px-4 py-1.5 rounded-full text-sm transition-all whitespace-nowrap ${
        active
          ? dark
            ? 'bg-[#E8A838] text-[#0A1628] font-semibold'
            : 'bg-[#0A1628] text-white font-semibold'
          : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'
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
    <div className="bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Neighborhood
            </span>
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map(n => (
                <FilterButton
                  key={n}
                  active={activeNeighborhood === n}
                  onClick={() => setActiveNeighborhood(n)}
                >
                  {n === 'all' ? 'All Neighborhoods' : n}
                </FilterButton>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <FilterButton
                  key={c}
                  active={activeCategory === c}
                  onClick={() => setActiveCategory(c)}
                  dark
                >
                  {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'guide' : 'guides'}
            {activeNeighborhood !== 'all' || activeCategory !== 'all' ? (
              <button
                onClick={() => { setActiveNeighborhood('all'); setActiveCategory('all'); }}
                className="ml-2 text-[#E8A838] hover:underline font-medium"
              >
                Clear filters
              </button>
            ) : null}
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">No guides found for this filter combination.</p>
            <button
              type="button"
              onClick={() => { setActiveNeighborhood('all'); setActiveCategory('all'); }}
              className="px-6 py-2.5 bg-[#E8A838] text-[#0A1628] font-semibold rounded-lg hover:bg-[#E8A838]/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block no-underline">
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#E8A838] text-[#0A1628] px-3 py-1 rounded-full text-xs font-bold">
                      {post.neighborhood}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      <span className="capitalize">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="font-serif text-[#0A1628] text-lg mb-2 leading-snug flex-1">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 text-[#E8A838] text-sm font-semibold flex items-center gap-1">
                      Read Guide <span>→</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
