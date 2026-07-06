/**
 * Clients Page
 * Location: client/src/pages/Clients/ClientsPage.jsx
 */
import PageHero from '@components/Layout/PageHero';
import Clients from '@components/Clients';
import { CONTACT } from '@utils/constants';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import '../PageContent.css';

const ClientsPage = () => (
  <>
    <PageHero
      title="Our Clients"
      subtitle="Trusted by India's leading paper mills and industrial manufacturers."
      breadcrumbs={[{ label: 'Clients' }]}
    />
    <Clients variant="full" />

    <section className="page-content section-padding-sm">
      <div className="container-custom text-center" data-aos="fade-up">
        <h2 className="section-title">Join Our Growing Client Family</h2>
        <p className="section-subtitle mx-auto mb-4">
          Partner with the alignment experts trusted by JK Paper, Century Paper, ITC Tribeni, and 100+ industries.
        </p>
        <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom">
          Become a Client <i className="bi bi-arrow-right" />
        </Link>
        <a href={CONTACT.whatsapp.fullUrl} target="_blank" rel="noopener noreferrer" className="btn-magnetic btn-dark-custom ms-md-3 mt-3 mt-md-0">
          <i className="bi bi-whatsapp" /> WhatsApp Us
        </a>
      </div>
    </section>
  </>
);

export default ClientsPage;
