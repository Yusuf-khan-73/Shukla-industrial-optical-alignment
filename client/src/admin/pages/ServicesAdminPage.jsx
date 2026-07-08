/**
 * Admin services CRUD page.
 * Location: client/src/admin/pages/ServicesAdminPage.jsx
 */
import { useState } from 'react';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import useAdminTable from '../hooks/useAdminTable';
import { buildTableProps } from '../helpers/tableProps';
import ImageUrlField from '../components/ImageUrlField';
import useAdminCrud from '../hooks/useAdminCrud';
import { adminServices } from '@api/admin';
import AdminConfirmDelete from '../components/AdminConfirmDelete';

const emptyForm = () => ({
  title: '', slug: '', short_description: '', description: '', icon: 'bi-gear',
  image_url: '', is_active: true, sort_order: 0,
});

const ServicesAdminPage = () => {
  const { items, loading, saving, create, update, requestRemove, deleteConfirm } = useAdminCrud(adminServices, { entityName: 'Service' });
  const table = useAdminTable(items, {
    searchKeys: ['title', 'slug', 'short_description', 'shortDescription'],
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
      title: row.title || '', slug: row.slug || '',
      short_description: row.short_description || row.shortDescription || '',
      description: row.description || '', icon: row.icon || 'bi-gear',
      image_url: row.image_url || row.imageUrl || '',
      is_active: row.is_active ?? row.isActive ?? true,
      sort_order: row.sort_order ?? row.sortOrder ?? 0,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
      benefits: editing?.benefits || [],
      faqs: editing?.faqs || [],
    };
    const ok = editing ? await update(editing.id, payload) : await create(payload);
    if (ok) setOpen(false);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'icon', label: 'Icon' },
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
        <h3 className="m-0">Services</h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}><i className="bi bi-plus-lg" /> Add Service</button>
      </div>
      <div className="admin-card">
        <AdminTable
          columns={columns}
          rows={items}
          {...buildTableProps(table, {
            searchPlaceholder: 'Search services…',
            sortOptions: [
              { key: 'sort_order', dir: 'asc', label: 'Sort order' },
              { key: 'title', dir: 'asc', label: 'Title A–Z' },
              { key: 'id', dir: 'desc', label: 'Newest first' },
            ],
          })}
        />
      </div>
      <AdminModal title={editing ? 'Edit Service' : 'Add Service'} open={open} onClose={() => setOpen(false)} footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </>
      )}>
        <div className="admin-form-grid">
          <div><label className="form-label">Title</label><input className="form-control" value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
          <div><label className="form-label">Slug</label><input className="form-control" value={form.slug} onChange={(e) => set('slug', e.target.value)} /></div>
          <div><label className="form-label">Icon (Bootstrap class)</label><input className="form-control" value={form.icon} onChange={(e) => set('icon', e.target.value)} /></div>
          <div><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></div>
          <div className="full-width"><label className="form-label">Short Description</label><textarea className="form-control" rows={2} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} /></div>
          <div className="full-width"><label className="form-label">Description</label><textarea className="form-control" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <ImageUrlField label="Service Image" value={form.image_url} onChange={(v) => set('image_url', v)} showAlt={false} />
          <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
        </div>
      </AdminModal>
      <AdminConfirmDelete {...deleteConfirm} />
    </div>
  );
};

export default ServicesAdminPage;
