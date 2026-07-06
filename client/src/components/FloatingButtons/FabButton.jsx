/**
 * Single floating action button with tooltip and animations.
 * Location: client/src/components/FloatingButtons/FabButton.jsx
 */
import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const FabButton = ({
  href,
  onClick,
  icon,
  label,
  variant = 'default',
  external = false,
  pulse = false,
  ariaLabel,
}) => {
  const ref = useRef(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      gsap.to(ref.current, { scale: 1.12, duration: 0.25, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      gsap.to(ref.current, { scale: 1, duration: 0.25, ease: 'power2.out' });
    }
  };

  const className = `fab-button fab-button--${variant} ${pulse ? 'fab-button--pulse' : ''}`;

  const content = (
    <>
      {pulse && <span className="fab-button__ring" aria-hidden="true" />}
      <i className={`bi ${icon}`} aria-hidden="true" />
      <span className="fab-button__tooltip">{label}</span>
    </>
  );

  const motionProps = {
    ref,
    className,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    whileTap: { scale: 0.92 },
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    'aria-label': ariaLabel || label,
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} type="button" onClick={onClick}>
      {content}
    </motion.button>
  );
};

export default FabButton;
