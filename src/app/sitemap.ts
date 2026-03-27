import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/data/places';
import { blogPosts } from '@/data/blog-posts';
import places from '@/data/placesData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://locallysf.com';

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Category routes
  const categoryRoutes = Object.keys(CATEGORIES).map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Blog post routes
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Place routes from real data
  const placeRoutes = places.map((place) => ({
    url: `${baseUrl}/place/${place.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...blogRoutes,
    ...placeRoutes,
  ];
}