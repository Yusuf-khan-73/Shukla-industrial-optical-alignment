/**
 * Per-route SEO meta tag management.
 * Location: client/src/hooks/usePageMeta.js
 */
import { useEffect } from 'react';
import { SEO_DEFAULT } from '@utils/constants';

/**
 * Updates document title and meta tags when route changes.
 * @param {{ title?: string, description?: string, keywords?: string }} meta
 */
export const usePageMeta = ({ title, description, keywords } = {}) => {
  useEffect(() => {
    const pageTitle = title || SEO_DEFAULT.title;
    const pageDescription = description || SEO_DEFAULT.description;
    const pageKeywords = keywords || SEO_DEFAULT.keywords;

    document.title = pageTitle;

    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', pageDescription);
    setMeta('keywords', pageKeywords);
    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDescription, 'property');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDescription);
  }, [title, description, keywords]);
};

export default usePageMeta;
