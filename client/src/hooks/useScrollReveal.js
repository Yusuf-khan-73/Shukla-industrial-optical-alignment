/**
 * GSAP ScrollTrigger reveal — fade/slide elements into view on scroll.
 * Location: client/src/hooks/useScrollReveal.js
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {object} [options]
 * @param {number} [options.y=36]
 * @param {number} [options.x=0]
 * @param {number} [options.scale=1]
 * @param {number} [options.duration=0.85]
 * @param {string} [options.start='top 88%']
 * @param {number} [options.delay=0]
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: options.y ?? 36,
          x: options.x ?? 0,
          scale: options.scale ?? 1,
          filter: options.blur ? 'blur(8px)' : 'none',
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: 'none',
          duration: options.duration ?? 0.85,
          delay: options.delay ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 88%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [options.y, options.x, options.scale, options.duration, options.start, options.delay, options.blur]);

  return ref;
};

export default useScrollReveal;
