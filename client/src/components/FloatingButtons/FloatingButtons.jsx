/**
 * Global floating action buttons — WhatsApp, Call, Email, Scroll to Top.
 * Location: client/src/components/FloatingButtons/FloatingButtons.jsx
 */
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CONTACT } from '@utils/constants';
import { useLenisInstance } from '@context/LenisProvider';
import { useLenisScroll } from '@hooks/useLenisScroll';
import FabButton from './FabButton';
import './FloatingButtons.css';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { lenisRef } = useLenisInstance();

  const onScroll = useCallback((scrollY) => {
    const next = scrollY > 400;
    setShowScrollTop((prev) => (prev === next ? prev : next));
  }, []);

  useLenisScroll(onScroll, 32);

  const scrollToTop = () => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="floating-buttons" aria-label="Quick contact actions">
      <FabButton
        href={CONTACT.whatsapp.fullUrl}
        icon="bi-whatsapp"
        label="WhatsApp"
        variant="whatsapp"
        external
        pulse
        ariaLabel="Chat on WhatsApp"
      />

      <FabButton
        href={CONTACT.primaryPhoneTel}
        icon="bi-telephone-fill"
        label="Call Us"
        variant="call"
        ariaLabel={`Call ${CONTACT.primaryPhone}`}
      />

      <FabButton
        href={CONTACT.emailMailto}
        icon="bi-envelope-fill"
        label="Email"
        variant="email"
        ariaLabel={`Email ${CONTACT.email}`}
      />

      <AnimatePresence>
        {showScrollTop && (
          <FabButton
            key="scroll-top"
            onClick={scrollToTop}
            icon="bi-arrow-up"
            label="Scroll to Top"
            variant="scroll"
            ariaLabel="Scroll to top"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingButtons;
