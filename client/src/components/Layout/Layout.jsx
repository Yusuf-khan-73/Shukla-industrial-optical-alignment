/**
 * Main site layout — navbar, content, footer, floating buttons.
 * Location: client/src/components/Layout/Layout.jsx
 */
import { Outlet } from 'react-router-dom';
import { LenisProvider } from '@context/LenisProvider';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import FloatingButtons from '@components/FloatingButtons';
import ScrollToTop from './ScrollToTop';
import ScrollProgressBar from './ScrollProgressBar';
import './Layout.css';

const Layout = () => (
  <LenisProvider>
    <div className="site-layout">
      <ScrollToTop />
      <ScrollProgressBar />
      <Navbar />

      <main id="main-content" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  </LenisProvider>
);

export default Layout;
