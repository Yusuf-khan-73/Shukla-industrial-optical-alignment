/**
 * Admin contact messages inbox.
 * Location: client/src/admin/pages/ContactAdminPage.jsx
 */
import { useCallback, useEffect, useState } from 'react';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import AdminConfirmDelete from '../components/AdminConfirmDelete';
import useAdminTable from '../hooks/useAdminTable';
import { buildTableProps } from '../helpers/tableProps';
import { adminContact } from '@api/admin';
import { formatApiError } from '@api/errors';
import notify from '@utils/notify';

const ContactAdminPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const table = useAdminTable(items, {
    searchKeys: ['name', 'email', 'phone', 'city', 'message', 'service_required', 'serviceRequired'],
    dateKey: 'created_at',
    statusKey: 'is_read',
    defaultSortKey: 'created_at',
    defaultSortDir: 'desc',
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminContact.list(false);
      setItems(data);
    } catch {
      notify.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRead = async (row) => {
    try {
      await notify.run('Updating message...', () => adminContact.markRead(row.id, !row.is_read), {
        success: 'Message updated successfully',
        error: (error) => formatApiError(error, 'Failed to update message'),
      });
      setItems((prev) => prev.map((item) => (
        item.id === row.id ? { ...item, is_read: !row.is_read } : item
      )));
      if (selected?.id === row.id) {
        setSelected((s) => ({ ...s, is_read: !row.is_read }));
      }
    } catch {
      // Error toast handled by notify.run
    }
  };

  const confirmDelete = async () => {
    if (pendingDeleteId == null) return;
    const id = pendingDeleteId;
    setDeleting(true);
    try {
      await notify.run('Deleting message...', () => adminContact.remove(id), {
        success: 'Message deleted successfully',
        error: (error) => formatApiError(error, 'Failed to delete message'),
      });
      setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      if (selected?.id === id) setSelected(null);
      setPendingDeleteId(null);
    } catch {
      await load();
    } finally {
      setDeleting(false);
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
          <button
            type="button"
            className="admin-btn-icon admin-btn-icon--danger"
            onClick={() => setPendingDeleteId(r.id)}
          >
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
      </div>

      <div className="admin-card">
        <AdminTable
          columns={columns}
          rows={items}
          emptyMessage="No contact messages yet."
          {...buildTableProps(table, {
            searchPlaceholder: 'Search messages…',
            statusOptions: [
              { value: 'all', label: 'All messages' },
              { value: 'unread', label: 'Unread' },
              { value: 'read', label: 'Read' },
            ],
            sortOptions: [
              { key: 'created_at', dir: 'desc', label: 'Newest first' },
              { key: 'created_at', dir: 'asc', label: 'Oldest first' },
              { key: 'name', dir: 'asc', label: 'Name A–Z' },
            ],
          })}
        />
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

      <AdminConfirmDelete
        open={pendingDeleteId != null}
        onCancel={() => !deleting && setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
};

export default ContactAdminPage;
