/**
 * Shukla Industrial — API Endpoints (relative to VITE_API_BASE_URL /api/v1)
 * Location: client/src/api/endpoints.js
 */

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',

  // Public
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  GALLERY: '/gallery',
  GALLERY_BY_ID: (id) => `/gallery/${id}`,
  CLIENTS: '/clients',
  SERVICES: '/services',
  SERVICE_BY_SLUG: (slug) => `/services/${slug}`,
  TESTIMONIALS: '/testimonials',
  CONTACT: '/contact',
  HERO_SLIDES: '/hero-slides',
  COMPANY_INFO: '/company-info',
  SITE_SETTINGS: '/site-settings',

  // Admin CRUD (protected)
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_CONTACT: '/admin/contact-messages',
  ADMIN_HERO: '/admin/hero-slides',
  ADMIN_SETTINGS: '/admin/site-settings',
  ADMIN_COMPANY: '/admin/company-info',
  ADMIN_UPLOADS: '/admin/uploads',
};

export default ENDPOINTS;
