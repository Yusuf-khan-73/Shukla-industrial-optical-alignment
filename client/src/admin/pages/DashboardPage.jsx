/**
 * Admin dashboard with summary stats.
 * Location: client/src/admin/pages/DashboardPage.jsx
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminDashboardStats } from '@api/admin';
import PageLoader from '@components/Layout/PageLoader';

const STAT_LINKS = [
  { key: 'projects', label: 'Projects', to: '/admin/projects', icon: 'bi-folder2-open' },
  { key: 'gallery', label: 'Gallery', to: '/admin/gallery', icon: 'bi-images' },
  { key: 'clients', label: 'Clients', to: '/admin/clients', icon: 'bi-buildings' },
  { key: 'services', label: 'Services', to: '/admin/services', icon: 'bi-gear-wide-connected' },
  { key: 'testimonials', label: 'Testimonials', to: '/admin/testimonials', icon: 'bi-chat-quote' },
  { key: 'messages', label: 'Contact Messages', to: '/admin/contact', icon: 'bi-envelope-paper' },
  { key: 'heroSlides', label: 'Hero Slides', to: '/admin/hero-slides', icon: 'bi-collection-play' },
];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <p className="text-muted mb-4">Overview of website content and inquiries.</p>

      <div className="admin-stats">
        {STAT_LINKS.map((item) => (
          <Link key={item.key} to={item.to} className="admin-stat text-decoration-none">
            <div className="d-flex align-items-center gap-2 mb-2 text-muted">
              <i className={`bi ${item.icon}`} />
              <span className="admin-stat__label mb-0">{item.label}</span>
            </div>
            <div className="admin-stat__value">{stats?.[item.key] ?? 0}</div>
          </Link>
        ))}
      </div>

      {stats?.unreadMessages > 0 && (
        <div className="admin-card">
          <h5 className="mb-2"><i className="bi bi-bell" /> Unread Inquiries</h5>
          <p className="mb-3 text-muted">
            You have <strong>{stats.unreadMessages}</strong> unread contact message(s).
          </p>
          <Link to="/admin/contact" className="btn btn-warning btn-sm">View Messages</Link>
        </div>
      )}

      <div className="admin-card">
        <h5 className="mb-3">Quick Actions</h5>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/projects" className="btn btn-outline-primary btn-sm">Add Project</Link>
          <Link to="/admin/gallery" className="btn btn-outline-primary btn-sm">Add Gallery Item</Link>
          <Link to="/admin/settings" className="btn btn-outline-primary btn-sm">Edit Site Settings</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
