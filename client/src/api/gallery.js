/**
 * Gallery API service with seed fallback.
 * Location: client/src/api/gallery.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';
import { GALLERY_SEED } from '@components/Gallery/galleryData';
import { normalizeGalleryList } from '@utils/gallery';

export const fetchGallery = async () => {
  try {
    const { data } = await apiClient.get(ENDPOINTS.GALLERY);
    if (Array.isArray(data) && data.length > 0) return normalizeGalleryList(data);
    if (Array.isArray(data?.items) && data.items.length > 0) return normalizeGalleryList(data.items);
    return normalizeGalleryList(GALLERY_SEED);
  } catch {
    return normalizeGalleryList(GALLERY_SEED);
  }
};

export const fetchGalleryById = async (id) => {
  try {
    const { data } = await apiClient.get(ENDPOINTS.GALLERY_BY_ID(id));
    return normalizeGalleryList([data])[0] || null;
  } catch {
    const found = GALLERY_SEED.find((g) => g.id === Number(id));
    return found ? normalizeGalleryList([found])[0] : null;
  }
};
