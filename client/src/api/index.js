/**
 * Shukla Industrial — API Module Index
 * Location: client/src/api/index.js
 */
export { default as apiClient } from './axios';
export { ENDPOINTS } from './endpoints';
export { loginAdmin, logoutAdmin, fetchCurrentUser, getStoredToken } from './auth';
export {
  adminProjects,
  adminGallery,
  adminClients,
  adminServices,
  adminTestimonials,
  adminHeroSlides,
  adminContact,
  adminSettings,
  adminCompany,
  uploadAdminImage,
  adminDashboardStats,
} from './admin';
export { fetchProjects, fetchProjectById } from './projects';
export { fetchGallery, fetchGalleryById } from './gallery';
export { fetchTestimonials } from './testimonials';
export { submitContactForm } from './contact';
