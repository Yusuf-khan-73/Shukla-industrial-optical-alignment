/**
 * Shukla Industrial — Application Entry Point
 * Location: client/src/main.jsx
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import App from './App.jsx';
import { AppProvider } from '@context/AppProvider';
import { AuthProvider } from '@context/AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppProvider>
  </StrictMode>
);
