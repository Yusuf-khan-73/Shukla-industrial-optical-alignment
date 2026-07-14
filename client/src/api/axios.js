/**
 * Shukla Industrial — Axios HTTP Client
 * Location: client/src/api/axios.js
 */
import axios from 'axios';

/**
 * Resolve API base URL.
 * - Absolute VITE_API_BASE_URL (https://…) wins in all environments.
 * - DEV with relative base uses VITE_API_ORIGIN + /api/v1.
 * - Production without absolute URL falls back to relative /api/v1 (same-host proxy).
 */
const resolveApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configured?.startsWith('http')) {
    return configured.replace(/\/$/, '');
  }

  if (import.meta.env.DEV) {
    const origin = import.meta.env.VITE_API_ORIGIN?.trim() || 'http://localhost:8001';
    return `${origin.replace(/\/$/, '')}/api/v1`;
  }

  return configured || '/api/v1';
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
    const isAuthPublicRequest = /\/auth\/(login|forgot-password|reset-password|verify-reset-token)/.test(requestUrl);
    const onAuthPage = /^\/(admin\/(login|forgot-password|reset-password)|reset-password)/.test(window.location.pathname);

    if (status === 401 && !isAuthPublicRequest) {
      localStorage.removeItem('sioa_access_token');
      localStorage.removeItem('sioa_admin_user');
      if (window.location.pathname.startsWith('/admin') && !onAuthPage) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default apiClient;
