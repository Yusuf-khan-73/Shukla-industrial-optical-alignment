/**
 * Services Page
 * Location: client/src/pages/Services/ServicesPage.jsx
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHero from '@components/Layout/PageHero';
import Services from '@components/Services';
import { CONTACT } from '@utils/constants';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import '../PageContent.css';

const ServicesPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      }
    }
  }, [hash]);

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive industrial alignment, installation, and surveying solutions for paper mills and manufacturing plants."
        breadcrumbs={[{ label: 'Services' }]}
      />
      <Services variant="full" />

      <section className="page-content section-padding-sm bg-light">
        <div className="container-custom text-center" data-aos="fade-up">
          <h2 className="section-title">Need a Custom Solution?</h2>
          <p className="section-subtitle mx-auto mb-4">
            Contact us at {CONTACT.primaryPhone} for specialized alignment and installation requirements.
          </p>
          <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom">
            Contact Our Team <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
