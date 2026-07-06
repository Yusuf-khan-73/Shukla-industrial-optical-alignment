/**
 * Scroll progress bar — updates DOM directly (no React state) to avoid
 * re-rendering the entire page tree on every scroll frame.
 * Location: client/src/components/Layout/ScrollProgressBar.jsx
 */
import { useEffect, useRef } from 'react';
import { useLenisScroll } from '@hooks/useLenisScroll';

const ScrollProgressBar = () => {
  const barRef = useRef(null);

  useLenisScroll((scrollTop) => {
    const bar = barRef.current;
    if (!bar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const progress = Math.min(100, Math.max(0, value));
    bar.style.width = `${progress}%`;
  }, 16);

  useEffect(() => () => {
    if (barRef.current) barRef.current.style.width = '0%';
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar"
      style={{ width: '0%' }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgressBar;
