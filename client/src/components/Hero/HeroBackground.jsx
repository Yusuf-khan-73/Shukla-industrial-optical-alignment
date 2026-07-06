/**
 * Swiper fullscreen background slider for Hero — Ken Burns, progress, touch swipe.
 * Location: client/src/components/Hero/HeroBackground.jsx
 */
import { useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, A11y } from 'swiper/modules';
import { HERO_SLIDES, HERO_SLIDE_INTERVAL_MS } from './heroData';
import { useHeroSlide } from './HeroSlideContext';

const HeroBackground = () => {
  const { setActiveIndex } = useHeroSlide();
  const [progressKey, setProgressKey] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = useCallback((swiper) => {
    const index = swiper.realIndex;
    setActiveSlide(index);
    setActiveIndex(index);
    setProgressKey((k) => k + 1);
  }, [setActiveIndex]);

  return (
    <div className="hero__background" aria-hidden="true">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: HERO_SLIDE_INTERVAL_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        speed={1400}
        pagination={{ clickable: true }}
        grabCursor
        touchRatio={1}
        threshold={8}
        longSwipesRatio={0.25}
        className="hero__swiper"
        onSlideChange={handleSlideChange}
        onInit={handleSlideChange}
        a11y={{
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
        }}
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero__slide">
              <img
                src={slide.image}
                alt={slide.alt}
                className="hero__slide-image"
                loading={slide.id === 1 ? 'eager' : 'lazy'}
                decoding={slide.id === 1 ? 'sync' : 'async'}
                fetchPriority={slide.id === 1 ? 'high' : 'auto'}
                sizes="100vw"
              />
              <span className="hero__slide-caption">{slide.caption}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero__overlay" />
      <div className="hero__overlay-text" aria-hidden="true" />

      <div className="hero__progress" aria-hidden="true">
        <div className="hero__progress-track">
          <span
            key={progressKey}
            className="hero__progress-fill"
            style={{ animationDuration: `${HERO_SLIDE_INTERVAL_MS}ms` }}
          />
        </div>
        <div className="hero__progress-dots">
          {HERO_SLIDES.map((slide, index) => (
            <span
              key={slide.id}
              className={`hero__progress-dot${index === activeSlide ? ' hero__progress-dot--active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBackground;
