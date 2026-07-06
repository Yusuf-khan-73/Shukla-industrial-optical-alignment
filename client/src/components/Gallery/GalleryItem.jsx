/**
 * Lazy-loaded gallery image card.
 * Location: client/src/components/Gallery/GalleryItem.jsx
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '@utils/formatters';

const GalleryItem = ({ item, index = 0, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const imageUrl = item.image?.url;
  const imageAlt = item.image?.alt || item.title;

  if (!imageUrl) return null;

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
            src={imageUrl}
            alt={imageAlt}
            className="img-cover"
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
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
