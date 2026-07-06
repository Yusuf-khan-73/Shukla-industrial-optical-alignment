/**
 * Scrolls to top on route change (Lenis-aware).
 * Location: client/src/components/Layout/ScrollToTop.jsx
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenisInstance } from '@context/LenisProvider';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { lenisRef, ready } = useLenisInstance();

  useEffect(() => {
    const lenis = ready ? lenisRef?.current : null;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, ready, lenisRef]);

  return null;
};

export default ScrollToTop;
