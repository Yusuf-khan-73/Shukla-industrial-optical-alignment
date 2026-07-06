/**
 * About section header block.
 * Location: client/src/components/About/SectionHeader.jsx
 */
const SectionHeader = ({
  label,
  title,
  subtitle,
  centered = false,
  light = false,
}) => (
  <div
    className={`about-header ${centered ? 'about-header--center' : ''} ${light ? 'about-header--light' : ''}`}
    data-aos="fade-up"
  >
    {label && <span className="section-label">{label}</span>}
    {title && <h2 className="section-title">{title}</h2>}
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </div>
);

export default SectionHeader;
