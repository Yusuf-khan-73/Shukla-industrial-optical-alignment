/**
 * Route wrapper — applies SEO meta and refreshes AOS on mount.
 * Location: client/src/components/Layout/PageWrapper.jsx
 */
import { useEffect } from 'react';
import { usePageMeta } from '@hooks/usePageMeta';
import { syncAos } from '@utils/aosSync';

const PageWrapper = ({ meta, children }) => {
  usePageMeta(meta);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => syncAos());
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return children;
};

export default PageWrapper;
