/**
 * Swiper testimonials carousel with autoplay.
 * Location: client/src/components/Testimonials/TestimonialsCarousel.jsx
 */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import TestimonialCard from './TestimonialCard';

const TestimonialsCarousel = ({ testimonials, loading }) => {
  if (loading) {
    return (
      <div className="testimonials-carousel__loading">
        <div className="testimonial-skeleton glass-card img-skeleton" />
      </div>
    );
  }

  if (!testimonials.length) return null;

  return (
    <div className="testimonials-carousel">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation
        loop={testimonials.length > 1}
        speed={800}
        className="testimonials-carousel__swiper"
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id}>
            <TestimonialCard testimonial={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialsCarousel;
