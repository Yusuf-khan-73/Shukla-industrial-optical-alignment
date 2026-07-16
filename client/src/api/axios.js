/**
 * Shukla Industrial — Axios HTTP Client
 * Location: client/src/api/axios.js
 */

import axios from 'axios';

/**
 * Resolve API base URL.
 *
 * Production:
 * VITE_API_ORIGIN + VITE_API_BASE_URL use karega.
 *
 * Example:
 * https://shukla-industrial-backend-navy.vercel.app + /api/v1
 *
 * Result:
 * https://shukla-industrial-backend-navy.vercel.app/api/v1
 */
const resolveApiBaseUrl = () => {
  const origin = import.meta.env.VITE_API_ORIGIN?.trim();
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api/v1';

  if (origin) {
    return `${origin.replace(/\/$/, '')}${baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`}`;
  }

  return baseUrl;
};

const API_BASE_URL = resolveApiBaseUrl();

/**
 * Configured Axios instance with interceptors for auth and error handling.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// Request interceptor — attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sioa_access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor — handle common errors
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    const isAuthPublicRequest =
      /\/auth\/(login|forgot-password|reset-password|verify-reset-token)/.test(
        requestUrl
      );

    const onAuthPage =
      /^\/(admin\/(login|forgot-password|reset-password)|reset-password)/.test(
        window.location.pathname
      );


    if (status === 401 && !isAuthPublicRequest) {
      localStorage.removeItem('sioa_access_token');
      localStorage.removeItem('sioa_admin_user');

      if (
        window.location.pathname.startsWith('/admin') &&
        !onAuthPage
      ) {
        window.location.href = '/admin/login';
      }
    }


    return Promise.reject(error);
  }
);


export { API_BASE_URL };
export default apiClient;