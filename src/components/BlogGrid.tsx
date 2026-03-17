'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/data/blog-posts';

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const [activeNeighborhood, setActiveNeighborhood] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  // Extract unique neighborhoods and categories from blog posts
  const neighborhoods = ['all', ...Array.from(new Set(posts.map(p => p.neighborhood)))];
  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchNeighborhood = activeNeighborhood === 'all' || post.neighborhood === activeNeighborhood;
    const matchCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchNeighborhood && matchCategory;
  });

  return (
    <>
      {/* Filter pills */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Neighborhood filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, marginTop: -20, position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#6b7280', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', alignSelf: 'center', marginRight: 4 }}>Neighborhood:</span>
          {neighborhoods.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setActiveNeighborhood(n)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: activeNeighborhood === n ? 600 : 400,
                background: activeNeighborhood === n ? '#E8A838' : '#fff',
                color: activeNeighborhood === n ? '#0A1628' : '#6b7280',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
              }}
            >
              {n === 'all' ? 'All' : n}
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{ color: '#6b7280', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', alignSelf: 'center', marginRight: 4 }}>Category:</span>
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: activeCategory === c ? 600 : 400,
                background: activeCategory === c ? '#0A1628' : '#fff',
                color: activeCategory === c ? '#fff' : '#6b7280',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {c === 'all' ? 'All Topics' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }}>
              No guides found for this filter combination.
            </p>
            <button
              type="button"
              onClick={() => { setActiveNeighborhood('all'); setActiveCategory('all'); }}
              style={{
                marginTop: 16,
                padding: '10px 24px',
                background: '#E8A838',
                color: '#0A1628',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: '#fff',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                }}>
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', top: 12, left: 12,
                      background: '#E8A838', color: '#0A1628',
                      padding: '4px 12px', borderRadius: 20,
                      fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    }}>
                      {post.neighborhood}
                    </div>
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(10,22,40,0.7)', color: '#fff',
                      padding: '4px 10px', borderRadius: 20,
                      fontSize: '0.7rem', fontFamily: 'Inter, sans-serif',
                      textTransform: 'capitalize',
                    }}>
                      {post.category}
                    </div>
                  </div>
                  <div style={{ padding: '20px 24px 24px' }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: '0.78rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                      <span>{post.publishedAt}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#0A1628', marginBottom: 8, lineHeight: 1.3 }}>
                      {post.title}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ marginTop: 16, color: '#E8A838', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
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
