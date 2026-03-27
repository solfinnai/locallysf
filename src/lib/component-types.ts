import { CategoryType, Place } from './types';

export interface NavigationProps {
  variant?: 'transparent' | 'light' | 'dark';
  transparentOverHero?: boolean;
  className?: string;
}

export interface FooterProps {
  variant?: 'dark' | 'light';
  showNewsletter?: boolean;
  className?: string;
}

export interface PlaceCardProps {
  place: Place;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  priority?: boolean;
}

export interface PhotoGalleryProps {
  photos: { url: string; attribution?: string; alt?: string }[];
  placeName: string;
}

export interface FilterBarProps {
  onFilter?: (filters: FilterState) => void;
  variant?: 'hero' | 'section';
}

export interface FilterState {
  category: string;
  neighborhood: string;
  price: string;
  rating: string;
}

export interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  neighborhood: string;
  category: string;
  publishedAt: string;
  readTime: string;
  className?: string;
}

export interface DropdownOption {
  key: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (key: string) => void;
  dark?: boolean;
  className?: string;
}

export type CategoryEntries = [CategoryType, { name: string; icon: string; description: string }][];

export interface SectionFilterBarProps {
  onFilter?: (filters: FilterState) => void;
}

export interface HeroFilterBarProps {
  onExplore?: (category: string, neighborhood: string) => void;
}
