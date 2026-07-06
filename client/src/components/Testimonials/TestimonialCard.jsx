/**
 * Single testimonial card for carousel slide.
 * Location: client/src/components/Testimonials/TestimonialCard.jsx
 */

const StarRating = ({ rating }) => (
  <div className="testimonial-card__stars" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <article className="testimonial-card glass-card">
    <div className="testimonial-card__quote-icon" aria-hidden="true">
      <i className="bi bi-quote" />
    </div>

    <StarRating rating={testimonial.rating} />

    <blockquote className="testimonial-card__quote">
      <p>&ldquo;{testimonial.quote}&rdquo;</p>
    </blockquote>

    <footer className="testimonial-card__author">
      <div className="testimonial-card__avatar" aria-hidden="true">
        {testimonial.initials}
      </div>
      <div className="testimonial-card__info">
        <cite className="testimonial-card__name">{testimonial.name}</cite>
        <span className="testimonial-card__role">{testimonial.designation}</span>
        <span className="testimonial-card__company">
          <i className="bi bi-building" /> {testimonial.company}
        </span>
      </div>
    </footer>
  </article>
);

export default TestimonialCard;
