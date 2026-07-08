/**
 * Format FastAPI error responses for toast messages.
 * Location: client/src/api/errors.js
 */
export const formatApiError = (error, fallback = 'Request failed') => {
  const detail = error?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(', ');
  }
  return fallback;
};

export const formatPasswordResetError = (error, fallback = 'Request failed') => {
  if (!error?.response) {
    return 'Cannot connect to server. Please ensure the backend API is running.';
  }

  const status = error.response.status;
  const detail = error.response.data?.detail;

  if (status === 404) return 'Email not found.';
  if (status === 400) {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || d.message).join(' ');
    }
    return 'Invalid or expired reset token.';
  }
  if (status === 503) return 'Unable to send reset email. Please try again later.';
  if (status === 422) {
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || d.message).join(' ');
    }
    return 'Please check your password meets all requirements.';
  }

  return formatApiError(error, fallback);
};

export default formatApiError;
