/**
 * Admin projects CRUD page.
 * Location: client/src/admin/pages/ProjectsAdminPage.jsx
 */
import { useState } from 'react';
import PageLoader from '@components/Layout/PageLoader';
import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import useAdminTable from '../hooks/useAdminTable';
import { buildTableProps } from '../helpers/tableProps';
import ImageUrlField from '../components/ImageUrlField';
import useAdminCrud from '../hooks/useAdminCrud';
import { adminProjects } from '@api/admin';
import AdminConfirmDelete from '../components/AdminConfirmDelete';

const emptyForm = () => ({
  title: '', slug: '', client: '', location: '', industry: 'paper-mill',
  industry_label: 'Paper Mill', completion_date: '', service_type: '',
  short_description: '', description: '', featured: false, is_active: true, sort_order: 0,
  image_url: '', image_alt: '',
});

const ProjectsAdminPage = () => {
  const { items, loading, saving, create, update, requestRemove, deleteConfirm } = useAdminCrud(adminProjects, { entityName: 'Project' });
  const table = useAdminTable(items, {
    searchKeys: ['title', 'client', 'location', 'service_type', 'serviceType', 'industry'],
    dateKey: 'completion_date',
    defaultSortKey: 'completion_date',
    defaultSortDir: 'desc',
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    const img = row.images?.[0];
    setForm({
      title: row.title || '',
      slug: row.slug || '',
      client: row.client || '',
      location: row.location || '',
      industry: row.industry || '',
      industry_label: row.industry_label || row.industryLabel || '',
      completion_date: row.completion_date || row.completionDate || '',
      service_type: row.service_type || row.serviceType || '',
      short_description: row.short_description || row.shortDescription || '',
      description: row.description || '',
      featured: Boolean(row.featured),
      is_active: row.is_active ?? row.isActive ?? true,
      sort_order: row.sort_order ?? row.sortOrder ?? 0,
      image_url: img?.url || img?.image_url || '',
      image_alt: img?.alt || img?.alt_text || '',
    });
    setOpen(true);
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    const payload = {
      title: form.title,
      slug: form.slug,
      client: form.client,
      location: form.location,
      industry: form.industry,
      industry_label: form.industry_label,
      completion_date: form.completion_date || null,
      service_type: form.service_type,
      short_description: form.short_description,
      description: form.description,
      featured: form.featured,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
      images: form.image_url
        ? [{ image_url: form.image_url, alt_text: form.image_alt, sort_order: 0 }]
        : [],
    };

    const ok = editing
      ? await update(editing.id, payload)
      : await create(payload);

    if (ok) setOpen(false);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'client', label: 'Client' },
    { key: 'industry', label: 'Industry', render: (r) => r.industry_label || r.industryLabel || r.industry },
    {
      key: 'featured',
      label: 'Status',
      render: (r) => (
        <>
          {r.featured && <span className="admin-badge admin-badge--warning me-1">Featured</span>}
          <span className={`admin-badge ${(r.is_active ?? r.isActive) ? 'admin-badge--success' : 'admin-badge--muted'}`}>
            {(r.is_active ?? r.isActive) ? 'Active' : 'Hidden'}
          </span>
        </>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="admin-actions">
          <button type="button" className="admin-btn-icon" onClick={() => openEdit(r)} aria-label="Edit">
            <i className="bi bi-pencil" />
          </button>
          <button
            type="button"
            className="admin-btn-icon admin-btn-icon--danger"
            onClick={() => requestRemove(r.id)}
            aria-label="Delete"
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
        <h3 className="m-0">Projects</h3>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
          <i className="bi bi-plus-lg" /> Add Project
        </button>
      </div>

      <div className="admin-card">
        <AdminTable
          columns={columns}
          rows={items}
          {...buildTableProps(table, {
            searchPlaceholder: 'Search projects…',
            sortOptions: [
              { key: 'completion_date', dir: 'desc', label: 'Latest completion' },
              { key: 'title', dir: 'asc', label: 'Title A–Z' },
              { key: 'client', dir: 'asc', label: 'Client A–Z' },
            ],
          })}
        />
      </div>

      <AdminModal
        title={editing ? 'Edit Project' : 'Add Project'}
        open={open}
        onClose={() => setOpen(false)}
        footer={(
          <>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        )}
      >
        <div className="admin-form-grid">
          <div><label className="form-label">Title</label><input className="form-control" value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
          <div><label className="form-label">Slug</label><input className="form-control" value={form.slug} onChange={(e) => set('slug', e.target.value)} /></div>
          <div><label className="form-label">Client</label><input className="form-control" value={form.client} onChange={(e) => set('client', e.target.value)} /></div>
          <div><label className="form-label">Location</label><input className="form-control" value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
          <div><label className="form-label">Industry ID</label><input className="form-control" value={form.industry} onChange={(e) => set('industry', e.target.value)} /></div>
          <div><label className="form-label">Industry Label</label><input className="form-control" value={form.industry_label} onChange={(e) => set('industry_label', e.target.value)} /></div>
          <div><label className="form-label">Completion Date</label><input type="date" className="form-control" value={form.completion_date} onChange={(e) => set('completion_date', e.target.value)} /></div>
          <div><label className="form-label">Service Type</label><input className="form-control" value={form.service_type} onChange={(e) => set('service_type', e.target.value)} /></div>
          <div className="full-width"><label className="form-label">Short Description</label><textarea className="form-control" rows={2} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} /></div>
          <div className="full-width"><label className="form-label">Description</label><textarea className="form-control" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <ImageUrlField label="Cover Image" value={form.image_url} onChange={(v) => set('image_url', v)} altValue={form.image_alt} onAltChange={(v) => set('image_alt', v)} />
          <div><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></div>
          <div className="d-flex gap-4 align-items-center">
            <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
            <label className="form-check"><input type="checkbox" className="form-check-input" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
          </div>
        </div>
      </AdminModal>
      <AdminConfirmDelete {...deleteConfirm} />
    </div>
  );
};

export default ProjectsAdminPage;
