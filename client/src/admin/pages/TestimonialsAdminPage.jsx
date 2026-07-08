/**
 * Admin testimonials CRUD page.
 * Location: client/src/admin/pages/TestimonialsAdminPage.jsx
 */
import { useState } from 'react';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import useAdminTable from '../hooks/useAdminTable';
import { buildTableProps } from '../helpers/tableProps';
import useAdminCrud from '../hooks/useAdminCrud';
import { adminTestimonials } from '@api/admin';
import AdminConfirmDelete from '../components/AdminConfirmDelete';

const emptyForm = () => ({
  name: '', designation: '', company: '', quote: '', rating: 5,
  initials: '', featured: true, is_active: true, sort_order: 0,
});

const TestimonialsAdminPage = () => {
  const { items, loading, saving, create, update, requestRemove, deleteConfirm } = useAdminCrud(adminTestimonials, { entityName: 'Testimonial' });
  const table = useAdminTable(items, {
    searchKeys: ['name', 'company', 'designation', 'quote'],
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
      name: row.name || '', designation: row.designation || '', company: row.company || '',
      quote: row.quote || '', rating: row.rating || 5, initials: row.initials || '',
      featured: Boolean(row.featured), is_active: row.is_active ?? row.isActive ?? true,
      sort_order: row.sort_order ?? row.sortOrder ?? 0,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, rating: Number(form.rating) || 5, sort_order: Number(form.sort_order) || 0 };
    const ok = editing ? await update(editing.id, payload) : await create(payload);
    if (ok) setOpen(false);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'rating', label: 'Rating', render: (r) => `${r.rating}/5` },
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
        <h3 className="m-0">Testimonials</h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}><i className="bi bi-plus-lg" /> Add Testimonial</button>
      </div>
      <div className="admin-card">
        <AdminTable
          columns={columns}
          rows={items}
          {...buildTableProps(table, { searchPlaceholder: 'Search testimonials…' })}
        />
      </div>
      <AdminModal title={editing ? 'Edit Testimonial' : 'Add Testimonial'} open={open} onClose={() => setOpen(false)} footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </>
      )}>
        <div className="admin-form-grid">
          <div><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div><label className="form-label">Initials</label><input className="form-control" value={form.initials} onChange={(e) => set('initials', e.target.value)} /></div>
          <div><label className="form-label">Designation</label><input className="form-control" value={form.designation} onChange={(e) => set('designation', e.target.value)} /></div>
          <div><label className="form-label">Company</label><input className="form-control" value={form.company} onChange={(e) => set('company', e.target.value)} /></div>
          <div><label className="form-label">Rating (1-5)</label><input type="number" min={1} max={5} className="form-control" value={form.rating} onChange={(e) => set('rating', e.target.value)} /></div>
          <div><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></div>
          <div className="full-width"><label className="form-label">Quote</label><textarea className="form-control" rows={4} value={form.quote} onChange={(e) => set('quote', e.target.value)} /></div>
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

export default TestimonialsAdminPage;
