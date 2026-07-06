/**
 * Company growth timeline — centered line with edge-aligned year badges.
 * Location: client/src/components/About/AboutTimeline.jsx
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import { TIMELINE } from './aboutData';

gsap.registerPlugin(ScrollTrigger);

const AboutTimeline = () => {
  const trackRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const track = trackRef.current;
    const line = lineRef.current;
    if (!track || !line) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top 82%',
            end: 'bottom 40%',
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        track.querySelectorAll('.about-timeline__dot-inner'),
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: 'back.out(1.6)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: track,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-timeline">
      <SectionHeader
        centered
        label="Our Journey"
        title="18 Years of Growth & Excellence"
        subtitle="From a specialized alignment firm to India's trusted industrial engineering partner."
      />

      <div ref={trackRef} className="about-timeline__track">
        <div ref={lineRef} className="about-timeline__line" aria-hidden="true" />

        {TIMELINE.map((item, index) => (
          <article
            key={item.year}
            className={`about-timeline__item ${index % 2 === 0 ? 'about-timeline__item--left' : 'about-timeline__item--right'}`}
            data-aos="fade-up"
            data-aos-delay={index * 70}
          >
            <div className="about-timeline__card premium-card">
              <div className="premium-card__body">
                <span className="about-timeline__year">{item.year}</span>
                <h3 className="about-timeline__title">{item.title}</h3>
                <p className="about-timeline__desc">{item.description}</p>
              </div>
            </div>

            <div className="about-timeline__dot" aria-hidden="true">
              <span className="about-timeline__dot-inner">{item.year}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AboutTimeline;
