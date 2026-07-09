/**
 * Admin sidebar — fixed desktop panel + shared drawer content.
 * Location: client/src/admin/layout/AdminSidebar.jsx
 */
import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '@assets/logo/logo.png';
import { ADMIN_NAV } from '../config/adminNavConfig';

export const SidebarContent = ({ onLogout, onNavigate, showClose = false, onClose }) => (
  <>
    <div className="admin-sidebar__brand">
      {showClose && (
        <button
          type="button"
          className="admin-sidebar__close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      )}
      <img
        src={logo}
        alt="Shukla Industrial Optical Alignment"
        className="admin-sidebar__logo"
        decoding="async"
      />
      <small>Admin Panel</small>
    </div>

    <nav className="admin-sidebar__nav" aria-label="Admin navigation">
      <ul className="admin-nav">
        {ADMIN_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={onNavigate}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    <div className="admin-sidebar__footer">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-light btn-sm w-100 mb-2"
        onClick={onNavigate}
      >
        <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> View Website
      </a>
      <button type="button" className="btn btn-warning btn-sm w-100" onClick={onLogout}>
        <i className="bi bi-box-arrow-right" aria-hidden="true" /> Logout
      </button>
    </div>
  </>
);

const AdminSidebar = forwardRef(({
  onLogout,
  onNavigate,
  showClose = false,
  onClose,
  className = '',
  id,
  role,
  'aria-hidden': ariaHidden,
  tabIndex,
}, ref) => (
  <aside
    ref={ref}
    id={id}
    className={`admin-sidebar ${className}`.trim()}
    role={role}
    aria-hidden={ariaHidden}
    tabIndex={tabIndex}
  >
    <SidebarContent
      onLogout={onLogout}
      onNavigate={onNavigate}
      showClose={showClose}
      onClose={onClose}
    />
  </aside>
));

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
