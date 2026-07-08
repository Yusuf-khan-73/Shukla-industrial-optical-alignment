/**
 * Projects API service with static data fallback.
 * Location: client/src/api/projects.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';
import { PROJECTS_SEED } from '@components/Projects/projectsData';

/** Map seeded local paper-mill images onto API projects by id / slug / order. */
const withLocalImages = (projects) => {
  if (!Array.isArray(projects) || projects.length === 0) return PROJECTS_SEED;

  return projects.map((project, index) => {
    const seed =
      PROJECTS_SEED.find((p) => p.id === project.id || p.slug === project.slug)
      || PROJECTS_SEED[index % PROJECTS_SEED.length];

    if (!seed?.images?.length) return project;

    return {
      ...project,
      images: seed.images.map((img) => ({
        url: img.url,
        image_url: img.url,
        alt: img.alt || project.title,
        alt_text: img.alt || project.title,
      })),
    };
  });
};

/**
 * Fetches projects from API; falls back to seed data when API is unavailable.
 * Always prefers local paper-mill portfolio images for display.
 */
export const fetchProjects = async () => {
  try {
    const { data } = await apiClient.get(ENDPOINTS.PROJECTS);
    if (Array.isArray(data) && data.length > 0) return withLocalImages(data);
    if (Array.isArray(data?.items)) return withLocalImages(data.items);
    return PROJECTS_SEED;
  } catch {
    return PROJECTS_SEED;
  }
};

/**
 * Fetches single project by ID or slug.
 */
export const fetchProjectById = async (id) => {
  try {
    const { data } = await apiClient.get(ENDPOINTS.PROJECT_BY_ID(id));
    return withLocalImages([data])[0];
  } catch {
    return PROJECTS_SEED.find((p) => p.id === Number(id) || p.slug === id) || null;
  }
};
