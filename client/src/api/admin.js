/**
 * Admin CRUD API services.
 * Location: client/src/api/admin.js
 */

import apiClient from './axios';
import { ENDPOINTS } from './endpoints';

const crud = (base, byId) => ({
  list: () => apiClient.get(base).then((response) => response.data),

  create: (payload) =>
    apiClient.post(base, payload).then((response) => response.data),

  update: (id, payload) =>
    apiClient.put(byId(id), payload).then((response) => response.data),

  remove: (id) =>
    apiClient
      .delete(byId(id))
      .then((response) => response.data ?? { success: true }),
});

export const adminProjects = {
  ...crud(
    ENDPOINTS.ADMIN_PROJECTS,
    (id) => `${ENDPOINTS.ADMIN_PROJECTS}/${id}`
  ),
};

export const adminGallery = {
  ...crud(
    ENDPOINTS.ADMIN_GALLERY,
    (id) => `${ENDPOINTS.ADMIN_GALLERY}/${id}`
  ),
};

export const adminClients = {
  ...crud(
    ENDPOINTS.ADMIN_CLIENTS,
    (id) => `${ENDPOINTS.ADMIN_CLIENTS}/${id}`
  ),
};

export const adminServices = {
  ...crud(
    ENDPOINTS.ADMIN_SERVICES,
    (id) => `${ENDPOINTS.ADMIN_SERVICES}/${id}`
  ),
};

export const adminTestimonials = {
  ...crud(
    ENDPOINTS.ADMIN_TESTIMONIALS,
    (id) => `${ENDPOINTS.ADMIN_TESTIMONIALS}/${id}`
  ),
};

export const adminHeroSlides = {
  ...crud(
    ENDPOINTS.ADMIN_HERO,
    (id) => `${ENDPOINTS.ADMIN_HERO}/${id}`
  ),
};

export const adminContact = {
  list: (unreadOnly = false) =>
    apiClient
      .get(ENDPOINTS.ADMIN_CONTACT, {
        params: {
          unread_only: unreadOnly,
        },
      })
      .then((response) => response.data),

  markRead: (id, isRead) =>
    apiClient
      .patch(`${ENDPOINTS.ADMIN_CONTACT}/${id}`, {
        is_read: isRead,
      })
      .then((response) => response.data),

  remove: (id) =>
    apiClient
      .delete(`${ENDPOINTS.ADMIN_CONTACT}/${id}`)
      .then((response) => response.data ?? { success: true }),
};

export const adminSettings = {
  get: () =>
    apiClient
      .get(ENDPOINTS.SITE_SETTINGS)
      .then((response) => response.data),

  update: (payload) =>
    apiClient
      .put(ENDPOINTS.ADMIN_SETTINGS, payload)
      .then((response) => response.data),
};

export const adminCompany = {
  get: () =>
    apiClient
      .get(ENDPOINTS.ADMIN_COMPANY)
      .then((response) => response.data),

  update: (payload) =>
    apiClient
      .put(ENDPOINTS.ADMIN_COMPANY, payload)
      .then((response) => response.data),
};

/**
 * Upload image and return the URL exactly as received from backend.
 *
 * Production:
 * https://project.supabase.co/storage/v1/object/public/...
 *
 * Local:
 * /uploads/gallery/filename.jpeg
 */
export const uploadAdminImage = async (file, folder = 'gallery') => {
  if (!file) {
    throw new Error('Please select an image file');
  }

  const form = new FormData();
  form.append('file', file);

  const { data } = await apiClient.post(
    ENDPOINTS.ADMIN_UPLOADS,
    form,
    {
      params: {
        folder,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    }
  );

  const uploadedUrl = data?.url?.trim();

  if (!uploadedUrl) {
    throw new Error(
      'Image upload succeeded, but the backend did not return an image URL'
    );
  }

  // Full Supabase URL ya local relative path ko unchanged return karo.
  return uploadedUrl;
};

export const adminDashboardStats = async () => {
  const [
    projects,
    gallery,
    clients,
    services,
    testimonials,
    messages,
    hero,
  ] = await Promise.all([
    adminProjects.list(),
    adminGallery.list(),
    adminClients.list(),
    adminServices.list(),
    adminTestimonials.list(),
    adminContact.list(),
    adminHeroSlides.list(),
  ]);

  const unread = messages.filter((message) => !message.is_read).length;

  return {
    projects: projects.length,
    gallery: gallery.length,
    clients: clients.length,
    services: services.length,
    testimonials: testimonials.length,
    messages: messages.length,
    unreadMessages: unread,
    heroSlides: hero.length,
  };
};