/**
 * Admin shell layout with sidebar and outlet.
 * Location: client/src/admin/layout/AdminLayout.jsx
 */
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthProvider';
import AdminSidebar from './AdminSidebar';
import '../styles/admin.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-root admin-shell">
      <AdminSidebar onLogout={handleLogout} />
      <div className="admin-main">
        <header className="admin-topbar">
          <h2>Administration</h2>
          <div className="admin-topbar__user">
            <span><i className="bi bi-person-circle" /> {user?.full_name || user?.email}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
