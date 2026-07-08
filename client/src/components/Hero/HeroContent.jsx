/**
 * Hero main content — headline, tagline, CTAs with GSAP reveal per slide.
 * Location: client/src/components/Hero/HeroContent.jsx
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

import { ROUTE_PATHS } from '@routes/routeConfig';
import { useApp } from '@context/AppProvider';
import MagneticButton from './MagneticButton';
import { useHeroSlide } from './HeroSlideContext';

const animateHeroContent = (root) => {
  const badge = root.querySelector('.hero__badge');
  const titleLines = root.querySelectorAll('.hero__title-line');
  const tagline = root.querySelector('.hero__tagline');
  const desc = root.querySelector('.hero__desc');
  const actions = root.querySelectorAll('.hero__actions > *');
  const trust = root.querySelector('.hero__trust');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (badge) {
    tl.fromTo(badge, { opacity: 0, y: 28, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65 });
  }
  if (titleLines.length) {
    tl.fromTo(
      titleLines,
      { opacity: 0, y: 44, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.12 },
      badge ? '-=0.35' : 0
    );
  }
  if (tagline) {
    tl.fromTo(tagline, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35');
  }
  if (desc) {
    tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.4');
  }
  if (actions.length) {
    tl.fromTo(actions, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.3');
  }
  if (trust) {
    tl.fromTo(trust, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.45 }, '-=0.2');
  }

  return tl;
};

const HeroContent = () => {
  const { company, contact } = useApp();
  const contentRef = useRef(null);
  const { activeIndex } = useHeroSlide();

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      animateHeroContent(root);
    }, root);

    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <div ref={contentRef} className="hero__content">
      <div className="hero__badge">
        <span className="hero__badge-dot" aria-hidden="true" />
        {company.experience} {company.experienceLabel}
      </div>

      <h1 className="hero__title">
        <span className="hero__title-line">Industrial Optical</span>
        <span className="hero__title-line hero__title-line--accent">Alignment Experts</span>
      </h1>

      <p className="hero__tagline">{company.tagline}</p>

      <p className="hero__desc">
        Theodolite Alignment, Industrial Surveying &amp; Paper Mill Alignment
        across India — delivered with uncompromising precision.
      </p>

      <div className="hero__actions">
        <MagneticButton to={ROUTE_PATHS.CONTACT}>
          Get a Quote <i className="bi bi-arrow-right" aria-hidden="true" />
        </MagneticButton>
        <MagneticButton to={ROUTE_PATHS.SERVICES} variant="outline">
          Explore Services
        </MagneticButton>
        <a
          href={contact.whatsapp.fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hero__whatsapp-link"
          aria-label="Chat on WhatsApp"
        >
          <i className="bi bi-whatsapp" aria-hidden="true" />
        </a>
      </div>

      <div className="hero__trust">
        <div className="hero__trust-avatars" aria-hidden="true">
          {['JK', 'ITC', 'CP', 'OP'].map((initials) => (
            <span key={initials} className="hero__trust-avatar">{initials}</span>
          ))}
        </div>
        <p className="hero__trust-text">
          Trusted by <strong>100+</strong> paper mills &amp; industries
          <Link to={ROUTE_PATHS.CLIENTS} className="hero__trust-link">
            View Clients <i className="bi bi-arrow-right" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HeroContent;
