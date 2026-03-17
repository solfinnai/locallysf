'use client';

import { useState, useRef, useEffect } from 'react';
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
}

function Dropdown({ label, value, options, onSelect, dark }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px 16px',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 2, color: dark ? 'rgba(255,255,255,0.5)' : '#999' }}>
          {label}
        </p>
        <p style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, color: dark ? '#fff' : '#333' }}>
          {value} <span style={{ fontSize: 10 }}>▾</span>
        </p>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          border: '1px solid #e5e5e5',
          zIndex: 9999,
          minWidth: 200,
          maxHeight: 320,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{ padding: 4 }}>
            {options.map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => { onSelect(opt.key); setOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  fontSize: 14,
                  border: 'none',
                  background: opt.label === value ? '#FFF7ED' : 'transparent',
                  color: opt.label === value ? '#E8A838' : '#333',
                  fontWeight: opt.label === value ? 600 : 400,
                  cursor: 'pointer',
                  borderRadius: 8,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function HeroFilterBar() {
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [neighborhood, setNeighborhood] = useState('all');

  const catLabel = CATEGORIES.find(c => c.key === category)?.label || 'All Categories';
  const neighLabel = NEIGHBORHOODS.find(n => n.key === neighborhood)?.label || 'Everywhere';

  const handleExplore = () => {
    const cat = category !== 'all' ? category : 'restaurants';
    const params = new URLSearchParams();
    if (neighborhood !== 'all') params.set('neighborhood', neighborhood);
    const qs = params.toString();
    router.push(`/${cat}${qs ? `?${qs}` : ''}`);
  };

  return (
    <div style={{
      background: 'rgba(20,20,20,0.85)',
      backdropFilter: 'blur(12px)',
      borderRadius: '12px 12px 0 0',
      overflow: 'visible',
      position: 'relative',
      zIndex: 100,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr) auto',
        alignItems: 'stretch',
      }}>
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <Dropdown label="Category" value={catLabel} options={CATEGORIES} onSelect={setCategory} dark />
        </div>
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <Dropdown label="Neighborhood" value={neighLabel} options={NEIGHBORHOODS} onSelect={setNeighborhood} dark />
        </div>
        <button
          onClick={handleExplore}
          type="button"
          style={{
            padding: '12px 28px',
            background: '#fff',
            color: '#1A1A1A',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            borderRadius: '0 12px 0 0',
          }}
        >
          Explore →
        </button>
      </div>
    </div>
  );
}

export function SectionFilterBar({ onFilter }: { onFilter?: (filters: { category: string; neighborhood: string; price: string; rating: string }) => void } = {}) {
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [neighborhood, setNeighborhood] = useState('all');
  const [price, setPrice] = useState('all');
  const [rating, setRating] = useState('all');

  const catLabel = CATEGORIES.find(c => c.key === category)?.label || 'All Categories';
  const neighLabel = NEIGHBORHOODS.find(n => n.key === neighborhood)?.label || 'Everywhere';
  const priceLabel = PRICES.find(p => p.key === price)?.label || 'No Limit';
  const ratingLabel = RATINGS.find(r => r.key === rating)?.label || 'Any Rating';

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
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e5e5',
      marginBottom: 32,
      overflow: 'visible',
      position: 'relative',
      zIndex: 50,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr) auto',
        alignItems: 'stretch',
      }}>
        <div style={{ borderRight: '1px solid #e5e5e5' }}>
          <Dropdown label="Neighborhood" value={neighLabel} options={NEIGHBORHOODS} onSelect={setNeighborhood} />
        </div>
        <div style={{ borderRight: '1px solid #e5e5e5' }}>
          <Dropdown label="Category" value={catLabel} options={CATEGORIES} onSelect={setCategory} />
        </div>
        <div style={{ borderRight: '1px solid #e5e5e5' }}>
          <Dropdown label="Price" value={priceLabel} options={PRICES} onSelect={setPrice} />
        </div>
        <div style={{ borderRight: '1px solid #e5e5e5' }}>
          <Dropdown label="Rating" value={ratingLabel} options={RATINGS} onSelect={setRating} />
        </div>
        <button
          onClick={handleDiscover}
          type="button"
          style={{
            padding: '12px 28px',
            background: '#1A1A1A',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            borderRadius: '0 12px 12px 0',
          }}
        >
          Discover
        </button>
      </div>
    </div>
  );
}
