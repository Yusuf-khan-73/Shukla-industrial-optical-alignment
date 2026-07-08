/**
 * Admin clients CRUD page.
 * Location: client/src/admin/pages/ClientsAdminPage.jsx
 */
import { useState } from 'react';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import useAdminTable from '../hooks/useAdminTable';
import { buildTableProps } from '../helpers/tableProps';
import useAdminCrud from '../hooks/useAdminCrud';
import { adminClients } from '@api/admin';
import AdminConfirmDelete from '../components/AdminConfirmDelete';

const emptyForm = () => ({
  name: '', initials: '', category: 'paper', category_label: 'Paper Mill',
  logo_url: '', website: '', featured: false, is_active: true, sort_order: 0,
});

const ClientsAdminPage = () => {
  const { items, loading, saving, create, update, requestRemove, deleteConfirm } = useAdminCrud(adminClients, { entityName: 'Client' });
  const table = useAdminTable(items, {
    searchKeys: ['name', 'category', 'category_label', 'categoryLabel'],
    defaultSortKey: 'sort_order',
    defaultSortDir: 'asc',
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '', initials: row.initials || '',
      category: row.category || '', category_label: row.category_label || row.categoryLabel || '',
      logo_url: row.logo_url || row.logoUrl || '', website: row.website || '',
      featured: Boolean(row.featured), is_active: row.is_active ?? row.isActive ?? true,
      sort_order: row.sort_order ?? row.sortOrder ?? 0,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    const ok = editing ? await update(editing.id, payload) : await create(payload);
    if (ok) setOpen(false);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'initials', label: 'Initials' },
    { key: 'category', label: 'Category', render: (r) => r.category_label || r.categoryLabel },
    { key: 'featured', label: 'Featured', render: (r) => (r.featured ? 'Yes' : 'No') },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="admin-actions">
          <button type="button" className="admin-btn-icon" onClick={() => openEdit(r)}><i className="bi bi-pencil" /></button>
          <button type="button" className="admin-btn-icon admin-btn-icon--danger" onClick={() => requestRemove(r.id)}><i className="bi bi-trash" /></button>
        </div>
      ),
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="admin-toolbar">
        <h3 className="m-0">Clients</h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}><i className="bi bi-plus-lg" /> Add Client</button>
      </div>
      <div className="admin-card">
        <AdminTable
          columns={columns}
          rows={items}
          {...buildTableProps(table, { searchPlaceholder: 'Search clients…' })}
        />
      </div>
      <AdminModal title={editing ? 'Edit Client' : 'Add Client'} open={open} onClose={() => setOpen(false)} footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </>
      )}>
        <div className="admin-form-grid">
          <div><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div><label className="form-label">Initials</label><input className="form-control" value={form.initials} onChange={(e) => set('initials', e.target.value)} /></div>
          <div><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={(e) => set('category', e.target.value)} /></div>
          <div><label className="form-label">Category Label</label><input className="form-control" value={form.category_label} onChange={(e) => set('category_label', e.target.value)} /></div>
          <div><label className="form-label">Logo URL</label><input className="form-control" value={form.logo_url} onChange={(e) => set('logo_url', e.target.value)} /></div>
          <div><label className="form-label">Website</label><input className="form-control" value={form.website} onChange={(e) => set('website', e.target.value)} /></div>
          <div><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></div>
          <div className="d-flex gap-4">
            <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
            <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
          </div>
        </div>
      </AdminModal>
      <AdminConfirmDelete {...deleteConfirm} />
    </div>
  );
};

export default ClientsAdminPage;
