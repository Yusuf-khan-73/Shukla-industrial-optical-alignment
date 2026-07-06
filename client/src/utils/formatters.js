/**
 * Shukla Industrial — Formatters
 * Location: client/src/utils/formatters.js
 */

/**
 * Formats a date string to readable format.
 */
export const formatDate = (dateString, locale = 'en-IN') => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a number with Indian locale grouping.
 */
export const formatNumber = (num) => {
  if (num == null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Truncates text with ellipsis.
 */
export const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
};

/**
 * Converts slug to title case.
 */
export const slugToTitle = (slug) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/**
 * Converts title to URL slug.
 */
export const titleToSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
