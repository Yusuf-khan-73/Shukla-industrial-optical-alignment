/**
 * Resolve relative upload paths and apply cache-busting for updated media.
 * Location: client/src/utils/resolveImageUrl.js
 */

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN
  || (typeof window !== 'undefined' ? window.location.origin : '');

/**
 * @param {string|null|undefined} url
 * @param {string|number|null|undefined} version - e.g. updated_at timestamp or record id
 */
export const resolveImageUrl = (url, version = null) => {
  if (!url || typeof url !== 'string') return null;

  let resolved = url.trim();
  if (!resolved) return null;

  if (resolved.startsWith('/uploads/')) {
    const origin = API_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '');
    resolved = `${origin}${resolved}`;
  }

  if (version != null && version !== '') {
    const [base] = resolved.split('?');
    resolved = `${base}?v=${encodeURIComponent(version)}`;
  }

  return resolved;
};

export default resolveImageUrl;
