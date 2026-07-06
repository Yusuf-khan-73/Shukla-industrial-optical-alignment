/**
 * Keep AOS in sync with Lenis smooth scroll.
 * Location: client/src/utils/aosSync.js
 *
 * AOS listens for native window scroll to add .aos-animate.
 * Lenis scroll does not always trigger that path, leaving [data-aos] at opacity:0.
 */
import AOS from 'aos';

export const syncAos = () => {
  if (typeof window === 'undefined') return;
  try {
    AOS.refresh();
    window.dispatchEvent(new Event('scroll'));
  } catch {
    /* AOS not initialized yet */
  }
};

export default syncAos;
