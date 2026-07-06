/**
 * Service overview card for grid display.
 * Location: client/src/components/Services/ServiceCard.jsx
 */
const ServiceCard = ({ service, active, onClick }) => (
  <button
    type="button"
    className={`service-card ${active ? 'service-card--active' : ''}`}
    onClick={() => onClick?.(service)}
    aria-pressed={active}
  >
    <div className="service-card__icon">
      <i className={`bi ${service.icon}`} aria-hidden="true" />
    </div>
    <h3 className="service-card__title">{service.title}</h3>
    <p className="service-card__desc">{service.shortDescription}</p>
    <span className="service-card__arrow" aria-hidden="true">
      <i className="bi bi-arrow-right" />
    </span>
  </button>
);

export default ServiceCard;
