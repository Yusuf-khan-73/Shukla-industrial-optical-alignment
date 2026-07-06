/**
 * Company story with GSAP image reveal.
 * Location: client/src/components/About/AboutStory.jsx
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { ABOUT_STORY } from './aboutData';

gsap.registerPlugin(ScrollTrigger);

const AboutStory = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(100% 0 0 0)', scale: 1.15 },
          {
            clipPath: 'inset(0% 0 0 0)',
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="about-story">
      <div className="row align-items-center g-5">
        <div className="col-lg-6" data-aos="fade-right">
          <span className="section-label">{ABOUT_STORY.label}</span>
          <h2 className="section-title">{ABOUT_STORY.title}</h2>
          {ABOUT_STORY.paragraphs.map((para, i) => (
            <p key={i} className={i === 0 ? 'lead' : ''}>
              {para}
            </p>
          ))}
          <Link to={ROUTE_PATHS.ABOUT} className="btn-magnetic btn-dark-custom mt-2">
            Read Full Story <i className="bi bi-arrow-right" />
          </Link>
        </div>

        <div className="col-lg-6" data-aos="fade-left">
          <div className="about-story__image-wrap">
            <div ref={imageRef} className="about-story__image img-reveal">
              <img
                src={ABOUT_STORY.image}
                alt={ABOUT_STORY.imageAlt}
                className="img-cover"
                loading="lazy"
              />
            </div>
            <div className="about-story__badge glass-card">
              <span className="about-story__badge-number">18+</span>
              <span className="about-story__badge-text">Years of<br />Excellence</span>
            </div>
            <div className="about-story__frame" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutStory;
