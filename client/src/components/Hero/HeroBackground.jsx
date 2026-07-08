/**
 * Swiper fullscreen background slider — Ken Burns, GSAP parallax, fade transitions.
 * Location: client/src/components/Hero/HeroBackground.jsx
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, A11y } from 'swiper/modules';
import { HERO_SLIDES, HERO_SLIDE_INTERVAL_MS } from './heroData';
import { useHeroSlide } from './HeroSlideContext';
import HeroFloatingElements from './HeroFloatingElements';

const HeroBackground = () => {
  const { setActiveIndex } = useHeroSlide();
  const [progressKey, setProgressKey] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const bgRef = useRef(null);
  const parallaxRef = useRef({ x: 0, y: 0 });

  const handleSlideChange = useCallback((swiper) => {
    const index = swiper.realIndex;
    setActiveSlide(index);
    setActiveIndex(index);
    setProgressKey((k) => k + 1);

    const activeImg = bgRef.current?.querySelector('.swiper-slide-active .hero__slide-image');
    if (activeImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(
        activeImg,
        { scale: 1.06, opacity: 0.85 },
        { scale: 1.14, opacity: 1, duration: 6, ease: 'power2.out' }
      );
    }
  }, [setActiveIndex]);

  useEffect(() => {
    const el = bgRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
      parallaxRef.current = { x, y };

      const activeImg = el.querySelector('.swiper-slide-active .hero__slide-image');
      if (activeImg) {
        gsap.to(activeImg, {
          x: x * 0.35,
          y: y * 0.25,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={bgRef} className="hero__background" aria-hidden="true">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: HERO_SLIDE_INTERVAL_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={HERO_SLIDES.length > 1}
        speed={1600}
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
                width="1920"
                height="1080"
              />
              <span className="hero__slide-caption">{slide.caption}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero__overlay" />
      <div className="hero__overlay-text" />
      <HeroFloatingElements />

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
