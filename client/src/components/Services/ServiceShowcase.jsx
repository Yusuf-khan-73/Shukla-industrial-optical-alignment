/**
 * Interactive service showcase with tabs for home page.
 * Location: client/src/components/Services/ServiceShowcase.jsx
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { CONTACT } from '@utils/constants';
import { SERVICES_DATA } from './servicesData';
import ServiceFAQ from './ServiceFAQ';

const ServiceShowcase = () => {
  const [active, setActive] = useState(0);
  const service = SERVICES_DATA[active];

  return (
    <div className="service-showcase">
      {/* Tab pills */}
      <div className="service-showcase__tabs" role="tablist" aria-label="Services">
        {SERVICES_DATA.map((s, index) => (
          <button
            key={s.slug}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={`service-showcase__tab ${active === index ? 'service-showcase__tab--active' : ''}`}
            onClick={() => setActive(index)}
          >
            <i className={`bi ${s.icon}`} aria-hidden="true" />
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Active service panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={service.slug}
          className="service-showcase__panel glass-card"
          role="tabpanel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div className="service-showcase__image img-reveal">
                <img src={service.image} alt={service.imageAlt} className="img-cover" loading="lazy" />
              </div>
            </div>
            <div className="col-lg-7">
              <h3 className="service-showcase__title">{service.title}</h3>
              <p className="service-showcase__desc">{service.description}</p>

              <ul className="service-showcase__benefits">
                {service.benefits.slice(0, 4).map((b) => (
                  <li key={b}>
                    <i className="bi bi-check2" />
                    {b}
                  </li>
                ))}
              </ul>

              <ServiceFAQ faqs={service.faqs} serviceSlug={`showcase-${service.slug}`} />

              <div className="service-showcase__actions">
                <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom">
                  Get a Quote
                </Link>
                <a href={CONTACT.whatsapp.fullUrl} target="_blank" rel="noopener noreferrer" className="service-showcase__wa">
                  <i className="bi bi-whatsapp" /> Chat Now
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="text-center mt-4">
        <Link to={ROUTE_PATHS.SERVICES} className="btn-magnetic btn-dark-custom">
          View All Services <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceShowcase;
