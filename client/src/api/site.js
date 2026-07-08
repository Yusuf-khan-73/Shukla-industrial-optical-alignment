/**
 * Public site data — company info and site settings.
 * Location: client/src/api/site.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';

export const fetchCompanyInfo = async () => {
  const { data } = await apiClient.get(ENDPOINTS.COMPANY_INFO);
  return data;
};

export const fetchSiteSettings = async () => {
  const { data } = await apiClient.get(ENDPOINTS.SITE_SETTINGS);
  return data;
};

export const fetchSiteBootstrap = async () => {
  const [company, settings] = await Promise.all([
    fetchCompanyInfo().catch(() => null),
    fetchSiteSettings().catch(() => null),
  ]);
  return { company, settings };
};
