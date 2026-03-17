'use client';

import { useState } from 'react';

interface Photo {
  url: string;
  attribution?: string;
  alt?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  placeName: string;
}

export default function PhotoGallery({ photos, placeName }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{
          aspectRatio: '16/9', background: '#f0eeeb', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', color: '#999' }}>
            <span style={{ fontSize: 48 }}>📍</span>
            <p style={{ marginTop: 8, fontSize: 14 }}>No photos available for {placeName}</p>
          </div>
        </div>
      </div>
    );
  }

  const active = photos[activeIndex];

  // Lightbox overlay
  if (lightbox) {
    return (
      <>
        <style>{`body { overflow: hidden; }`}</style>
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.92)', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={active.url}
            alt={active.alt || placeName}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '80vh',
              objectFit: 'contain', borderRadius: 8, cursor: 'default',
            }}
          />
          <div style={{
            marginTop: 16, display: 'flex', gap: 8,
            overflowX: 'auto', maxWidth: '90vw', padding: '0 8px',
          }}>
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setActiveIndex(i); }}
                style={{
                  flexShrink: 0, width: 64, height: 48, borderRadius: 6,
                  overflow: 'hidden', border: i === activeIndex ? '2px solid #fff' : '2px solid transparent',
                  opacity: i === activeIndex ? 1 : 0.5, cursor: 'pointer',
                  padding: 0, background: 'none',
                }}
              >
                <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
              width: 40, height: 40, borderRadius: '50%', fontSize: 18,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 12 }}>
            {activeIndex + 1} / {photos.length}
          </p>
        </div>
      </>
    );
  }

  // Single photo
  if (photos.length === 1) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 0' }}>
        <div
          onClick={() => setLightbox(true)}
          style={{ borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in' }}
        >
          <img
            src={photos[0].url}
            alt={photos[0].alt || placeName}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
      </div>
    );
  }

  // Multi-photo gallery
  const thumbs = photos.filter((_, i) => i !== activeIndex).slice(0, 3);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 0' }}>
      {/* MOBILE: < 640px — hero + horizontal scroll thumbs */}
      <div className="gallery-mobile" style={{ display: 'none' }}>
        <div
          onClick={() => setLightbox(true)}
          style={{ borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}
        >
          <img
            src={active.url}
            alt={active.alt || placeName}
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12,
            padding: '4px 10px', borderRadius: 16,
          }}>
            {activeIndex + 1} / {photos.length}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                flexShrink: 0, width: 72, height: 54, borderRadius: 8,
                overflow: 'hidden', border: i === activeIndex ? '2px solid #E8A838' : '2px solid transparent',
                padding: 0, background: 'none', cursor: 'pointer',
              }}
            >
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP: >= 640px — hero + side thumbnails grid */}
      <div className="gallery-desktop" style={{ display: 'none' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: thumbs.length > 0 ? '2fr 1fr' : '1fr',
          gap: 4,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {/* Hero */}
          <div
            onClick={() => setLightbox(true)}
            style={{ cursor: 'zoom-in', position: 'relative' }}
          >
            <img
              src={active.url}
              alt={active.alt || placeName}
              style={{
                width: '100%', height: '100%',
                aspectRatio: thumbs.length > 0 ? 'auto' : '16/9',
                objectFit: 'cover', objectPosition: 'center', display: 'block',
              }}
            />
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12,
              padding: '5px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              📷 {activeIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Thumbnail grid */}
          {thumbs.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateRows: thumbs.length === 1 ? '1fr' : thumbs.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: 4,
            }}>
              {thumbs.map((p, i) => {
                const origIdx = photos.indexOf(p);
                return (
                  <div
                    key={i}
                    onClick={() => setActiveIndex(origIdx)}
                    style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <img
                      src={p.url}
                      alt={p.alt || `${placeName} photo`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 639px) {
          .gallery-mobile { display: block !important; }
          .gallery-desktop { display: none !important; }
        }
        @media (min-width: 640px) {
          .gallery-mobile { display: none !important; }
          .gallery-desktop { display: block !important; }
          .gallery-desktop > div { aspect-ratio: 5/2; }
        }
        @media (min-width: 1024px) {
          .gallery-desktop > div { aspect-ratio: 5/2; }
        }
      `}</style>

      {active.attribution && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 8 }}>
          Photo by {active.attribution}
        </p>
      )}
    </div>
  );
}
