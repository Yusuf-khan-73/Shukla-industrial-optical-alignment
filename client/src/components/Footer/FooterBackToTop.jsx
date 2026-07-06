/**
 * Footer back-to-top button (Lenis-aware).
 * Location: client/src/components/Footer/FooterBackToTop.jsx
 */
import { useLenisInstance } from '@context/LenisProvider';

const FooterBackToTop = () => {
  const { lenisRef } = useLenisInstance();

  const scrollToTop = () => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button type="button" className="footer__back-top" onClick={scrollToTop} aria-label="Back to top">
      <i className="bi bi-arrow-up" aria-hidden="true" />
      <span>Back to Top</span>
    </button>
  );
};

export default FooterBackToTop;
