/**
 * Lenis smooth scroll provider with GSAP ScrollTrigger + AOS integration.
 * Location: client/src/context/LenisProvider.jsx
 */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from '@utils/helpers';
import { syncAos } from '@utils/aosSync';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext({ lenisRef: { current: null }, ready: false });

const prefersReducedMotion = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReady(false);
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const refreshAos = debounce(() => syncAos(), 50);
    lenis.on('scroll', refreshAos);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      scrollHeight() {
        return document.documentElement.scrollHeight;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', onRefresh);

    const syncScrollMetrics = debounce(() => {
      lenis.resize();
      ScrollTrigger.refresh();
      syncAos();
    }, 100);

    window.addEventListener('resize', syncScrollMetrics);
    window.addEventListener('load', syncScrollMetrics);

    const resizeObserver = new ResizeObserver(syncScrollMetrics);
    resizeObserver.observe(document.body);

    ScrollTrigger.refresh();
    syncScrollMetrics();
    syncAos();

    setReady(true);

    return () => {
      setReady(false);
      lenis.off('scroll', refreshAos);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      window.removeEventListener('resize', syncScrollMetrics);
      window.removeEventListener('load', syncScrollMetrics);
      resizeObserver.disconnect();
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value = useMemo(() => ({ lenisRef, ready }), [ready]);

  return (
    <LenisContext.Provider value={value}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenisInstance = () => useContext(LenisContext);

export default LenisContext;
