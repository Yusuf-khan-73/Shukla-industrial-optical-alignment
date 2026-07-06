/**
 * Shukla Industrial — Helper Utilities
 * Location: client/src/utils/helpers.js
 */

/**
 * Combines class names, filtering falsy values.
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Formats a phone number for tel: links (strips spaces and +).
 */
export const formatPhoneForTel = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits}`;
};

/**
 * Builds a WhatsApp URL with optional pre-filled message.
 */
export const buildWhatsAppUrl = (phone = '919510900608', message = '') => {
  const base = `https://wa.me/${phone.replace(/\D/g, '')}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};

/**
 * Scrolls to an element by ID with navbar offset.
 */
export const scrollToElement = (elementId, offset = 100) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

/**
 * Debounce function for resize/scroll handlers.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function for scroll handlers.
 */
export const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

/**
 * Checks if code is running in browser (SSR-safe).
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Lazy-load image src with placeholder.
 */
export const getImagePlaceholder = (width = 400, height = 300) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23f7f8fa' width='100%25' height='100%25'/%3E%3C/svg%3E`;
