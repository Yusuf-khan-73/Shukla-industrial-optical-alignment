/**
 * Animated stat counter — scroll-triggered ease-out animation.
 * Location: client/src/components/Hero/StatCounter.jsx
 */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const StatCounter = ({ value, suffix, label, icon }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!inView) return undefined;

    const duration = 2500;
    const startTime = performance.now();
    const target = Number(value) || 0;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, value]);

  return (
    <div ref={ref} className="hero-stat glass-card">
      {icon && (
        <div className="hero-stat__icon" aria-hidden="true">
          <i className={`bi ${icon}`} />
        </div>
      )}
      <div className="hero-stat__number" aria-label={`${value}${suffix} ${label}`}>
        <span>{inView ? count : 0}</span>
        <span className="hero-stat__suffix">{suffix}</span>
      </div>
      <div className="hero-stat__label">{label}</div>
    </div>
  );
};

export default StatCounter;
