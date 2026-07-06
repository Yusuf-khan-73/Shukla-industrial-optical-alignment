/**
 * Clients section — marquee, grid, and trust stats.
 * Location: client/src/components/Clients/Clients.jsx
 */
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { STATS } from '@utils/constants';
import { CLIENTS_DATA } from './clientsData';
import ClientsMarquee from './ClientsMarquee';
import ClientsGrid from './ClientsGrid';
import './Clients.css';

/**
 * @param {'home'|'full'} variant
 */
const Clients = ({ variant = 'home' }) => (
  <section className="clients section-padding" id="clients" aria-label="Our clients">
    <div className="container-custom">
      <div className="clients__header">
        <span className="section-label">Our Clients</span>
        <h2 className="section-title">
          Trusted by India&apos;s Industry Leaders
        </h2>
        <p className="section-subtitle">
          {variant === 'home'
            ? 'Proud partners of leading paper mills and engineering firms across India for over 18 years.'
            : 'We have served 100+ clients including India\'s top paper manufacturers and industrial engineering partners.'}
        </p>
      </div>

      <div className="clients__stats">
        <div className="clients__stat">
          <span className="clients__stat-value">{STATS.clients.value}{STATS.clients.suffix}</span>
          <span className="clients__stat-label">{STATS.clients.label}</span>
        </div>
        <div className="clients__stat-divider" aria-hidden="true" />
        <div className="clients__stat">
          <span className="clients__stat-value">{CLIENTS_DATA.length}</span>
          <span className="clients__stat-label">Featured Partners</span>
        </div>
        <div className="clients__stat-divider" aria-hidden="true" />
        <div className="clients__stat">
          <span className="clients__stat-value clients__stat-value--text">Pan-India</span>
          <span className="clients__stat-label">Service Coverage</span>
        </div>
      </div>
    </div>

    <ClientsMarquee />

    <div className="container-custom">
      <ClientsGrid
        limit={variant === 'home' ? 12 : undefined}
        showFilters={variant === 'full'}
      />

      {variant === 'home' && (
        <div className="clients__cta text-center" data-aos="fade-up">
          <Link to={ROUTE_PATHS.CLIENTS} className="btn-magnetic btn-primary-custom">
            View All Clients <i className="bi bi-arrow-right" />
          </Link>
        </div>
      )}
    </div>

    <div className="clients__bg-pattern" aria-hidden="true" />
  </section>
);

export default Clients;
