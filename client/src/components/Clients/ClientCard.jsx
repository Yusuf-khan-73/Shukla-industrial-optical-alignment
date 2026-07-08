/**
 * Client portfolio card — image, name, location, short description.
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

    <div className="client-card__media">
      <img
        src={client.image}
        alt={client.imageAlt || client.name}
        className="img-cover"
        loading="lazy"
        decoding="async"
      />
    </div>

    <h3 className="client-card__name">{client.name}</h3>

    <p className="client-card__location">
      <i className="bi bi-geo-alt" aria-hidden="true" />
      {client.location}
    </p>

    <p className="client-card__desc">{client.shortDescription}</p>

    <div className="client-card__shine" aria-hidden="true" />
  </motion.article>
);

export default ClientCard;
