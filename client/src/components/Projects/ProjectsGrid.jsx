/**
 * Projects grid with industry filters.
 * Location: client/src/components/Projects/ProjectsGrid.jsx
 */
import { useState } from 'react';
import { useProjects } from '@hooks/useProjects';
import { PROJECT_INDUSTRIES } from './projectsData';
import ProjectCard from './ProjectCard';

const ProjectsGrid = ({ featured = false, limit = null, showFilters = false }) => {
  const [industry, setIndustry] = useState('all');
  const { projects, loading } = useProjects({ featured, limit, industry });

  return (
    <>
      {showFilters && (
        <div className="projects-grid__filters" role="tablist" aria-label="Filter by industry">
          {PROJECT_INDUSTRIES.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={industry === f.id}
              className={`projects-grid__filter ${industry === f.id ? 'projects-grid__filter--active' : ''}`}
              onClick={() => setIndustry(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="projects-grid__loading">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="project-card-skeleton img-skeleton" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="projects-grid__empty text-center text-muted">No projects found for this filter.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectsGrid;
