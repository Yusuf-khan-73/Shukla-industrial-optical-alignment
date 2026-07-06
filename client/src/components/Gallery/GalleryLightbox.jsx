/**
 * Full-screen gallery lightbox with keyboard navigation.
 * Location: client/src/components/Gallery/GalleryLightbox.jsx
 */
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@utils/formatters';

const GalleryLightbox = ({ items, activeIndex, onClose, onNavigate }) => {
  const item = activeIndex !== null ? items[activeIndex] : null;

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate(activeIndex > 0 ? activeIndex - 1 : items.length - 1);
  }, [activeIndex, items.length, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate(activeIndex < items.length - 1 ? activeIndex + 1 : 0);
  }, [activeIndex, items.length, onNavigate]);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="gallery-lightbox__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="gallery-lightbox__wrapper" role="dialog" aria-modal="true" aria-label="Image lightbox">
            <motion.div
              className="gallery-lightbox"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <button type="button" className="gallery-lightbox__close" onClick={onClose} aria-label="Close lightbox">
                <i className="bi bi-x-lg" />
              </button>

              {items.length > 1 && (
                <>
                  <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--prev" onClick={goPrev} aria-label="Previous image">
                    <i className="bi bi-chevron-left" />
                  </button>
                  <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--next" onClick={goNext} aria-label="Next image">
                    <i className="bi bi-chevron-right" />
                  </button>
                </>
              )}

              <div className="gallery-lightbox__image-wrap">
                {item.image?.url && (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={item.id}
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                      className="gallery-lightbox__image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  </AnimatePresence>
                )}
              </div>

              <div className="gallery-lightbox__info glass-card-dark">
                <div className="gallery-lightbox__info-header">
                  <span className="gallery-lightbox__badge">{item.categoryLabel}</span>
                  <span className="gallery-lightbox__counter">
                    {activeIndex + 1} / {items.length}
                  </span>
                </div>
                <h2 className="gallery-lightbox__title">{item.title}</h2>
                <p className="gallery-lightbox__desc">{item.description}</p>
                <div className="gallery-lightbox__meta">
                  <span><i className="bi bi-building" /> {item.company}</span>
                  <span><i className="bi bi-geo-alt" /> {item.location}</span>
                  <span><i className="bi bi-calendar3" /> {formatDate(item.date)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;
