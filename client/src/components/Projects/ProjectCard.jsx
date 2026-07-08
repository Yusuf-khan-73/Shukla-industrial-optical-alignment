/**
 * Project portfolio card.
 * Location: client/src/components/Projects/ProjectCard.jsx
 */
import { motion } from 'framer-motion';
import { formatDate } from '@utils/formatters';

const ProjectCard = ({ project, index = 0 }) => (
  <motion.article
    className="project-card premium-card hover-lift"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
    whileHover={{ y: -6 }}
  >
    <div className="project-card__trigger project-card__trigger--static">
      <div className="project-card__image img-reveal">
        <img
          src={project.images?.[0]?.url || project.images?.[0]?.image_url}
          alt={project.images?.[0]?.alt || project.images?.[0]?.alt_text || project.title}
          className="img-cover"
          loading="lazy"
        />
        <span className="project-card__industry">{project.industryLabel}</span>
      </div>

      <div className="premium-card__body project-card__body">
        <div className="project-card__meta">
          <span><i className="bi bi-geo-alt" /> {project.location}</span>
          <span><i className="bi bi-calendar3" /> {formatDate(project.completionDate)}</span>
        </div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__client">
          <i className="bi bi-building" /> {project.client}
        </p>
        <p className="project-card__desc">{project.shortDescription}</p>
        <span className="project-card__service">{project.serviceType}</span>
      </div>
    </div>
  </motion.article>
);

export default ProjectCard;
