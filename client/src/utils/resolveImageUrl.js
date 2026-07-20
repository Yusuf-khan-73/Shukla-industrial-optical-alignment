/**
 * Resolve relative upload paths and apply cache-busting for updated media.
 * Location: client/src/utils/resolveImageUrl.js
 */

function getApiOrigin() {
  const base = import.meta.env.VITE_API_BASE_URL?.trim();
  if (base?.startsWith('http')) {
    try {
      return new URL(base).origin;
    } catch {
      /* fall through */
    }
  }

  const origin = import.meta.env.VITE_API_ORIGIN?.trim();
  if (origin) return origin.replace(/\/$/, '');

  return typeof window !== 'undefined' ? window.location.origin : '';
}

const API_ORIGIN = getApiOrigin();

/**
 * @param {string|null|undefined} url
 * @param {string|number|null|undefined} version - e.g. updated_at timestamp or record id
 */
export const resolveImageUrl = (url, version = null) => {
  if (!url || typeof url !== 'string') return null;

  let resolved = url.trim();
  if (!resolved) return null;

  // Some records are saved without the leading slash (e.g. "uploads/x.jpg"
  // instead of "/uploads/x.jpg") — normalize so the check below still catches
  // it instead of leaving it as an unresolved relative path.
  if (/^uploads\//i.test(resolved)) {
    resolved = `/${resolved}`;
  }

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