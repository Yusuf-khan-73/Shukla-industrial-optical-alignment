/**
 * Admin gallery CRUD page.
 * Location: client/src/admin/pages/GalleryAdminPage.jsx
 */
import { useState } from 'react';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import ImageUrlField from '../components/ImageUrlField';
import useAdminCrud from '../hooks/useAdminCrud';
import { adminGallery } from '@api/admin';

const emptyForm = () => ({
  title: '', company: '', location: '', date: '', category: 'alignment',
  category_label: 'Optical Alignment', description: '', featured: false,
  is_active: true, sort_order: 0, image_url: '', image_alt: '',
});

const GalleryAdminPage = () => {
  const { items, loading, saving, create, update, remove } = useAdminCrud(adminGallery, { entityName: 'Gallery item' });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };

  const openEdit = (row) => {
    setEditing(row);
    const img = row.image || row.images?.[0];
    setForm({
      title: row.title || '',
      company: row.company || '',
      location: row.location || '',
      date: row.date || '',
      category: row.category || '',
      category_label: row.category_label || row.categoryLabel || '',
      description: row.description || '',
      featured: Boolean(row.featured),
      is_active: row.is_active ?? row.isActive ?? true,
      sort_order: row.sort_order ?? row.sortOrder ?? 0,
      image_url: img?.url || img?.image_url || '',
      image_alt: img?.alt || img?.alt_text || row.title || '',
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      date: form.date,
      category: form.category,
      category_label: form.category_label,
      description: form.description,
      featured: form.featured,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
      images: form.image_url ? [{ image_url: form.image_url, alt_text: form.image_alt, sort_order: 0 }] : [],
    };
    const ok = editing ? await update(editing.id, payload) : await create(payload);
    if (ok) setOpen(false);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company' },
    { key: 'category', label: 'Category', render: (r) => r.category_label || r.categoryLabel },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="admin-actions">
          <button type="button" className="admin-btn-icon" onClick={() => openEdit(r)}><i className="bi bi-pencil" /></button>
          <button type="button" className="admin-btn-icon admin-btn-icon--danger" onClick={() => window.confirm('Delete?') && remove(r.id)}><i className="bi bi-trash" /></button>
        </div>
      ),
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="admin-toolbar">
        <h3 className="m-0">Gallery</h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}><i className="bi bi-plus-lg" /> Add Item</button>
      </div>
      <div className="admin-card"><AdminTable columns={columns} rows={items} /></div>
      <AdminModal
        title={editing ? 'Edit Gallery Item' : 'Add Gallery Item'}
        open={open}
        onClose={() => setOpen(false)}
        footer={(
          <>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        )}
      >
        <div className="admin-form-grid">
          <div><label className="form-label">Title</label><input className="form-control" value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
          <div><label className="form-label">Company</label><input className="form-control" value={form.company} onChange={(e) => set('company', e.target.value)} /></div>
          <div><label className="form-label">Location</label><input className="form-control" value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
          <div><label className="form-label">Date</label><input type="date" className="form-control" value={form.date} onChange={(e) => set('date', e.target.value)} /></div>
          <div><label className="form-label">Category ID</label><input className="form-control" value={form.category} onChange={(e) => set('category', e.target.value)} /></div>
          <div><label className="form-label">Category Label</label><input className="form-control" value={form.category_label} onChange={(e) => set('category_label', e.target.value)} /></div>
          <div className="full-width"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <ImageUrlField label="Photo" value={form.image_url} onChange={(v) => set('image_url', v)} altValue={form.image_alt} onAltChange={(v) => set('image_alt', v)} />
          <div><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></div>
          <div className="d-flex gap-4">
            <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
            <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default GalleryAdminPage;
