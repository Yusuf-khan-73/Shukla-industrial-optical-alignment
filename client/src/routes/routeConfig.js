/**
 * Route definitions with SEO metadata.
 * Location: client/src/routes/routeConfig.js
 */
import { lazy } from 'react';
import { SEO_DEFAULT } from '@utils/constants';

export const ROUTE_PATHS = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  PROJECTS: '/projects',
  GALLERY: '/gallery',
  CLIENTS: '/clients',
  CONTACT: '/contact',
  NOT_FOUND: '*',
};

/** Lazy-loaded page components for code splitting */
export const HomePage = lazy(() => import('@pages/Home/HomePage'));
export const AboutPage = lazy(() => import('@pages/About/AboutPage'));
export const ServicesPage = lazy(() => import('@pages/Services/ServicesPage'));
export const ProjectsPage = lazy(() => import('@pages/Projects/ProjectsPage'));
export const GalleryPage = lazy(() => import('@pages/Gallery/GalleryPage'));
export const ClientsPage = lazy(() => import('@pages/Clients/ClientsPage'));
export const ContactPage = lazy(() => import('@pages/Contact/ContactPage'));
export const NotFoundPage = lazy(() => import('@pages/NotFound/NotFoundPage'));

/**
 * Public routes with per-page SEO config.
 * Navbar, Hero, and section components attach in later modules.
 */
export const publicRoutes = [
  {
    path: ROUTE_PATHS.HOME,
    element: HomePage,
    meta: {
      title: SEO_DEFAULT.title,
      description: SEO_DEFAULT.description,
      keywords: SEO_DEFAULT.keywords,
    },
  },
  {
    path: ROUTE_PATHS.ABOUT,
    element: AboutPage,
    meta: {
      title: `About Us | ${SEO_DEFAULT.title.split('|')[0].trim()}`,
      description:
        'Learn about Shukla Industrial Optical Alignment — 18+ years of precision engineering, mission, vision, and growth across India.',
      keywords: 'about shukla industrial, optical alignment company India, paper mill alignment',
    },
  },
  {
    path: ROUTE_PATHS.SERVICES,
    element: ServicesPage,
    meta: {
      title: `Our Services | ${SEO_DEFAULT.title.split('|')[0].trim()}`,
      description:
        'Industrial Optical Alignment, Theodolite Alignment, Machine Alignment, Shaft Alignment, and Paper Mill Alignment Projects.',
      keywords: 'industrial optical alignment services, theodolite alignment, machine alignment, shaft alignment',
    },
  },
  {
    path: ROUTE_PATHS.PROJECTS,
    element: ProjectsPage,
    meta: {
      title: `Projects | ${SEO_DEFAULT.title.split('|')[0].trim()}`,
      description:
        'Explore 500+ completed industrial alignment and paper mill projects across India.',
      keywords: 'industrial projects India, paper mill alignment projects',
    },
  },
  {
    path: ROUTE_PATHS.GALLERY,
    element: GalleryPage,
    meta: {
      title: `Gallery | ${SEO_DEFAULT.title.split('|')[0].trim()}`,
      description:
        'Photo gallery of industrial optical alignment, theodolite surveying, and precision measurement work.',
      keywords: 'industrial alignment gallery, paper mill photos',
    },
  },
  {
    path: ROUTE_PATHS.CLIENTS,
    element: ClientsPage,
    meta: {
      title: `Our Clients | ${SEO_DEFAULT.title.split('|')[0].trim()}`,
      description:
        'Trusted by JK Paper, Century Paper, ITC Tribeni, Orient Paper, and 100+ leading industries across India.',
      keywords: 'paper mill clients India, industrial alignment clients',
    },
  },
  {
    path: ROUTE_PATHS.CONTACT,
    element: ContactPage,
    meta: {
      title: `Contact Us | ${SEO_DEFAULT.title.split('|')[0].trim()}`,
      description:
        'Contact Shukla Industrial for optical alignment services. Call +91 9510900608 or email sioaw98@yahoo.com.',
      keywords: 'contact shukla industrial, optical alignment inquiry',
    },
  },
];

export default publicRoutes;
