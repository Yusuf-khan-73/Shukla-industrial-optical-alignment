/**
 * Generic admin CRUD hook.
 * Location: client/src/admin/hooks/useAdminCrud.js
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatApiError } from '@api/errors';

export const useAdminCrud = (api, { entityName = 'Record' } = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.list();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error(`Failed to load ${entityName.toLowerCase()}s`);
    } finally {
      setLoading(false);
    }
  }, [api, entityName]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload) => {
    setSaving(true);
    try {
      await api.create(payload);
      toast.success(`${entityName} created`);
      await load();
      return true;
    } catch (err) {
      toast.error(formatApiError(err, `Failed to create ${entityName.toLowerCase()}`));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, payload) => {
    setSaving(true);
    try {
      await api.update(id, payload);
      toast.success(`${entityName} updated`);
      await load();
      return true;
    } catch (err) {
      toast.error(formatApiError(err, `Failed to update ${entityName.toLowerCase()}`));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.remove(id);
      toast.success(`${entityName} deleted`);
      await load();
      return true;
    } catch {
      toast.error(`Failed to delete ${entityName.toLowerCase()}`);
      return false;
    }
  };

  return { items, loading, saving, load, create, update, remove };
};

export default useAdminCrud;
