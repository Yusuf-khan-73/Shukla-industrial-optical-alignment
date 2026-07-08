/**
 * Admin route configuration.
 * Location: client/src/admin/adminRoutes.js
 */
import { lazy } from 'react';

export const AdminLoginPage = lazy(() => import('./pages/LoginPage'));
export const AdminForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
export const AdminResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
export const AdminDashboardPage = lazy(() => import('./pages/DashboardPage'));
export const ProjectsAdminPage = lazy(() => import('./pages/ProjectsAdminPage'));
export const GalleryAdminPage = lazy(() => import('./pages/GalleryAdminPage'));
export const ClientsAdminPage = lazy(() => import('./pages/ClientsAdminPage'));
export const ServicesAdminPage = lazy(() => import('./pages/ServicesAdminPage'));
export const TestimonialsAdminPage = lazy(() => import('./pages/TestimonialsAdminPage'));
export const ContactAdminPage = lazy(() => import('./pages/ContactAdminPage'));
export const HeroSlidesAdminPage = lazy(() => import('./pages/HeroSlidesAdminPage'));
export const SettingsAdminPage = lazy(() => import('./pages/SettingsAdminPage'));
export const ProfileAdminPage = lazy(() => import('./pages/ProfileAdminPage'));

export const ADMIN_PATHS = {
  LOGIN: '/admin/login',
  FORGOT_PASSWORD: '/admin/forgot-password',
  RESET_PASSWORD: '/admin/reset-password',
  ROOT: '/admin',
  PROJECTS: '/admin/projects',
  GALLERY: '/admin/gallery',
  CLIENTS: '/admin/clients',
  SERVICES: '/admin/services',
  TESTIMONIALS: '/admin/testimonials',
  CONTACT: '/admin/contact',
  HERO: '/admin/hero-slides',
  SETTINGS: '/admin/settings',
  PROFILE: '/admin/profile',
};

export const adminChildRoutes = [
  { path: '', element: AdminDashboardPage },
  { path: 'projects', element: ProjectsAdminPage },
  { path: 'gallery', element: GalleryAdminPage },
  { path: 'clients', element: ClientsAdminPage },
  { path: 'services', element: ServicesAdminPage },
  { path: 'testimonials', element: TestimonialsAdminPage },
  { path: 'contact', element: ContactAdminPage },
  { path: 'hero-slides', element: HeroSlidesAdminPage },
  { path: 'settings', element: SettingsAdminPage },
  { path: 'profile', element: ProfileAdminPage },
];
