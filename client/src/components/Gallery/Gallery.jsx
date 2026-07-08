/**
 * Gallery section — home preview and full portfolio.
 * Location: client/src/components/Gallery/Gallery.jsx
 */
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import GalleryGrid from './GalleryGrid';
import './Gallery.css';

/**
 * @param {'home'|'full'} variant
 */
const Gallery = ({ variant = 'home' }) => (
  <section className="gallery section-padding" id="gallery" aria-label="Photo gallery">
    <div className="container-custom">
      <div className="gallery__header" data-aos="fade-up">
        <span className="section-label">Gallery</span>
        <h2 className="section-title">
          {variant === 'home' ? 'Our Work in Pictures' : 'Project Photo Gallery'}
        </h2>
        <p className="section-subtitle">
          {variant === 'home'
            ? 'Industrial optical alignment, theodolite surveying, and paper mill alignment project photography.'
            : 'Browse our portfolio — filter by category, click to enlarge with full project details.'}
        </p>
      </div>

      <GalleryGrid
        featured={variant === 'home'}
        limit={variant === 'home' ? 8 : null}
        showFilters={variant === 'full'}
      />

      {variant === 'home' && (
        <div className="gallery__cta text-center" data-aos="fade-up">
          <Link to={ROUTE_PATHS.GALLERY} className="btn-magnetic btn-primary-custom">
            View Full Gallery <i className="bi bi-images" />
          </Link>
        </div>
      )}
    </div>
  </section>
);

export default Gallery;
