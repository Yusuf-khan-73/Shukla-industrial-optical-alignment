/**
 * Hook to load gallery items from API with seed fallback.
 * Location: client/src/hooks/useGallery.js
 */
import { useState, useEffect, useMemo } from 'react';
import { fetchGallery } from '@api/gallery';

export const useGallery = ({ featured = false, limit = null, category = 'all' } = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchGallery();
        if (mounted) setItems(data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...items];
    if (featured) list = list.filter((g) => g.featured);
    if (category && category !== 'all') list = list.filter((g) => g.category === category);
    if (limit) list = list.slice(0, limit);
    return list;
  }, [items, featured, limit, category]);

  return { items: filtered, allItems: items, loading };
};

export default useGallery;
