/**
 * Contact form API service.
 * Location: client/src/api/contact.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';

export const submitContactForm = async (formData) => {
  const { data } = await apiClient.post(ENDPOINTS.CONTACT, formData);
  return data;
};
