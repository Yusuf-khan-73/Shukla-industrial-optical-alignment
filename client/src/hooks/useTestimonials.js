/**
 * Hook to load testimonials from API with seed fallback.
 * Location: client/src/hooks/useTestimonials.js
 */
import { useState, useEffect, useMemo } from 'react';
import { fetchTestimonials } from '@api/testimonials';

export const useTestimonials = ({ featured = false, limit = null } = {}) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchTestimonials();
        if (mounted) setTestimonials(data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...testimonials];
    if (featured) list = list.filter((t) => t.featured);
    if (limit) list = list.slice(0, limit);
    return list;
  }, [testimonials, featured, limit]);

  return { testimonials: filtered, loading };
};

export default useTestimonials;
