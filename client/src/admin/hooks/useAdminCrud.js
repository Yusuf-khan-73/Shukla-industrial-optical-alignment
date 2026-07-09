/**
 * Generic admin CRUD hook with delete confirmation and live state updates.
 * Location: client/src/admin/hooks/useAdminCrud.js
 */
import { useCallback, useEffect, useState } from 'react';
import { formatApiError } from '@api/errors';
import notify from '@utils/notify';

export const useAdminCrud = (api, { entityName = 'Record' } = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.list();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      notify.error(`Failed to load ${entityName.toLowerCase()}s`);
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
      const created = await notify.run(
        `Saving ${entityName.toLowerCase()}...`,
        () => api.create(payload),
        {
          success: `${entityName} added successfully`,
          error: (err) => formatApiError(err, `Failed to create ${entityName.toLowerCase()}`),
        }
      );
      if (created?.id) {
        setItems((prev) => [created, ...prev]);
      }
      await load();
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, payload) => {
    setSaving(true);
    try {
      const updated = await notify.run(
        `Updating ${entityName.toLowerCase()}...`,
        () => api.update(id, payload),
        {
          success: `${entityName} updated successfully`,
          error: (err) => formatApiError(err, `Failed to update ${entityName.toLowerCase()}`),
        }
      );
      if (updated?.id) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      }
      await load();
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const requestRemove = (id) => setPendingDeleteId(id);

  const cancelRemove = () => {
    if (!deleting) setPendingDeleteId(null);
  };

  const confirmRemove = async () => {
    if (pendingDeleteId == null) return false;
    const id = pendingDeleteId;
    setDeleting(true);
    try {
      await notify.run(
        `Deleting ${entityName.toLowerCase()}...`,
        () => api.remove(id),
        {
          success: `${entityName} deleted successfully`,
          error: (err) => formatApiError(err, `Failed to delete ${entityName.toLowerCase()}`),
        }
      );
      setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      setPendingDeleteId(null);
      return true;
    } catch {
      await load();
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const deleteConfirm = {
    open: pendingDeleteId != null,
    loading: deleting,
    onCancel: cancelRemove,
    onConfirm: confirmRemove,
  };

  return {
    items,
    loading,
    saving,
    load,
    create,
    update,
    requestRemove,
    confirmRemove,
    cancelRemove,
    deleteConfirm,
  };
};

export default useAdminCrud;
