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

export default formatApiError;
