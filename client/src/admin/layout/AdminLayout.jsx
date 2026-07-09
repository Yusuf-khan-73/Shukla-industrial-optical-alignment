/**
 * Admin shell layout with responsive sidebar drawer.
 * Location: client/src/admin/layout/AdminLayout.jsx
 */
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthProvider';
import notify from '@utils/notify';
import { getAdminPageTitle } from '../config/adminNavConfig';
import { useAdminSidebar } from '../hooks/useAdminSidebar';
import AdminHeader from './AdminHeader';
import AdminSidebar, { SidebarContent } from './AdminSidebar';
import '../styles/admin.css';

const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.28, ease: 'easeOut' },
};

const drawerMotion = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageTitle = getAdminPageTitle(pathname);
  const {
    isOpen,
    isDrawer,
    close,
    toggle,
    sidebarRef,
    triggerRef,
  } = useAdminSidebar();

  const handleLogout = () => {
    close();
    logout();
    notify.success('Logged out successfully');
    navigate('/admin/login', { replace: true });
  };

  const handleNavigate = () => {
    if (isDrawer) {
      close();
    }
  };

  return (
    <div className="admin-root admin-shell">
      <AdminSidebar
        className="admin-sidebar--desktop"
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        aria-hidden={isDrawer ? true : undefined}
      />

      <AnimatePresence>
        {isDrawer && isOpen && (
          <>
            <motion.button
              type="button"
              className="admin-sidebar-backdrop"
              aria-label="Close navigation menu"
              onClick={close}
              initial={backdropMotion.initial}
              animate={backdropMotion.animate}
              exit={backdropMotion.exit}
              transition={backdropMotion.transition}
            />
            <motion.aside
              ref={sidebarRef}
              id="admin-sidebar-drawer"
              className="admin-sidebar admin-sidebar--drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
              tabIndex={-1}
              initial={drawerMotion.initial}
              animate={drawerMotion.animate}
              exit={drawerMotion.exit}
              transition={drawerMotion.transition}
            >
              <SidebarContent
                showClose
                onClose={close}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="admin-main">
        <AdminHeader
          pageTitle={pageTitle}
          userLabel={user?.full_name || user?.email}
          isDrawer={isDrawer}
          isOpen={isOpen}
          onToggle={toggle}
          triggerRef={triggerRef}
        />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
