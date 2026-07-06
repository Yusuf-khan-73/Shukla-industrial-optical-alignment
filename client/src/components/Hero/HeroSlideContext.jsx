/**
 * Active hero slide index — shared between background slider and content animations.
 * Location: client/src/components/Hero/HeroSlideContext.jsx
 */
import { createContext, useContext, useMemo, useState } from 'react';

const HeroSlideContext = createContext(null);

export const HeroSlideProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const value = useMemo(() => ({ activeIndex, setActiveIndex }), [activeIndex]);
  return (
    <HeroSlideContext.Provider value={value}>
      {children}
    </HeroSlideContext.Provider>
  );
};

export const useHeroSlide = () => {
  const ctx = useContext(HeroSlideContext);
  if (!ctx) {
    throw new Error('useHeroSlide must be used within HeroSlideProvider');
  }
  return ctx;
};

export default HeroSlideContext;
