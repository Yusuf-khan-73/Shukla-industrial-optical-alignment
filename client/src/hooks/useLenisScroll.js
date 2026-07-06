/**
 * Subscribe to Lenis scroll (or native window scroll fallback).
 * Location: client/src/hooks/useLenisScroll.js
 */
import { useEffect, useRef } from 'react';
import { useLenisInstance } from '@context/LenisProvider';
import { throttle } from '@utils/helpers';

/**
 * @param {(scrollY: number) => void} callback
 * @param {number} throttleMs
 */
export const useLenisScroll = (callback, throttleMs = 16) => {
  const { lenisRef, ready } = useLenisInstance();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const invoke = (scrollY) => callbackRef.current(scrollY);
    const handler = throttleMs > 0 ? throttle(invoke, throttleMs) : invoke;

    const lenis = lenisRef?.current;
    if (ready && lenis) {
      const onScroll = (instance) => handler(instance.scroll);
      lenis.on('scroll', onScroll);
      onScroll(lenis);
      return () => lenis.off('scroll', onScroll);
    }

    const onWindowScroll = () => handler(window.scrollY);
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    onWindowScroll();
    return () => window.removeEventListener('scroll', onWindowScroll);
  }, [ready, lenisRef, throttleMs]);
};

export default useLenisScroll;
