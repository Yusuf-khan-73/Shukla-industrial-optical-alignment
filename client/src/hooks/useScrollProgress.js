/**
 * Shukla Industrial — Scroll Progress Hook (legacy — prefer ScrollProgressBar)
 * Location: client/src/hooks/useScrollProgress.js
 */
import { useState, useCallback } from 'react';
import { useLenisScroll } from './useLenisScroll';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  const update = useCallback((scrollTop) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress((prev) => {
      const next = Math.min(100, Math.max(0, value));
      return Math.abs(prev - next) < 0.5 ? prev : next;
    });
  }, []);

  useLenisScroll(update, 32);

  return progress;
};

export default useScrollProgress;
