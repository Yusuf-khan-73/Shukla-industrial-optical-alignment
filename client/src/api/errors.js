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

/**
 * Known non-structured backend error strings (plain HTTPException details)
 * mapped to the form field they relate to.
 */
const KNOWN_DETAIL_FIELD_PATTERNS = [
  { pattern: /current password is incorrect/i, field: 'current_password' },
];

const humanizeFieldMessage = (rawMessage) => {
  if (typeof rawMessage !== 'string' || !rawMessage.trim()) return 'Invalid value.';
  const message = rawMessage.replace(/^Value error,\s*/i, '').trim();
  if (/valid email address/i.test(message)) {
    return 'Please enter a valid email address.';
  }
  return message;
};

/**
 * Extract a { fieldName: message } map from a FastAPI error response so it
 * can be applied under the matching input (react-hook-form setError, etc).
 * Never throws and never returns raw objects/JSON — only readable strings.
 * Returns an empty object when the error can't be mapped to a known field.
 */
export const getServerFieldErrors = (error) => {
  const detail = error?.response?.data?.detail;
  const fieldErrors = {};

  if (Array.isArray(detail)) {
    // FastAPI / Pydantic 422 validation errors: [{ loc: ['body', 'field'], msg, type }]
    detail.forEach((item) => {
      const loc = item?.loc;
      const field = Array.isArray(loc) && loc.length > 0 ? loc[loc.length - 1] : null;
      const message = item?.msg || item?.message;
      if (typeof field === 'string' && typeof message === 'string') {
        fieldErrors[field] = humanizeFieldMessage(message);
      }
    });
    return fieldErrors;
  }

  if (typeof detail === 'string') {
    const match = KNOWN_DETAIL_FIELD_PATTERNS.find(({ pattern }) => pattern.test(detail));
    if (match) {
      fieldErrors[match.field] = detail;
    }
  }

  return fieldErrors;
};

export default formatApiError;