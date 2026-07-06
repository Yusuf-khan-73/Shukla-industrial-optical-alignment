/**
 * Projects portfolio section.
 * Location: client/src/components/Projects/Projects.jsx
 */
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { STATS } from '@utils/constants';
import ProjectsGrid from './ProjectsGrid';
import './Projects.css';

/**
 * @param {'home'|'full'} variant
 */
const Projects = ({ variant = 'home' }) => (
  <section className="projects section-padding" id="projects" aria-label="Our projects">
    <div className="container-custom">
      <div className="projects__header" data-aos="fade-up">
        <span className="section-label">Our Projects</span>
        <h2 className="section-title">
          {variant === 'home' ? 'Featured Project Portfolio' : '500+ Completed Projects'}
        </h2>
        <p className="section-subtitle">
          {variant === 'home'
            ? 'A selection of precision alignment and installation projects across India\'s paper and industrial sector.'
            : 'Explore our portfolio of industrial optical alignment, machinery installation, and surveying projects.'}
        </p>
        <div className="projects__stat-pill" data-aos="zoom-in">
          <i className="bi bi-trophy-fill" />
          <span><strong>{STATS.projects.value}{STATS.projects.suffix}</strong> Projects Delivered</span>
        </div>
      </div>

      <ProjectsGrid
        featured={variant === 'home'}
        limit={variant === 'home' ? 6 : null}
        showFilters={variant === 'full'}
      />

      {variant === 'home' && (
        <div className="projects__cta text-center" data-aos="fade-up">
          <Link to={ROUTE_PATHS.PROJECTS} className="btn-magnetic btn-primary-custom">
            View All Projects <i className="bi bi-arrow-right" />
          </Link>
        </div>
      )}
    </div>
  </section>
);

export default Projects;
