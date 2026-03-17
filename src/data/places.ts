export interface Place {
  id: string;
  slug: string;
  name: string;
  category: string; // 'restaurants' | 'cafes' | 'bars' | 'shopping' | 'attractions' | 'services' | 'healthcare' | 'education' | 'government' | 'parks' | 'finance' | 'religious'
  subcategory: string; // 'chinese' | 'mexican' | 'italian' | 'coffee' | 'cocktails' | etc.
  address: string;
  neighborhood: string; // Extract from address or assign based on area
  city: string; // 'San Francisco'
  phone: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  rating: number;
  reviewCount: number;
  priceLevel: number | null; // 1-4
  photos: {url: string; attribution: string}[];
  hours: string[] | null;
  reviews: {author: string; rating: number; text: string}[];
  description: string | null;
}

export type CategoryType = 'restaurants' | 'cafes' | 'bars' | 'shopping' | 'attractions' | 'services' | 'healthcare' | 'education' | 'government' | 'parks' | 'finance' | 'religious';

export const CATEGORIES: Record<CategoryType, {
  name: string;
  icon: string;
  description: string;
}> = {
  restaurants: {
    name: 'Restaurants',
    icon: '',
    description: 'From fine dining to local favorites'
  },
  cafes: {
    name: 'Cafes & Coffee',
    icon: '',
    description: 'Coffee shops and cozy cafes'
  },
  bars: {
    name: 'Bars & Nightlife',
    icon: '',
    description: 'Cocktail bars and nightlife spots'
  },
  shopping: {
    name: 'Shopping',
    icon: '',
    description: 'Stores and boutique shopping'
  },
  attractions: {
    name: 'Attractions',
    icon: '',
    description: 'Tourist attractions and landmarks'
  },
  services: {
    name: 'Services',
    icon: '',
    description: 'Health, beauty, and wellness services'
  },
  healthcare: {
    name: 'Healthcare',
    icon: '',
    description: 'Doctors, dentists, clinics, and hospitals'
  },
  education: {
    name: 'Education',
    icon: '',
    description: 'Schools, universities, and learning'
  },
  government: {
    name: 'Government',
    icon: '',
    description: 'City services, libraries, and post offices'
  },
  parks: {
    name: 'Parks & Recreation',
    icon: '',
    description: 'Parks, gyms, and outdoor spaces'
  },
  finance: {
    name: 'Finance',
    icon: '',
    description: 'Banks, credit unions, and financial services'
  },
  religious: {
    name: 'Religious',
    icon: '',
    description: 'Churches, temples, and spiritual centers'
  }
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
  'Sunset'
];

// Utility functions
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
    'russian hill': 'Russian Hill'
  };

  const lowerAddress = address.toLowerCase();
  for (const [key, value] of Object.entries(neighborhoodMap)) {
    if (lowerAddress.includes(key)) {
      return value;
    }
  }
  
  return 'San Francisco'; // Default if no neighborhood found
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
    'park': 'Parks'
  };

  const lowerQuery = query.toLowerCase();
  for (const [key, value] of Object.entries(subcategoryMap)) {
    if (lowerQuery.includes(key)) {
      return value;
    }
  }

  // Fallback based on types
  if (types.includes('restaurant')) return 'Restaurant';
  if (types.includes('cafe')) return 'Cafe';
  if (types.includes('bar')) return 'Bar';
  if (types.includes('store')) return 'Retail';
  if (types.includes('tourist_attraction')) return 'Attraction';
  
  return 'Other';
}