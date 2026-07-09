/**
 * Admin navigation items and page titles.
 * Location: client/src/admin/config/adminNavConfig.js
 */

export const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
  { to: '/admin/projects', label: 'Projects', icon: 'bi-folder2-open' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'bi-images' },
  { to: '/admin/clients', label: 'Clients', icon: 'bi-buildings' },
  { to: '/admin/services', label: 'Services', icon: 'bi-gear-wide-connected' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'bi-chat-quote' },
  { to: '/admin/contact', label: 'Contact Messages', icon: 'bi-envelope-paper' },
  { to: '/admin/hero-slides', label: 'Hero Slides', icon: 'bi-collection-play' },
  { to: '/admin/profile', label: 'My Profile', icon: 'bi-person-circle' },
  { to: '/admin/settings', label: 'Company Settings', icon: 'bi-sliders' },
];

export const getAdminPageTitle = (pathname) => {
  const match = ADMIN_NAV.find((item) => {
    if (item.end) {
      return pathname === item.to || pathname === `${item.to}/`;
    }
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  });

  return match?.label || 'Administration';
};
