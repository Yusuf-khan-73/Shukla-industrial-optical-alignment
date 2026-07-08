/**
 * Services section — home showcase and full detail page blocks.
 * Location: client/src/components/Services/Services.jsx
 */
import ServicesOverview from './ServicesOverview';
import ServiceShowcase from './ServiceShowcase';
import ServiceDetail from './ServiceDetail';
import { SERVICES_DATA } from './servicesData';
import './Services.css';

/**
 * @param {'home'|'full'} variant
 */
const Services = ({ variant = 'home' }) => (
  <section className="services section-padding" id="services" aria-label="Our services">
    <div className="container-custom">
      <div className="services__header" data-aos="fade-up">
        <span className="section-label">Our Services</span>
        <h2 className="section-title">
          {variant === 'home'
            ? 'Industrial Precision Services'
            : 'Complete Service Portfolio'}
        </h2>
        <p className="section-subtitle">
          {variant === 'home'
            ? 'Comprehensive optical alignment, theodolite surveying, and precision measurement solutions for paper mills and manufacturing plants across India.'
            : 'Every service delivered with 18+ years of expertise — description, benefits, FAQ, and direct contact for each specialty.'}
        </p>
      </div>

      {variant === 'home' ? (
        <>
          <ServicesOverview />
          <div className="services__showcase-wrap">
            <ServiceShowcase />
          </div>
        </>
      ) : (
        <div className="services__details">
          {SERVICES_DATA.map((service, index) => (
            <ServiceDetail
              key={service.slug}
              service={service}
              reversed={index % 2 !== 0}
              id={service.slug}
            />
          ))}
        </div>
      )}
    </div>

    <div className="services__bg-accent" aria-hidden="true" />
  </section>
);

export default Services;
