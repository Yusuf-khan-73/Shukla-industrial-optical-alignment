/**
 * Services grid overview.
 * Location: client/src/components/Services/ServicesOverview.jsx
 */
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { SERVICES_DATA } from './servicesData';
import ServiceCard from './ServiceCard';

const ServicesOverview = ({ onSelect, activeSlug }) => (
  <div className="services-overview">
    <div className="services-overview__grid">
      {SERVICES_DATA.map((service, index) => (
        <div key={service.slug} data-aos="fade-up" data-aos-delay={index * 50}>
          {onSelect ? (
            <ServiceCard
              service={service}
              active={activeSlug === service.slug}
              onClick={() => onSelect(service)}
            />
          ) : (
            <Link to={`${ROUTE_PATHS.SERVICES}#${service.slug}`} className="service-card service-card--link">
              <div className="service-card__icon">
                <i className={`bi ${service.icon}`} aria-hidden="true" />
              </div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__desc">{service.shortDescription}</p>
              <span className="service-card__arrow" aria-hidden="true">
                <i className="bi bi-arrow-right" />
              </span>
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ServicesOverview;
