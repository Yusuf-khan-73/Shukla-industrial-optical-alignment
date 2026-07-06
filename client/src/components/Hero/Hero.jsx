/**
 * Premium full-screen Hero section.
 * Location: client/src/components/Hero/Hero.jsx
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroStats from './HeroStats';
import { HeroSlideProvider } from './HeroSlideContext';
import './Hero.css';

const Hero = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        { opacity: 0.6, y: 0, duration: 1, delay: 1.4, ease: 'power3.out' }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <HeroSlideProvider>
      <section className="hero" aria-label="Hero">
        <div className="hero__stage">
          <HeroBackground />

          <div className="hero__body">
            <div className="container-custom hero__container">
              <HeroContent />
            </div>
          </div>

          <div ref={scrollRef} className="hero__scroll" aria-hidden="true">
            <span className="hero__scroll-text">Scroll</span>
            <div className="hero__scroll-line">
              <div className="hero__scroll-dot" />
            </div>
          </div>
        </div>

        <HeroStats />
      </section>
    </HeroSlideProvider>
  );
};

export default Hero;
