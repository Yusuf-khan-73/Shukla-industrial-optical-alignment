/**
 * Sidebar open/close state for responsive admin drawer.
 * Location: client/src/admin/hooks/useAdminSidebar.js
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const DRAWER_QUERY = '(max-width: 991.98px)';

export const useAdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawer, setIsDrawer] = useState(false);
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(DRAWER_QUERY);

    const syncMode = () => {
      const drawer = media.matches;
      setIsDrawer(drawer);
      if (!drawer) {
        setIsOpen(false);
      }
    };

    syncMode();
    media.addEventListener('change', syncMode);
    return () => media.removeEventListener('change', syncMode);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  useEffect(() => {
    if (!isDrawer || !isOpen) {
      document.body.classList.remove('admin-sidebar-open');
      return undefined;
    }

    document.body.classList.add('admin-sidebar-open');

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('admin-sidebar-open');
    };
  }, [close, isDrawer, isOpen]);

  useEffect(() => {
    if (!isDrawer || !isOpen || !sidebarRef.current) {
      return undefined;
    }

    const sidebar = sidebarRef.current;
    const focusable = sidebar.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const trapFocus = (event) => {
      if (event.key !== 'Tab' || focusable.length === 0) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    sidebar.addEventListener('keydown', trapFocus);
    return () => sidebar.removeEventListener('keydown', trapFocus);
  }, [isDrawer, isOpen]);

  return {
    isOpen,
    isDrawer,
    open,
    close,
    toggle,
    sidebarRef,
    triggerRef,
  };
};
