/**
 * Projects Page
 * Location: client/src/pages/Projects/ProjectsPage.jsx
 */
import PageHero from '@components/Layout/PageHero';
import Projects from '@components/Projects';
import { CONTACT } from '@utils/constants';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import '../PageContent.css';

const ProjectsPage = () => (
  <>
    <PageHero
      title="Our Projects"
      subtitle="500+ completed projects across India's paper and industrial sector."
      breadcrumbs={[{ label: 'Projects' }]}
    />
    <Projects variant="full" />

    <section className="page-content page-content--white section-padding-sm">
      <div className="container-custom text-center" data-aos="fade-up">
        <h2 className="section-title">Have a Project in Mind?</h2>
        <p className="section-subtitle mx-auto mb-4">
          Discuss your optical alignment, surveying, or precision measurement requirements with our engineering team.
          Call {CONTACT.primaryPhone} today.
        </p>
        <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom">
          Discuss Your Project <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </section>
  </>
);

export default ProjectsPage;
