/**
 * Admin contact messages inbox.
 * Location: client/src/admin/pages/ContactAdminPage.jsx
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import { adminContact } from '@api/admin';

const ContactAdminPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUnread, setFilterUnread] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminContact.list(filterUnread);
      setItems(data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [filterUnread]);

  useEffect(() => { load(); }, [load]);

  const toggleRead = async (row) => {
    try {
      await adminContact.markRead(row.id, !row.is_read);
      await load();
      if (selected?.id === row.id) {
        setSelected((s) => ({ ...s, is_read: !row.is_read }));
      }
    } catch {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminContact.remove(id);
      toast.success('Message deleted');
      setSelected(null);
      await load();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'service_required', label: 'Service', render: (r) => r.service_required || r.serviceRequired },
    {
      key: 'is_read',
      label: 'Status',
      render: (r) => (
        <span className={`admin-badge ${r.is_read ? 'admin-badge--muted' : 'admin-badge--warning'}`}>
          {r.is_read ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Received',
      render: (r) => new Date(r.created_at || r.createdAt).toLocaleString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="admin-actions">
          <button type="button" className="admin-btn-icon" onClick={() => setSelected(r)} aria-label="View">
            <i className="bi bi-eye" />
          </button>
          <button type="button" className="admin-btn-icon" onClick={() => toggleRead(r)} aria-label="Toggle read">
            <i className={`bi ${r.is_read ? 'bi-envelope' : 'bi-envelope-check'}`} />
          </button>
          <button type="button" className="admin-btn-icon admin-btn-icon--danger" onClick={() => handleDelete(r.id)}>
            <i className="bi bi-trash" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="admin-toolbar">
        <h3 className="m-0">Contact Messages</h3>
        <label className="form-check m-0">
          <input
            type="checkbox"
            className="form-check-input"
            checked={filterUnread}
            onChange={(e) => setFilterUnread(e.target.checked)}
          />
          Show unread only
        </label>
      </div>

      <div className="admin-card">
        <AdminTable columns={columns} rows={items} emptyMessage="No contact messages yet." />
      </div>

      <AdminModal
        title="Message Details"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        footer={selected && (
          <>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSelected(null)}>Close</button>
            <button type="button" className="btn btn-warning" onClick={() => toggleRead(selected)}>
              Mark as {selected.is_read ? 'Unread' : 'Read'}
            </button>
          </>
        )}
      >
        {selected && (
          <dl className="row mb-0">
            <dt className="col-sm-3">Name</dt><dd className="col-sm-9">{selected.name}</dd>
            <dt className="col-sm-3">Phone</dt><dd className="col-sm-9"><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd>
            <dt className="col-sm-3">Email</dt><dd className="col-sm-9"><a href={`mailto:${selected.email}`}>{selected.email}</a></dd>
            <dt className="col-sm-3">Company</dt><dd className="col-sm-9">{selected.company_name || selected.companyName || '—'}</dd>
            <dt className="col-sm-3">City</dt><dd className="col-sm-9">{selected.city}</dd>
            <dt className="col-sm-3">Service</dt><dd className="col-sm-9">{selected.service_required || selected.serviceRequired}</dd>
            <dt className="col-sm-3">Message</dt><dd className="col-sm-9" style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</dd>
          </dl>
        )}
      </AdminModal>
    </div>
  );
};

export default ContactAdminPage;
