/**
 * Bootstrap-style confirmation modal before destructive deletes.
 * Location: client/src/admin/components/AdminConfirmDelete.jsx
 */
import { useEffect } from 'react';

const AdminConfirmDelete = ({ open, onCancel, onConfirm, loading = false }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal fade show d-block admin-confirm-delete"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content admin-confirm-delete__content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" id="confirm-delete-title">Confirm Delete</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onCancel}
              disabled={loading}
            />
          </div>
          <div className="modal-body">
            <p className="mb-0 text-muted">
              Are you sure you want to delete this item?
              <br />
              This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show admin-confirm-delete__backdrop" onClick={onCancel} aria-hidden="true" />
    </div>
  );
};

export default AdminConfirmDelete;
