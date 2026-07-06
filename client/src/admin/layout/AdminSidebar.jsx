/**
 * Admin sidebar navigation.
 * Location: client/src/admin/layout/AdminSidebar.jsx
 */
import { NavLink } from 'react-router-dom';
import { COMPANY } from '@utils/constants';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
  { to: '/admin/projects', label: 'Projects', icon: 'bi-folder2-open' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'bi-images' },
  { to: '/admin/clients', label: 'Clients', icon: 'bi-buildings' },
  { to: '/admin/services', label: 'Services', icon: 'bi-gear-wide-connected' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'bi-chat-quote' },
  { to: '/admin/contact', label: 'Contact Messages', icon: 'bi-envelope-paper' },
  { to: '/admin/hero-slides', label: 'Hero Slides', icon: 'bi-collection-play' },
  { to: '/admin/settings', label: 'Settings', icon: 'bi-sliders' },
];

const AdminSidebar = ({ onLogout }) => (
  <aside className="admin-sidebar">
    <div className="admin-sidebar__brand">
      <strong>{COMPANY.shortName}</strong>
      <small>Admin Panel</small>
    </div>

    <ul className="admin-nav">
      {NAV.map((item) => (
        <li key={item.to}>
          <NavLink to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className={`bi ${item.icon}`} />
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>

    <div className="admin-sidebar__footer">
      <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-sm w-100 mb-2">
        <i className="bi bi-box-arrow-up-right" /> View Website
      </a>
      <button type="button" className="btn btn-warning btn-sm w-100" onClick={onLogout}>
        <i className="bi bi-box-arrow-right" /> Logout
      </button>
    </div>
  </aside>
);

export default AdminSidebar;
