/**
 * Admin top header with responsive hamburger and page title.
 * Location: client/src/admin/layout/AdminHeader.jsx
 */
const AdminHeader = ({
  pageTitle,
  userLabel,
  isDrawer,
  isOpen,
  onToggle,
  triggerRef,
}) => (
  <header className={`admin-topbar${isDrawer ? ' admin-topbar--drawer' : ''}`}>
    <div className="admin-topbar__leading">
      {isDrawer ? (
        <button
          ref={triggerRef}
          type="button"
          className="admin-topbar__toggle"
          onClick={onToggle}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="admin-sidebar-drawer"
        >
          <i className="bi bi-list" aria-hidden="true" />
        </button>
      ) : (
        <span className="admin-topbar__toggle-spacer" aria-hidden="true" />
      )}
    </div>

    <h1 className="admin-topbar__title">{pageTitle}</h1>

    <div className="admin-topbar__user">
      <span>
        <i className="bi bi-person-circle" aria-hidden="true" /> {userLabel}
      </span>
    </div>
  </header>
);

export default AdminHeader;
