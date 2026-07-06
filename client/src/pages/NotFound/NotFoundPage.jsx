/**
 * 404 Not Found Page
 * Location: client/src/pages/NotFound/NotFoundPage.jsx
 */
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import '../PageContent.css';

const NotFoundPage = () => (
  <section className="not-found-page" aria-labelledby="not-found-title">
    <div data-aos="fade-up">
      <div className="not-found-page__code" aria-hidden="true">404</div>
      <h1 id="not-found-title" className="not-found-page__title">
        Page Not Found
      </h1>
      <p className="not-found-page__text text-muted">
        The page you are looking for may have been moved, deleted, or never existed.
        Let us help you find your way back.
      </p>
      <Link to={ROUTE_PATHS.HOME} className="btn-magnetic btn-primary-custom">
        <i className="bi bi-house-door" /> Back to Home
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
