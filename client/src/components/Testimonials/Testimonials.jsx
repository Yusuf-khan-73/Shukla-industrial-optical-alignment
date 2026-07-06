/**
 * Testimonials section with carousel and trust metrics.
 * Location: client/src/components/Testimonials/Testimonials.jsx
 */
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { useTestimonials } from '@hooks/useTestimonials';
import TestimonialsCarousel from './TestimonialsCarousel';
import './Testimonials.css';

const Testimonials = () => {
  const { testimonials, loading } = useTestimonials({ featured: true });

  return (
    <section className="testimonials section-padding" id="testimonials" aria-label="Client testimonials">
      <div className="container-custom">
        <div className="row align-items-center g-5">
          <div className="col-lg-4" data-aos="fade-right">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">
              Trusted by India&apos;s leading paper mills and industrial manufacturers for over 18 years.
            </p>

            <div className="testimonials__metrics">
              <div className="testimonials__metric">
                <span className="testimonials__metric-value">5.0</span>
                <span className="testimonials__metric-label">Average Rating</span>
              </div>
              <div className="testimonials__metric">
                <span className="testimonials__metric-value">100+</span>
                <span className="testimonials__metric-label">Happy Clients</span>
              </div>
            </div>

            <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom mt-4">
              Work With Us <i className="bi bi-arrow-right" />
            </Link>
          </div>

          <div className="col-lg-8" data-aos="fade-left">
            <TestimonialsCarousel testimonials={testimonials} loading={loading} />
          </div>
        </div>
      </div>

      <div className="testimonials__bg-quote" aria-hidden="true">&ldquo;</div>
    </section>
  );
};

export default Testimonials;
