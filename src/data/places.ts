// Re-export types and functions from lib/types for backward compatibility
// Existing code importing from @/data/places will continue to work

export type {
  Place,
  CategoryType,
  Photo,
  Review,
  CategoryInfoType,
} from '@/lib/types';

export {
  CATEGORIES,
  NEIGHBORHOODS,
  generateSlug,
  extractNeighborhood,
  determineSubcategory,
} from '@/lib/types';
