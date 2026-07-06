/**
 * Subtle 3D tilt on hover for image frames — desktop pointer only.
 * Location: client/src/components/common/TiltFrame.jsx
 */
import { useRef, useCallback } from 'react';
import { cn } from '@utils/helpers';

const TiltFrame = ({ className, children, intensity = 8 }) => {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateY(-5px)`;
  }, [intensity]);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);

  return (
    <div
      ref={ref}
      className={cn('tilt-frame', className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
};

export default TiltFrame;
