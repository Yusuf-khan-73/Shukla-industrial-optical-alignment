/**
 * Reusable inner-page hero with breadcrumb.
 * Location: client/src/components/Layout/PageHero.jsx
 */
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import './PageHero.css';

const PageHero = ({ title, subtitle, breadcrumbs = [] }) => (
  <section className="page-hero" aria-label="Page header">
    <div className="container-custom relative">
      {breadcrumbs.length > 0 && (
        <nav className="page-hero__breadcrumb" aria-label="Breadcrumb">
          <Link to={ROUTE_PATHS.HOME}>Home</Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="page-hero__breadcrumb-item">
              <i className="bi bi-chevron-right" aria-hidden="true" />
              {crumb.path ? (
                <Link to={crumb.path}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="page-hero__title" data-aos="fade-up">
        {title}
      </h1>
      {subtitle && (
        <p className="page-hero__subtitle" data-aos="fade-up" data-aos-delay="100">
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default PageHero;
