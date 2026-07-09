/**
 * Shukla Industrial — Root Application Component
 * Location: client/src/App.jsx
 */
import { useEffect } from 'react';
import AOS from 'aos';
import { AppRouter } from '@routes';
import { syncAos } from '@utils/aosSync';

function App() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 20,
      disable: reducedMotion,
    });

    syncAos();
    window.addEventListener('load', syncAos);

    const delayed = window.setTimeout(syncAos, 400);

    return () => {
      window.removeEventListener('load', syncAos);
      window.clearTimeout(delayed);
    };
  }, []);

  return <AppRouter />;
}

export default App;
