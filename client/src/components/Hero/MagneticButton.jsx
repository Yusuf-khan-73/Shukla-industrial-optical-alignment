/**
 * Magnetic hover effect CTA button.
 * Location: client/src/components/Hero/MagneticButton.jsx
 */
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MagneticButton = ({ to, href, variant = 'primary', children, className = '', external = false }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const variantClass =
    variant === 'outline' ? 'btn-outline-custom' : 'btn-primary-custom';

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.2);
    el.style.setProperty('--ripple-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--ripple-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = `btn-magnetic ${variantClass} hero__cta ${className}`.trim();

  if (href) {
    return (
      <motion.a
        ref={ref}
        style={{ x: springX, y: springY, display: 'inline-block', '--ripple-x': '50%', '--ripple-y': '50%' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block', '--ripple-x': '50%', '--ripple-y': '50%' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={to} className={classes}>
        {children}
      </Link>
    </motion.div>
  );
};

export default MagneticButton;
