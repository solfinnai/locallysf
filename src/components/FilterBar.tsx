'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { key: 'all', label: 'All Categories' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'cafes', label: 'Cafes' },
  { key: 'bars', label: 'Bars' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'attractions', label: 'Attractions' },
  { key: 'services', label: 'Services' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'education', label: 'Education' },
  { key: 'parks', label: 'Parks' },
  { key: 'finance', label: 'Finance' },
  { key: 'government', label: 'Government' },
  { key: 'religious', label: 'Religious' },
];

const NEIGHBORHOODS = [
  { key: 'all', label: 'Everywhere' },
  { key: 'Mission', label: 'Mission' },
  { key: 'Castro', label: 'Castro' },
  { key: 'Hayes Valley', label: 'Hayes Valley' },
  { key: 'Marina', label: 'Marina' },
  { key: 'North Beach', label: 'North Beach' },
  { key: 'Chinatown', label: 'Chinatown' },
  { key: 'SoMa', label: 'SoMa' },
  { key: 'FiDi', label: 'FiDi' },
  { key: 'Pacific Heights', label: 'Pacific Heights' },
  { key: 'Nob Hill', label: 'Nob Hill' },
  { key: 'Sunset', label: 'Sunset' },
  { key: 'Richmond', label: 'Richmond' },
  { key: 'Haight', label: 'Haight' },
  { key: 'Tenderloin', label: 'Tenderloin' },
  { key: 'Potrero Hill', label: 'Potrero Hill' },
  { key: 'Dogpatch', label: 'Dogpatch' },
  { key: 'Noe Valley', label: 'Noe Valley' },
  { key: 'Russian Hill', label: 'Russian Hill' },
  { key: 'Japantown', label: 'Japantown' },
];

const PRICES = [
  { key: 'all', label: 'No Limit' },
  { key: '1', label: '$' },
  { key: '2', label: '$$' },
  { key: '3', label: '$$$' },
  { key: '4', label: '$$$$' },
];

const RATINGS = [
  { key: 'all', label: 'Any Rating' },
  { key: '4.5', label: '4.5+ ★' },
  { key: '4.0', label: '4.0+ ★' },
  { key: '3.5', label: '3.5+ ★' },
  { key: '3.0', label: '3.0+ ★' },
];

interface DropdownProps {
  label: string;
  value: string;
  options: { key: string; label: string }[];
  onSelect: (key: string) => void;
  dark?: boolean;
  id?: string;
}

function Dropdown({ label, value, options, onSelect, dark = false, id }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            onSelect(options[focusedIndex].key);
            setIsOpen(false);
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        case 'Home':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex(0);
          }
          break;
        case 'End':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex(options.length - 1);
          }
          break;
      }
    },
    [isOpen, focusedIndex, onSelect, options]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      focusedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent rounded-lg"
      >
        <p className={`text-[11px] font-semibold mb-0.5 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
          {label}
        </p>
        <p className={`text-sm flex items-center gap-1 ${dark ? 'text-white' : 'text-gray-800'}`}>
          {value}
          <span className="text-xs">▾</span>
        </p>
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={label}
          className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 min-w-[200px] max-h-80 overflow-y-auto"
        >
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={option.key}
                type="button"
                role="option"
                aria-selected={option.label === value}
                onClick={() => {
                  onSelect(option.key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors focus:outline-none ${
                  option.label === value
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${focusedIndex === index ? 'bg-gray-50' : ''}`}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterState {
  category: string;
  neighborhood: string;
  price: string;
  rating: string;
}

interface FilterBarProps {
  onFilter?: (filters: FilterState) => void;
  variant?: 'hero' | 'section';
}

export function HeroFilterBar({ onFilter }: FilterBarProps) {
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [neighborhood, setNeighborhood] = useState('all');

  const catLabel = CATEGORIES.find((c) => c.key === category)?.label || 'All Categories';
  const neighLabel = NEIGHBORHOODS.find((n) => n.key === neighborhood)?.label || 'Everywhere';

  const handleExplore = () => {
    if (onFilter) {
      onFilter({ category, neighborhood, price: 'all', rating: 'all' });
    } else {
      const cat = category !== 'all' ? category : 'restaurants';
      const params = new URLSearchParams();
      if (neighborhood !== 'all') params.set('neighborhood', neighborhood);
      const qs = params.toString();
      router.push(`/${cat}${qs ? `?${qs}` : ''}`);
    }
  };

  return (
    <div className="bg-black/85 backdrop-blur-xl rounded-xl overflow-visible relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-3">
        <div className="border-r border-white/10">
          <div className="p-3">
            <Dropdown
              label="Category"
              value={catLabel}
              options={CATEGORIES}
              onSelect={setCategory}
              dark
            />
          </div>
        </div>
        <div className="border-r border-white/10">
          <div className="p-3">
            <Dropdown
              label="Neighborhood"
              value={neighLabel}
              options={NEIGHBORHOODS}
              onSelect={setNeighborhood}
              dark
            />
          </div>
        </div>
        <div className="hidden md:block">
          <button
            onClick={handleExplore}
            type="button"
            className="w-full h-full px-6 py-3 bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors rounded-tr-xl"
          >
            Explore →
          </button>
        </div>
      </div>
      <div className="md:hidden p-2">
        <button
          onClick={handleExplore}
          type="button"
          className="w-full py-3 bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors rounded-lg"
        >
          Explore →
        </button>
      </div>
    </div>
  );
}

export function SectionFilterBar({ onFilter }: FilterBarProps) {
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [neighborhood, setNeighborhood] = useState('all');
  const [price, setPrice] = useState('all');
  const [rating, setRating] = useState('all');

  const catLabel = CATEGORIES.find((c) => c.key === category)?.label || 'All Categories';
  const neighLabel = NEIGHBORHOODS.find((n) => n.key === neighborhood)?.label || 'Everywhere';
  const priceLabel = PRICES.find((p) => p.key === price)?.label || 'No Limit';
  const ratingLabel = RATINGS.find((r) => r.key === rating)?.label || 'Any Rating';

  const handleDiscover = () => {
    if (onFilter) {
      onFilter({ category, neighborhood, price, rating });
    } else {
      const cat = category !== 'all' ? category : 'restaurants';
      const params = new URLSearchParams();
      if (neighborhood !== 'all') params.set('neighborhood', neighborhood);
      if (price !== 'all') params.set('price', price);
      if (rating !== 'all') params.set('rating', rating);
      const qs = params.toString();
      router.push(`/${cat}${qs ? `?${qs}` : ''}`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-visible mb-8 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-5">
        <div className="border-r border-gray-100">
          <div className="p-3">
            <Dropdown
              label="Neighborhood"
              value={neighLabel}
              options={NEIGHBORHOODS}
              onSelect={setNeighborhood}
            />
          </div>
        </div>
        <div className="border-r border-gray-100">
          <div className="p-3">
            <Dropdown label="Category" value={catLabel} options={CATEGORIES} onSelect={setCategory} />
          </div>
        </div>
        <div className="border-r border-gray-100">
          <div className="p-3">
            <Dropdown label="Price" value={priceLabel} options={PRICES} onSelect={setPrice} />
          </div>
        </div>
        <div className="border-r border-gray-100">
          <div className="p-3">
            <Dropdown label="Rating" value={ratingLabel} options={RATINGS} onSelect={setRating} />
          </div>
        </div>
        <div>
          <button
            onClick={handleDiscover}
            type="button"
            className="w-full h-full px-6 py-3 bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors rounded-tr-xl rounded-br-xl"
          >
            Discover
          </button>
        </div>
      </div>
    </div>
  );
}
