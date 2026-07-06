/**
 * Project detail modal with image gallery.
 * Location: client/src/components/Projects/ProjectDetailModal.jsx
 */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { formatDate } from '@utils/formatters';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { CONTACT } from '@utils/constants';

const ProjectDetailModal = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="project-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="project-modal__wrapper">
            <motion.div
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
            <button
              type="button"
              className="project-modal__close"
              onClick={onClose}
              aria-label="Close project details"
            >
              <i className="bi bi-x-lg" />
            </button>

            <div className="project-modal__gallery">
              {project.images?.length > 1 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="project-modal__swiper"
                >
                  {project.images.map((img) => (
                    <SwiperSlide key={img.url}>
                      <img src={img.url} alt={img.alt} className="project-modal__image" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src={project.images?.[0]?.url}
                  alt={project.images?.[0]?.alt || project.title}
                  className="project-modal__image"
                />
              )}
            </div>

            <div className="project-modal__content">
              <span className="project-modal__badge">{project.industryLabel}</span>
              <h2 id="project-modal-title" className="project-modal__title">{project.title}</h2>

              <div className="project-modal__meta">
                <div className="project-modal__meta-item">
                  <i className="bi bi-building" />
                  <div>
                    <span className="project-modal__meta-label">Client</span>
                    <span>{project.client}</span>
                  </div>
                </div>
                <div className="project-modal__meta-item">
                  <i className="bi bi-geo-alt" />
                  <div>
                    <span className="project-modal__meta-label">Location</span>
                    <span>{project.location}</span>
                  </div>
                </div>
                <div className="project-modal__meta-item">
                  <i className="bi bi-calendar-check" />
                  <div>
                    <span className="project-modal__meta-label">Completed</span>
                    <span>{formatDate(project.completionDate)}</span>
                  </div>
                </div>
                <div className="project-modal__meta-item">
                  <i className="bi bi-tools" />
                  <div>
                    <span className="project-modal__meta-label">Service</span>
                    <span>{project.serviceType}</span>
                  </div>
                </div>
              </div>

              <p className="project-modal__desc">{project.description}</p>

              <div className="project-modal__cta">
                <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom" onClick={onClose}>
                  Start Similar Project <i className="bi bi-arrow-right" />
                </Link>
                <a href={CONTACT.whatsapp.fullUrl} target="_blank" rel="noopener noreferrer" className="btn-magnetic btn-dark-custom">
                  <i className="bi bi-whatsapp" /> WhatsApp
                </a>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
