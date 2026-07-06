/**
 * About Page
 * Location: client/src/pages/About/AboutPage.jsx
 */
import PageHero from '@components/Layout/PageHero';
import About from '@components/About';
import { COMPANY, CONTACT } from '@utils/constants';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@routes/routeConfig';
import '../PageContent.css';

const AboutPage = () => (
  <>
    <PageHero
      title="About Us"
      subtitle={`${COMPANY.experience} years of precision, accuracy, and reliability in industrial optical alignment.`}
      breadcrumbs={[{ label: 'About' }]}
    />
    <About />

    {/* CTA strip */}
    <section className="page-content page-content--white section-padding-sm">
      <div className="container-custom text-center" data-aos="fade-up">
        <h2 className="section-title">Ready to Work With Us?</h2>
        <p className="section-subtitle mx-auto mb-4">
          Partner with India&apos;s trusted industrial optical alignment experts.
          Call {CONTACT.primaryPhone} or request a quote today.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to={ROUTE_PATHS.CONTACT} className="btn-magnetic btn-primary-custom">
            Get a Quote <i className="bi bi-arrow-right" />
          </Link>
          <a href={CONTACT.primaryPhoneTel} className="btn-magnetic btn-dark-custom">
            <i className="bi bi-telephone-fill" /> Call Now
          </a>
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;
