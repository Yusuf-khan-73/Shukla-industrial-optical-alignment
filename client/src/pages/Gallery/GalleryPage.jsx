/**
 * Gallery Page
 * Location: client/src/pages/Gallery/GalleryPage.jsx
 */
import PageHero from '@components/Layout/PageHero';
import Gallery from '@components/Gallery';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import '../PageContent.css';

const GalleryPage = () => (
  <>
    <PageHero
      title="Gallery"
      subtitle="Industrial optical alignment, theodolite surveying, and paper mill alignment project photography."
      breadcrumbs={[{ label: 'Gallery' }]}
    />
    <Gallery variant="full" />

    <section className="page-content section-padding-sm bg-light">
      <div className="container-custom text-center" data-aos="fade-up">
        <h2 className="section-title">Want to See Your Project Here?</h2>
        <p className="section-subtitle mx-auto mb-4">
          Partner with Shukla Industrial for precision optical alignment and surveying services across India.
        </p>
        <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom">
          Start Your Project <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </section>
  </>
);

export default GalleryPage;
