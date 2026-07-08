/**
 * Password strength rules for admin reset flow.
 * Location: client/src/utils/passwordValidation.js
 */

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { id: 'special', label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const isStrongPassword = (value) => PASSWORD_RULES.every((rule) => rule.test(value || ''));

export const getPasswordStrength = (value) => {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(value || '')).length;
  if (!value) return { score: 0, label: '', color: '#e2e8f0' };
  if (passed <= 2) return { score: 25, label: 'Weak', color: '#ef4444' };
  if (passed <= 3) return { score: 50, label: 'Fair', color: '#f59e0b' };
  if (passed <= 4) return { score: 75, label: 'Good', color: '#3b82f6' };
  return { score: 100, label: 'Strong', color: '#22c55e' };
};

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
