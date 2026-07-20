/**
 * Lazy-loaded gallery image card.
 * Location: client/src/components/Gallery/GalleryItem.jsx
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '@utils/formatters';
import { resolveImageUrl } from '@utils/resolveImageUrl';

// Inline SVG fallback — cannot itself fail to load (no network request), so
// if a photo's real URL 404s or is unreachable in production, the card
// always shows *something* instead of a permanent blank skeleton.
const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">'
  + '<rect width="400" height="300" fill="#eceef2"/>'
  + '<g fill="none" stroke="#b7bfc9" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">'
  + '<rect x="60" y="70" width="280" height="180" rx="8"/>'
  + '<circle cx="130" cy="130" r="16" fill="#b7bfc9" stroke="none"/>'
  + '<path d="M70 220l80-70 60 50 40-35 80 65"/>'
  + '</g>'
  + '</svg>',
)}`;

const GalleryItem = ({ item, index = 0, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imageUrl = resolveImageUrl(
    item.image?.url,
    item.updated_at || item.updatedAt || item.id,
  );
  const imageAlt = item.image?.alt || item.title;

  if (!imageUrl) return null;

  const src = errored ? FALLBACK_IMAGE : imageUrl;

  return (
    <motion.article
      className="gallery-item"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
    >
      <button
        type="button"
        className="gallery-item__trigger"
        onClick={() => onClick(item)}
        aria-label={`View ${item.title} — ${item.company}`}
      >
        <div className={`gallery-item__image ${loaded ? 'gallery-item__image--loaded' : ''}`}>
          {!loaded && <div className="gallery-item__skeleton img-skeleton" aria-hidden="true" />}
          <img
            src={src}
            alt={imageAlt}
            className="img-cover"
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => {
              // Real photo failed (404 / wrong origin / unreachable) — stop
              // waiting on onLoad (which will never fire for a failed
              // request), swap to the local fallback graphic, and clear the
              // skeleton so the card doesn't stay blank forever.
              setErrored(true);
              setLoaded(true);
            }}
          />
          <div className="gallery-item__overlay">
            <span className="gallery-item__zoom">
              <i className="bi bi-zoom-in" />
            </span>
            <div className="gallery-item__overlay-text">
              <h3 className="gallery-item__title">{item.title}</h3>
              <p className="gallery-item__company">{item.company}</p>
            </div>
          </div>
          <span className="gallery-item__category">{item.categoryLabel}</span>
        </div>
        <div className="gallery-item__footer">
          <span><i className="bi bi-geo-alt" /> {item.location}</span>
          <span><i className="bi bi-calendar3" /> {formatDate(item.date)}</span>
        </div>
      </button>
    </motion.article>
  );
};

export default GalleryItem;