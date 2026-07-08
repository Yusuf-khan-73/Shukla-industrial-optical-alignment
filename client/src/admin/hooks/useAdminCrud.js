/**
 * Generic admin CRUD hook with delete confirmation and live state updates.
 * Location: client/src/admin/hooks/useAdminCrud.js
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatApiError } from '@api/errors';
import { TOAST_DURATION_MS } from '@utils/toastConfig';

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
      toast.error(`Failed to load ${entityName.toLowerCase()}s`, { autoClose: TOAST_DURATION_MS });
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
      const created = await api.create(payload);
      toast.success(`${entityName} created`, { autoClose: TOAST_DURATION_MS });
      if (created?.id) {
        setItems((prev) => [created, ...prev]);
      }
      await load();
      return true;
    } catch (err) {
      toast.error(formatApiError(err, `Failed to create ${entityName.toLowerCase()}`), {
        autoClose: TOAST_DURATION_MS,
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, payload) => {
    setSaving(true);
    try {
      const updated = await api.update(id, payload);
      toast.success(`${entityName} updated`, { autoClose: TOAST_DURATION_MS });
      if (updated?.id) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      }
      await load();
      return true;
    } catch (err) {
      toast.error(formatApiError(err, `Failed to update ${entityName.toLowerCase()}`), {
        autoClose: TOAST_DURATION_MS,
      });
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
      await api.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success(`${entityName} deleted`, { autoClose: TOAST_DURATION_MS });
      setPendingDeleteId(null);
      return true;
    } catch (err) {
      toast.error(formatApiError(err, `Failed to delete ${entityName.toLowerCase()}`), {
        autoClose: TOAST_DURATION_MS,
      });
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
