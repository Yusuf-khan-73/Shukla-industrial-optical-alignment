/**
 * Filterable masonry-style gallery grid.
 * Location: client/src/components/Gallery/GalleryGrid.jsx
 */
import { useState } from 'react';
import { useGallery } from '@hooks/useGallery';
import { GALLERY_FILTERS } from './galleryData';
import GalleryItem from './GalleryItem';
import GalleryLightbox from './GalleryLightbox';

const GalleryGrid = ({ featured = false, limit = null, showFilters = false }) => {
  const [category, setCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const { items, loading } = useGallery({ featured, limit, category });

  const openLightbox = (item) => {
    const index = items.findIndex((i) => i.id === item.id);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  return (
    <>
      {showFilters && (
        <div className="gallery-grid__filters" role="tablist" aria-label="Filter gallery">
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={category === f.id}
              className={`gallery-grid__filter ${category === f.id ? 'gallery-grid__filter--active' : ''}`}
              onClick={() => setCategory(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="gallery-grid gallery-grid--loading">
          {Array.from({ length: limit || 8 }, (_, i) => (
            <div key={i} className="gallery-item-skeleton img-skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="gallery-grid__empty text-center text-muted">No photos found for this filter.</p>
      ) : (
        <div className="gallery-grid">
          {items.map((item, index) => (
            <GalleryItem
              key={item.id}
              item={item}
              index={index}
              onClick={() => openLightbox(item)}
            />
          ))}
        </div>
      )}

      <GalleryLightbox
        items={items}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
};

export default GalleryGrid;
