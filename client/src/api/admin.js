/**
 * Admin CRUD API services.
 * Location: client/src/api/admin.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';

const crud = (base, byId) => ({
  list: () => apiClient.get(base).then((r) => r.data),
  create: (payload) => apiClient.post(base, payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(byId(id), payload).then((r) => r.data),
  remove: (id) => apiClient.delete(byId(id)),
});

export const adminProjects = {
  ...crud(ENDPOINTS.ADMIN_PROJECTS, (id) => `${ENDPOINTS.ADMIN_PROJECTS}/${id}`),
};

export const adminGallery = {
  ...crud(ENDPOINTS.ADMIN_GALLERY, (id) => `${ENDPOINTS.ADMIN_GALLERY}/${id}`),
};

export const adminClients = {
  ...crud(ENDPOINTS.ADMIN_CLIENTS, (id) => `${ENDPOINTS.ADMIN_CLIENTS}/${id}`),
};

export const adminServices = {
  ...crud(ENDPOINTS.ADMIN_SERVICES, (id) => `${ENDPOINTS.ADMIN_SERVICES}/${id}`),
};

export const adminTestimonials = {
  ...crud(ENDPOINTS.ADMIN_TESTIMONIALS, (id) => `${ENDPOINTS.ADMIN_TESTIMONIALS}/${id}`),
};

export const adminHeroSlides = {
  ...crud(ENDPOINTS.ADMIN_HERO, (id) => `${ENDPOINTS.ADMIN_HERO}/${id}`),
};

export const adminContact = {
  list: (unreadOnly = false) =>
    apiClient
      .get(ENDPOINTS.ADMIN_CONTACT, { params: { unread_only: unreadOnly } })
      .then((r) => r.data),
  markRead: (id, isRead) =>
    apiClient.patch(`${ENDPOINTS.ADMIN_CONTACT}/${id}`, { is_read: isRead }).then((r) => r.data),
  remove: (id) => apiClient.delete(`${ENDPOINTS.ADMIN_CONTACT}/${id}`),
};

export const adminSettings = {
  get: () => apiClient.get(ENDPOINTS.SITE_SETTINGS).then((r) => r.data),
  update: (payload) => apiClient.put(ENDPOINTS.ADMIN_SETTINGS, payload).then((r) => r.data),
};

export const adminCompany = {
  get: () => apiClient.get(ENDPOINTS.ADMIN_COMPANY).then((r) => r.data),
  update: (payload) => apiClient.put(ENDPOINTS.ADMIN_COMPANY, payload).then((r) => r.data),
};

export const uploadAdminImage = async (file, folder = 'gallery') => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.post(ENDPOINTS.ADMIN_UPLOADS, form, {
    params: { folder },
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // Store relative path in DB; resolve full URL at display time.
  if (data.url?.startsWith('http')) {
    try {
      const parsed = new URL(data.url);
      return parsed.pathname;
    } catch {
      return data.url;
    }
  }
  return data.url;
};

export const adminDashboardStats = async () => {
  const [projects, gallery, clients, services, testimonials, messages, hero] = await Promise.all([
    adminProjects.list(),
    adminGallery.list(),
    adminClients.list(),
    adminServices.list(),
    adminTestimonials.list(),
    adminContact.list(),
    adminHeroSlides.list(),
  ]);

  const unread = messages.filter((m) => !m.is_read).length;

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
