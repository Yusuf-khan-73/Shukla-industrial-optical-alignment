/**
 * Home About preview section.
 * Location: client/src/components/Home/HomeAboutPreview.jsx
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTE_PATHS } from '@routes/routeConfig';
import TiltFrame from '@components/common/TiltFrame';
import { HOME_ABOUT_PREVIEW } from './homeAboutData';
import './HomeAboutPreview.css';

gsap.registerPlugin(ScrollTrigger);

const HomeAboutPreview = () => {
  const { label, title, description, stats, commitments, images } = HOME_ABOUT_PREVIEW;
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      if (copyRef.current) {
        gsap.from(copyRef.current.children, {
          opacity: 0,
          y: 32,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: copyRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (visualRef.current) {
        gsap.from(visualRef.current.querySelectorAll('.tilt-frame, .home-about-preview__commitment'), {
          opacity: 0,
          y: 40,
          scale: 0.97,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: visualRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="home-about-preview" id="about" aria-label="About us">
      <div className="container-custom">
        <div className="row g-4 g-lg-5 align-items-start">
          <div className="col-lg-6">
            <div ref={copyRef} className="home-about-preview__copy">
              <span className="section-label">{label}</span>
              <h2 className="section-title home-about-preview__title">{title}</h2>
              <p className="home-about-preview__desc">{description}</p>

              <div className="home-about-preview__stats">
                {stats.map((stat) => (
                  <div key={stat.key} className="home-about-preview__stat">
                    <div>
                      <strong className="home-about-preview__stat-value">
                        {stat.value}{stat.suffix}
                      </strong>
                      <span className="home-about-preview__stat-label">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="home-about-preview__actions">
                <Link
                  to={ROUTE_PATHS.ABOUT}
                  className="btn-magnetic btn-dark-custom home-about-preview__cta"
                >
                  Read Full Story <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div ref={visualRef} className="home-about-preview__visual">
              <div className="home-about-preview__gallery">
                <TiltFrame className="home-about-preview__img-main">
                  <img src={images.main} alt={images.mainAlt} loading="lazy" decoding="async" width="900" height="563" />
                </TiltFrame>
                <div className="home-about-preview__img-row">
                  <TiltFrame className="home-about-preview__img-sub">
                    <img src={images.sub1} alt={images.sub1Alt} loading="lazy" decoding="async" width="600" height="450" />
                  </TiltFrame>
                  <TiltFrame className="home-about-preview__img-sub">
                    <img src={images.sub2} alt={images.sub2Alt} loading="lazy" decoding="async" width="600" height="450" />
                  </TiltFrame>
                </div>
              </div>

              <div className="home-about-preview__commitment">
                {commitments.map((item) => (
                  <span key={item} className="home-about-preview__commitment-item">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAboutPreview;
