/**
 * Industrial trust indicator pills for the Hero section.
 * Location: client/src/components/Hero/HeroTrustIndicators.jsx
 */
import { HERO_TRUST_INDICATORS } from './heroData';

const HeroTrustIndicators = () => (
  <ul className="hero__indicators" aria-label="Company credentials">
    {HERO_TRUST_INDICATORS.map((item) => (
      <li key={item.label} className="hero__indicator">
        <i className={`bi ${item.icon}`} aria-hidden="true" />
        <span>{item.label}</span>
      </li>
    ))}
  </ul>
);

export default HeroTrustIndicators;
