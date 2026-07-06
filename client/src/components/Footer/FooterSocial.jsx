/**
 * Social media icon links for footer.
 * Location: client/src/components/Footer/FooterSocial.jsx
 */
import { useApp } from '@context/AppProvider';

const SOCIAL_ITEMS = [
  { key: 'whatsapp', icon: 'bi-whatsapp', label: 'WhatsApp', external: true },
  { key: 'facebook', icon: 'bi-facebook', label: 'Facebook', external: true },
  { key: 'instagram', icon: 'bi-instagram', label: 'Instagram', external: true },
  { key: 'linkedin', icon: 'bi-linkedin', label: 'LinkedIn', external: true },
  { key: 'youtube', icon: 'bi-youtube', label: 'YouTube', external: true },
];

const FooterSocial = () => {
  const { social } = useApp();

  return (
    <div className="footer-social">
      {SOCIAL_ITEMS.map((item) => (
        <a
          key={item.key}
          href={social[item.key] || '#'}
          className={`footer-social__link footer-social__link--${item.key}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
        >
          <i className={`bi ${item.icon}`} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};

export default FooterSocial;
