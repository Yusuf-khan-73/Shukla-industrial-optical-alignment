/**
 * Premium sticky navbar with glassmorphism, mobile menu, and scroll animations.
 * Location: client/src/components/Navbar/Navbar.jsx
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

import { NAV_LINKS, COMPANY, CONTACT } from '@utils/constants';
import { ROUTE_PATHS } from '@routes/routeConfig';
import { useNavbarScroll } from '@hooks/useNavbarScroll';
import { useIsMobile } from '@hooks/useMediaQuery';
import { cn } from '@utils/helpers';
import logo from '@assets/logo/logo.png';

import './Navbar.css';

const Navbar = () => {
  const { isScrolled } = useNavbarScroll();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const linksRef = useRef([]);

  const isHome = location.pathname === ROUTE_PATHS.HOME;
  const isTransparent = isHome && !isScrolled && !menuOpen;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  /* Close menu on route change */
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  /* Lock body scroll + isolate page content when mobile menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('navbar-menu-open');
    } else {
      document.body.classList.remove('navbar-menu-open');
    }

    return () => {
      document.body.classList.remove('navbar-menu-open');
    };
  }, [menuOpen]);

  /* Escape key closes menu */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeMenu]);

  /* GSAP stagger animation for desktop nav links on mount */
  useEffect(() => {
    if (isMobile || !navRef.current) return;

    const links = linksRef.current.filter(Boolean);
    gsap.fromTo(
      links,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
    );
  }, [isMobile]);

  const navLinkClass = ({ isActive }) =>
    cn('navbar__link', isActive && 'navbar__link--active');

  const mobileMenu = (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            className="navbar__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMenu}
            aria-hidden="true"
          />
          <motion.nav
            id="mobile-nav"
            className={cn('navbar__mobile', isScrolled && 'navbar__mobile--scrolled')}
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-lenis-prevent
          >
            <ul className="navbar__mobile-links" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.path} role="none">
                  <NavLink
                    to={link.path}
                    end={link.path === ROUTE_PATHS.HOME}
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="navbar__mobile-footer">
              <a href={CONTACT.primaryPhoneTel} className="navbar__mobile-contact" onClick={closeMenu}>
                <i className="bi bi-telephone-fill" aria-hidden="true" />
                {CONTACT.primaryPhone}
              </a>
              <a
                href={CONTACT.whatsapp.fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar__mobile-contact"
                onClick={closeMenu}
              >
                <i className="bi bi-whatsapp" aria-hidden="true" />
                WhatsApp
              </a>
              <Link
                to={ROUTE_PATHS.CONTACT}
                className="navbar__cta btn-magnetic btn-primary-custom w-100 justify-content-center"
                onClick={closeMenu}
              >
                Get a Quote
                <i className="bi bi-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <header
      ref={navRef}
      className={cn(
        'navbar',
        isScrolled && 'navbar--scrolled',
        isTransparent && 'navbar--transparent',
        menuOpen && 'navbar--menu-open'
      )}
      role="banner"
    >
      <div className="container-custom navbar__inner">
        {/* Logo */}
        <Link
          to={ROUTE_PATHS.HOME}
          className="navbar__brand"
          aria-label={`${COMPANY.shortName} — Home`}
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt={COMPANY.shortName}
            className="navbar__logo"
            width="120"
            height="48"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__links" role="list">
            {NAV_LINKS.map((link, index) => (
              <li key={link.path} role="none">
                <NavLink
                  ref={(el) => { linksRef.current[index] = el; }}
                  to={link.path}
                  end={link.path === ROUTE_PATHS.HOME}
                  className={navLinkClass}
                >
                  {link.label}
                  <span className="navbar__link-indicator" aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop actions */}
        <div className="navbar__actions">
          <a
            href={CONTACT.primaryPhoneTel}
            className="navbar__phone"
            aria-label={`Call us at ${CONTACT.primaryPhone}`}
          >
            <i className="bi bi-telephone-fill" aria-hidden="true" />
            <span>{CONTACT.primaryPhone}</span>
          </a>
          <Link to={ROUTE_PATHS.CONTACT} className="navbar__cta btn-magnetic btn-primary-custom">
            Get a Quote
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={cn('navbar__toggle', menuOpen && 'navbar__toggle--open')}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
        </button>
      </div>

      {/* Portal: escape navbar stacking context so menu sits above hero & FABs */}
      {typeof document !== 'undefined' && createPortal(mobileMenu, document.body)}
    </header>
  );
};

export default Navbar;
