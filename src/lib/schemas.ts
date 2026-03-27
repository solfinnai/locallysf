import { z } from 'zod';
import { CategoryTypeSchema, PhotoSchema, ReviewSchema } from './types';

export const PlaceInputSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1, 'Name is required'),
  category: CategoryTypeSchema,
  subcategory: z.string(),
  address: z.string().min(1, 'Address is required'),
  neighborhood: z.string(),
  city: z.string(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  googleMapsUrl: z.string().nullable(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  priceLevel: z.number().int().min(1).max(4).nullable(),
  photos: z.array(PhotoSchema),
  hours: z.array(z.string()).nullable(),
  reviews: z.array(ReviewSchema).default([]),
  description: z.string().nullable(),
});

export type PlaceInput = z.infer<typeof PlaceInputSchema>;

export function validatePlace(input: unknown): PlaceInput {
  return PlaceInputSchema.parse(input);
}

export function validatePlaces(input: unknown): PlaceInput[] {
  if (!Array.isArray(input)) {
    throw new Error('Expected array of places');
  }
  return input.map(place => validatePlace(place));
}

export const BlogPostInputSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  coverImage: z.string(),
  neighborhood: z.string(),
  category: z.string(),
  publishedAt: z.string(),
  readTime: z.string(),
  author: z.string(),
});

export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;
