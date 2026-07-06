/**
 * Testimonials API service with seed fallback.
 * Location: client/src/api/testimonials.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';
import { TESTIMONIALS_SEED } from '@components/Testimonials/testimonialsData';

export const fetchTestimonials = async () => {
  try {
    const { data } = await apiClient.get(ENDPOINTS.TESTIMONIALS);
    if (Array.isArray(data) && data.length > 0) return data;
    if (Array.isArray(data?.items)) return data.items;
    return TESTIMONIALS_SEED;
  } catch {
    return TESTIMONIALS_SEED;
  }
};
