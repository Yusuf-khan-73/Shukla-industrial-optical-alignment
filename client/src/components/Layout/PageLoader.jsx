/**
 * Suspense fallback while lazy pages load.
 * Location: client/src/components/Layout/PageLoader.jsx
 */
import logo from '@assets/logo/logo.png';
import './PageLoader.css';

const PageLoader = () => (
  <div className="page-loader" role="status" aria-label="Loading page">
    <img src={logo} alt="" className="page-loader__logo" aria-hidden="true" />
    <div className="page-loader__bar">
      <div className="page-loader__bar-fill" />
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);

export default PageLoader;
