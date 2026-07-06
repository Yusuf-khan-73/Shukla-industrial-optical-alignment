/**
 * Admin hero slides CRUD page.
 * Location: client/src/admin/pages/HeroSlidesAdminPage.jsx
 */
import { useState } from 'react';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import ImageUrlField from '../components/ImageUrlField';
import useAdminCrud from '../hooks/useAdminCrud';
import { adminHeroSlides } from '@api/admin';

const emptyForm = () => ({
  image_url: '', alt_text: '', caption: '', sort_order: 0, is_active: true,
});

const HeroSlidesAdminPage = () => {
  const { items, loading, saving, create, update, remove } = useAdminCrud(adminHeroSlides, { entityName: 'Hero slide' });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      image_url: row.image_url || row.imageUrl || '',
      alt_text: row.alt_text || row.altText || '',
      caption: row.caption || '',
      sort_order: row.sort_order ?? row.sortOrder ?? 0,
      is_active: row.is_active ?? row.isActive ?? true,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    const ok = editing ? await update(editing.id, payload) : await create(payload);
    if (ok) setOpen(false);
  };

  const columns = [
    { key: 'caption', label: 'Caption', render: (r) => r.caption || r.alt_text || r.altText || '—' },
    { key: 'sort_order', label: 'Order', render: (r) => r.sort_order ?? r.sortOrder },
    { key: 'is_active', label: 'Status', render: (r) => ((r.is_active ?? r.isActive) ? 'Active' : 'Hidden') },
    {
      key: 'actions', label: 'Actions',
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
        <h3 className="m-0">Hero Slides</h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}><i className="bi bi-plus-lg" /> Add Slide</button>
      </div>
      <div className="admin-card"><AdminTable columns={columns} rows={items} /></div>
      <AdminModal title={editing ? 'Edit Hero Slide' : 'Add Hero Slide'} open={open} onClose={() => setOpen(false)} footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </>
      )}>
        <div className="admin-form-grid">
          <ImageUrlField label="Slide Image" value={form.image_url} onChange={(v) => set('image_url', v)} altValue={form.alt_text} onAltChange={(v) => set('alt_text', v)} />
          <div className="full-width"><label className="form-label">Caption</label><input className="form-control" value={form.caption} onChange={(e) => set('caption', e.target.value)} /></div>
          <div><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></div>
          <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
        </div>
      </AdminModal>
    </div>
  );
};

export default HeroSlidesAdminPage;
