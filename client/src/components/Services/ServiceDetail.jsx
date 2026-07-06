/**
 * Full service detail block — image, description, benefits, FAQ, CTA.
 * Location: client/src/components/Services/ServiceDetail.jsx
 */
import { Link } from 'react-router-dom';
import { CONTACT } from '@utils/constants';
import { ROUTE_PATHS } from '@routes/routeConfig';
import ServiceFAQ from './ServiceFAQ';

const ServiceDetail = ({ service, reversed = false, id }) => (
  <article
    id={id || service.slug}
    className={`service-detail ${reversed ? 'service-detail--reversed' : ''}`}
    data-aos="fade-up"
  >
    <div className="row align-items-center g-5">
      <div className="col-lg-6">
        <div className="service-detail__image img-reveal">
          <img
            src={service.image}
            alt={service.imageAlt}
            className="img-cover"
            loading="lazy"
          />
          <div className="service-detail__image-badge glass-card">
            <i className={`bi ${service.icon}`} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="service-detail__icon">
          <i className={`bi ${service.icon}`} aria-hidden="true" />
        </div>
        <h2 className="service-detail__title">{service.title}</h2>
        <p className="service-detail__desc">{service.description}</p>

        <div className="service-detail__benefits">
          <h3 className="service-detail__benefits-title">Key Benefits</h3>
          <ul className="service-detail__benefits-list">
            {service.benefits.map((benefit) => (
              <li key={benefit}>
                <i className="bi bi-check-circle-fill" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <ServiceFAQ faqs={service.faqs} serviceSlug={service.slug} />

        <div className="service-detail__cta">
          <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom">
            Request Quote <i className="bi bi-arrow-right" />
          </Link>
          <a href={CONTACT.whatsapp.fullUrl} target="_blank" rel="noopener noreferrer" className="btn-magnetic btn-dark-custom">
            <i className="bi bi-whatsapp" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  </article>
);

export default ServiceDetail;
