/**
 * Hero stats row with animated counters.
 * Location: client/src/components/Hero/HeroStats.jsx
 */
import { STATS } from '@utils/constants';
import StatCounter from './StatCounter';

const STAT_ICONS = {
  experience: 'bi-award',
  projects: 'bi-building-check',
  clients: 'bi-people',
  support: 'bi-headset',
};

const HeroStats = () => (
  <div className="hero__stats">
    <div className="container-custom">
      <div className="hero__stats-grid">
        {Object.entries(STATS).map(([key, stat]) => (
          <StatCounter
            key={key}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            icon={STAT_ICONS[key]}
          />
        ))}
      </div>
    </div>
  </div>
);

export default HeroStats;
