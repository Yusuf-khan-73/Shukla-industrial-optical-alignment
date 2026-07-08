/**
 * Subtle floating industrial accent shapes for hero depth.
 * Location: client/src/components/Hero/HeroFloatingElements.jsx
 */
import { motion } from 'framer-motion';

const shapes = [
  { id: 'a', className: 'hero__float hero__float--1', delay: 0 },
  { id: 'b', className: 'hero__float hero__float--2', delay: 0.4 },
  { id: 'c', className: 'hero__float hero__float--3', delay: 0.8 },
  { id: 'd', className: 'hero__float hero__float--4', delay: 1.2 },
];

const HeroFloatingElements = () => (
  <div className="hero__floating" aria-hidden="true">
    {shapes.map((shape) => (
      <motion.span
        key={shape.id}
        className={shape.className}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.15, 0.35, 0.15],
          y: [0, -18, 0],
          x: [0, 8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          delay: shape.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

export default HeroFloatingElements;
