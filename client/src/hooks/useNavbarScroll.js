/**
 * Tracks navbar scroll state for shrink and background transitions.
 * Location: client/src/hooks/useNavbarScroll.js
 */
import { useState, useCallback } from 'react';
import { useLenisScroll } from './useLenisScroll';

const SCROLL_THRESHOLD = 40;

export const useNavbarScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const update = useCallback((scrollTop) => {
    const next = scrollTop > SCROLL_THRESHOLD;
    setIsScrolled((prev) => (prev === next ? prev : next));
  }, []);

  useLenisScroll(update, 32);

  return { isScrolled };
};

export default useNavbarScroll;
