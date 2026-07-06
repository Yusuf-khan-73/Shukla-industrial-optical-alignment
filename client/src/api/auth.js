/**
 * Admin authentication API.
 * Location: client/src/api/auth.js
 */
import apiClient from './axios';
import { ENDPOINTS } from './endpoints';

const TOKEN_KEY = 'sioa_access_token';
const USER_KEY = 'sioa_admin_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const loginAdmin = async (email, password) => {
  const { data } = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
  const token = data.access_token;

  const prev = apiClient.defaults.headers.common.Authorization;
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

  try {
    const { data: user } = await apiClient.get(ENDPOINTS.ME);
    setAuthSession(token, user);
    return { token, user };
  } finally {
    if (!prev) delete apiClient.defaults.headers.common.Authorization;
    else apiClient.defaults.headers.common.Authorization = prev;
  }
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get(ENDPOINTS.ME);
  setAuthSession(getStoredToken(), data);
  return data;
};

export const logoutAdmin = () => {
  clearAuthSession();
};
