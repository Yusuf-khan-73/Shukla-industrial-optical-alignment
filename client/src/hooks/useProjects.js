/**
 * Hook to load projects from API with seed fallback.
 * Location: client/src/hooks/useProjects.js
 */
import { useState, useEffect, useMemo } from 'react';
import { fetchProjects } from '@api/projects';

export const useProjects = ({ featured = false, limit = null, industry = 'all' } = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        if (mounted) {
          setProjects(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...projects];
    if (featured) list = list.filter((p) => p.featured);
    if (industry && industry !== 'all') list = list.filter((p) => p.industry === industry);
    if (limit) list = list.slice(0, limit);
    return list;
  }, [projects, featured, limit, industry]);

  return { projects: filtered, allProjects: projects, loading, error };
};

export default useProjects;
