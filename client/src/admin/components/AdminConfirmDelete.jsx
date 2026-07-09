/**
 * Bootstrap-style confirmation modal before destructive deletes.
 * Location: client/src/admin/components/AdminConfirmDelete.jsx
 */
import { useEffect } from 'react';

const AdminConfirmDelete = ({
  open,
  onCancel,
  onConfirm,
  loading = false,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
}) => {
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onCancel, loading]);

  if (!open) return null;

  const handleConfirm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!loading) onConfirm();
  };

  const handleCancel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!loading) onCancel();
  };

  return (
    <div className="admin-confirm-delete" role="presentation">
      <div
        className="admin-confirm-delete__backdrop"
        onClick={handleCancel}
        aria-hidden="true"
      />
      <div
        className="modal fade show d-block admin-confirm-delete__dialog-wrap"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        onClick={handleCancel}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal-content admin-confirm-delete__content">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title" id="confirm-delete-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCancel}
                disabled={loading}
              />
            </div>
            <div className="modal-body">
              <p className="mb-0 text-muted">{message}</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Deleting…
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmDelete;
