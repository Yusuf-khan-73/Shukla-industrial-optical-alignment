/**
 * Projects API service with static data fallback.
 * Location: client/src/api/projects.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';
import { PROJECTS_SEED } from '@components/Projects/projectsData';

/**
 * Fetches projects from API; falls back to seed data when API is unavailable.
 */
export const fetchProjects = async () => {
  try {
    const { data } = await apiClient.get(ENDPOINTS.PROJECTS);
    if (Array.isArray(data) && data.length > 0) return data;
    if (Array.isArray(data?.items)) return data.items;
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
    return data;
  } catch {
    return PROJECTS_SEED.find((p) => p.id === Number(id) || p.slug === id) || null;
  }
};
