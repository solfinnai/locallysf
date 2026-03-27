import { z } from 'zod';

export const CategoryTypeSchema = z.enum([
  'restaurants',
  'cafes',
  'bars',
  'shopping',
  'attractions',
  'services',
  'healthcare',
  'education',
  'government',
  'parks',
  'finance',
  'religious',
]);

export type CategoryType = z.infer<typeof CategoryTypeSchema>;

export const PhotoSchema = z.object({
  url: z.string().url(),
  attribution: z.string().optional(),
});

export type Photo = z.infer<typeof PhotoSchema>;

export const ReviewSchema = z.object({
  author: z.string().min(1, 'Review author is required'),
  rating: z.number().min(1).max(5),
  text: z.string().min(1, 'Review text is required'),
});

export type Review = z.infer<typeof ReviewSchema>;

export const PlaceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string().min(1, 'Place name is required'),
  category: CategoryTypeSchema,
  subcategory: z.string(),
  address: z.string().min(1, 'Address is required'),
  neighborhood: z.string(),
  city: z.string().default('San Francisco'),
  phone: z.string().nullable(),
  website: z.string().url().nullable().or(z.literal('')).transform(v => v === '' ? null : v),
  googleMapsUrl: z.string().url().nullable().or(z.literal('')).transform(v => v === '' ? null : v),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  priceLevel: z.number().min(1).max(4).nullable(),
  photos: z.array(PhotoSchema).min(1),
  hours: z.array(z.string()).nullable(),
  reviews: z.array(ReviewSchema).default([]),
  description: z.string().nullable(),
});

export type Place = z.infer<typeof PlaceSchema>;

export const CategoryInfo = z.object({
  name: z.string(),
  icon: z.string(),
  description: z.string(),
});

export type CategoryInfoType = z.infer<typeof CategoryInfo>;

export const CATEGORIES: Record<CategoryType, CategoryInfoType> = {
  restaurants: {
    name: 'Restaurants',
    icon: '🍽️',
    description: 'From fine dining to local favorites',
  },
  cafes: {
    name: 'Cafes & Coffee',
    icon: '☕',
    description: 'Coffee shops and cozy cafes',
  },
  bars: {
    name: 'Bars & Nightlife',
    icon: '🍸',
    description: 'Cocktail bars and nightlife spots',
  },
  shopping: {
    name: 'Shopping',
    icon: '🛍️',
    description: 'Stores and boutique shopping',
  },
  attractions: {
    name: 'Attractions',
    icon: '🏛️',
    description: 'Tourist attractions and landmarks',
  },
  services: {
    name: 'Services',
    icon: '💼',
    description: 'Health, beauty, and wellness services',
  },
  healthcare: {
    name: 'Healthcare',
    icon: '🏥',
    description: 'Doctors, dentists, clinics, and hospitals',
  },
  education: {
    name: 'Education',
    icon: '🎓',
    description: 'Schools, universities, and learning',
  },
  government: {
    name: 'Government',
    icon: '🏛️',
    description: 'City services, libraries, and post offices',
  },
  parks: {
    name: 'Parks & Recreation',
    icon: '🌳',
    description: 'Parks, gyms, and outdoor spaces',
  },
  finance: {
    name: 'Finance',
    icon: '💰',
    description: 'Banks, credit unions, and financial services',
  },
  religious: {
    name: 'Religious',
    icon: '⛪',
    description: 'Churches, temples, and spiritual centers',
  },
};

export const NEIGHBORHOODS = [
  'Mission District',
  'Chinatown',
  'North Beach',
  'Castro',
  'Marina',
  'Hayes Valley',
  'SoMa',
  'Haight-Ashbury',
  'Pacific Heights',
  'Richmond',
  'Sunset',
] as const;

export type Neighborhood = typeof NEIGHBORHOODS[number];



export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function extractNeighborhood(address: string): string {
  const neighborhoodMap: Record<string, string> = {
    'mission': 'Mission District',
    'chinatown': 'Chinatown',
    'north beach': 'North Beach',
    'castro': 'Castro',
    'marina': 'Marina',
    'hayes valley': 'Hayes Valley',
    'soma': 'SoMa',
    'haight': 'Haight-Ashbury',
    'pacific heights': 'Pacific Heights',
    'richmond': 'Richmond',
    'sunset': 'Sunset',
    'financial district': 'Financial District',
    'union square': 'Union Square',
    'nob hill': 'Nob Hill',
    'russian hill': 'Russian Hill',
  };

  const lowerAddress = address.toLowerCase();
  for (const [key, value] of Object.entries(neighborhoodMap)) {
    if (lowerAddress.includes(key)) {
      return value;
    }
  }

  return 'San Francisco';
}

export function determineSubcategory(types: string[], query: string): string {
  const subcategoryMap: Record<string, string> = {
    'chinese': 'Chinese',
    'mexican': 'Mexican',
    'italian': 'Italian',
    'japanese': 'Japanese',
    'brunch': 'Brunch',
    'coffee': 'Coffee',
    'cocktail': 'Cocktails',
    'vintage': 'Vintage',
    'gym': 'Fitness',
    'spa': 'Spa',
    'salon': 'Hair & Beauty',
    'museum': 'Museums',
    'park': 'Parks',
  };

  const lowerQuery = query.toLowerCase();
  for (const [key, value] of Object.entries(subcategoryMap)) {
    if (lowerQuery.includes(key)) {
      return value;
    }
  }

  if (types.includes('restaurant')) return 'Restaurant';
  if (types.includes('cafe')) return 'Cafe';
  if (types.includes('bar')) return 'Bar';
  if (types.includes('store')) return 'Retail';
  if (types.includes('tourist_attraction')) return 'Attraction';

  return 'Other';
}
