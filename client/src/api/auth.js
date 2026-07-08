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

export const getLoginErrorMessage = (error) => {
  if (!error?.response) {
    return 'Cannot connect to server. Please ensure the backend API is running on port 8000.';
  }

  const status = error.response.status;
  const detail = error.response.data?.detail;

  if (status === 401) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (status === 403) {
    return 'Your account is disabled. Contact the site administrator.';
  }

  if (status === 422) {
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).join(' ');
    }
    return 'Please enter a valid email and password (minimum 6 characters).';
  }

  return 'Login failed. Please try again.';
};

export const loginAdmin = async (email, password) => {
  const { data } = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
  const token = data.access_token;

  localStorage.setItem(TOKEN_KEY, token);

  try {
    const { data: user } = await apiClient.get(ENDPOINTS.ME);
    setAuthSession(token, user);
    return { token, user };
  } catch (error) {
    clearAuthSession();
    throw error;
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

export const requestPasswordReset = async (email) => {
  const { data } = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
  return data;
};

export const verifyResetToken = async (token) => {
  const { data } = await apiClient.get(ENDPOINTS.VERIFY_RESET_TOKEN, { params: { token } });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await apiClient.post(ENDPOINTS.RESET_PASSWORD, { token, password });
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.put(ENDPOINTS.PROFILE, payload);
  setAuthSession(getStoredToken(), data);
  return data;
};

export const changePassword = async (current_password, new_password) => {
  const { data } = await apiClient.put(ENDPOINTS.CHANGE_PASSWORD, {
    current_password,
    new_password,
  });
  return data;
};
