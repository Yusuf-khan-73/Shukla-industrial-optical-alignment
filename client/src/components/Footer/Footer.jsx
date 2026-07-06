/**
 * Site footer — corporate industrial layout.
 * Location: client/src/components/Footer/Footer.jsx
 */
import { Link } from 'react-router-dom';
import { useApp } from '@context/AppProvider';
import { SERVICES_LIST } from '@utils/constants';
import { ROUTE_PATHS } from '@routes/routeConfig';
import logo from '@assets/logo/logo.png';
import FooterSocial from './FooterSocial';
import FooterBackToTop from './FooterBackToTop';
import './Footer.css';

const currentYear = new Date().getFullYear();

const FOOTER_QUICK_LINKS = [
  { label: 'Home', path: ROUTE_PATHS.HOME },
  { label: 'Services', path: ROUTE_PATHS.SERVICES },
  { label: 'Projects', path: ROUTE_PATHS.PROJECTS },
  { label: 'Contact', path: ROUTE_PATHS.CONTACT },
];

const Footer = () => {
  const { company, contact, mapEmbedUrl, mapLink } = useApp();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top-border" aria-hidden="true" />

      <div className="footer__emergency">
        <div className="container-custom footer__emergency-inner">
          <div className="footer__emergency-text">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <div>
              <strong>Emergency Support Available 24×7</strong>
              <span>Breakdown alignment &amp; urgent site assistance across India</span>
            </div>
          </div>
          <div className="footer__emergency-actions">
            <a href={contact.primaryPhoneTel} className="footer__emergency-btn">
              <i className="bi bi-telephone-fill" aria-hidden="true" />
              {contact.primaryPhone}
            </a>
            <a
              href={contact.whatsapp.fullUrl}
              className="footer__emergency-btn footer__emergency-btn--whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-whatsapp" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to={ROUTE_PATHS.HOME} className="footer__logo-link">
              <img
                src={logo}
                alt={company.shortName}
                className="footer__logo"
                width="160"
                height="80"
              />
            </Link>
            <h2 className="footer__brand-name">{company.name}</h2>
            <p className="footer__tagline">{company.tagline}</p>
            <p className="footer__desc">{company.description}</p>
            <FooterSocial />
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__links">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer__link">
                    <i className="bi bi-chevron-right" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Our Services</h3>
            <ul className="footer__links">
              {SERVICES_LIST.slice(0, 6).map((service) => (
                <li key={service}>
                  <Link to={ROUTE_PATHS.SERVICES} className="footer__link">
                    <i className="bi bi-chevron-right" aria-hidden="true" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Contact Us</h3>
            <ul className="footer__contact-list">
              <li>
                <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                <a href={mapLink} target="_blank" rel="noopener noreferrer">
                  {contact.address.full}
                </a>
              </li>
              {contact.phones.map((phone) => (
                <li key={phone}>
                  <i className="bi bi-telephone-fill" aria-hidden="true" />
                  <a href={`tel:+${phone.replace(/\D/g, '')}`}>{phone}</a>
                </li>
              ))}
              <li>
                <i className="bi bi-envelope-fill" aria-hidden="true" />
                <a href={contact.emailMailto}>{contact.email}</a>
              </li>
              <li>
                <i className="bi bi-clock-fill" aria-hidden="true" />
                <span>
                  {contact.workingHours.days}<br />
                  {contact.workingHours.time}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom-row">
          <div className="footer__map">
            <h3 className="footer__title">Find Us on Map</h3>
            <div className="footer__map-frame">
              <iframe
                src={mapEmbedUrl}
                title="Shukla Industrial — Office Location Map"
                className="footer__map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="footer__cta-card">
            <h3 className="footer__title">Need Immediate Help?</h3>
            <p className="footer__cta-desc">
              Our engineers are available around the clock for emergency optical alignment
              and breakdown support at paper mills and industrial plants.
            </p>
            <Link to={ROUTE_PATHS.CONTACT} className="footer__cta-btn">
              Request a Quote <i className="bi bi-arrow-right" />
            </Link>
            <FooterBackToTop />
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container-custom footer__bottom-inner">
          <p className="footer__copyright">
            &copy; {currentYear} {company.name}. All Rights Reserved.
          </p>
          <p className="footer__credit">
            Precision Industrial Alignment Since {company.foundedYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
