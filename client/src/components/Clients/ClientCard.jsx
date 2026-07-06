/**
 * Animated client card with glassmorphism and hover effects.
 * Location: client/src/components/Clients/ClientCard.jsx
 */
import { motion } from 'framer-motion';

const ClientCard = ({ client, index = 0, compact = false }) => (
  <motion.article
    className={`client-card ${compact ? 'client-card--compact' : ''}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
    whileHover={{ y: -8, transition: { duration: 0.25 } }}
  >
    <div
      className="client-card__glow"
      style={{ '--client-hue': client.accentHue }}
      aria-hidden="true"
    />

    <div className="client-card__logo" style={{ '--client-hue': client.accentHue }}>
      <span className="client-card__initials">{client.initials}</span>
    </div>

    <h3 className="client-card__name">{client.name}</h3>

    <span className={`client-card__badge client-card__badge--${client.category}`}>
      {client.categoryLabel}
    </span>

    <div className="client-card__shine" aria-hidden="true" />
  </motion.article>
);

export default ClientCard;
