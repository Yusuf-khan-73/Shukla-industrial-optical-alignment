/**
 * Application router with lazy-loaded pages.
 * Location: client/src/routes/AppRouter.jsx
 */
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from '@components/Layout/Layout';
import PageWrapper from '@components/Layout/PageWrapper';
import PageLoader from '@components/Layout/PageLoader';
import ProtectedRoute from '../admin/components/ProtectedRoute';
import AdminLayout from '../admin/layout/AdminLayout';
import {
  AdminLoginPage,
  ADMIN_PATHS,
  adminChildRoutes,
} from '../admin/adminRoutes';

import {
  publicRoutes,
  NotFoundPage,
  ROUTE_PATHS,
} from './routeConfig';

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Admin routes — separate from public layout */}
        <Route path={ADMIN_PATHS.LOGIN} element={<AdminLoginPage />} />

        <Route
          path={ADMIN_PATHS.ROOT}
          element={(
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          )}
        >
          {adminChildRoutes.map(({ path, element: Page }) => (
            <Route
              key={path || 'index'}
              index={path === ''}
              path={path || undefined}
              element={<Page />}
            />
          ))}
        </Route>

        {/* Public website */}
        <Route element={<Layout />}>
          {publicRoutes.map(({ path, element: Page, meta }) => (
            <Route
              key={path}
              path={path}
              element={(
                <PageWrapper meta={meta}>
                  <Page />
                </PageWrapper>
              )}
            />
          ))}

          <Route
            path={ROUTE_PATHS.NOT_FOUND}
            element={(
              <PageWrapper
                meta={{
                  title: '404 — Page Not Found | Shukla Industrial',
                  description: 'The page you are looking for does not exist.',
                }}
              >
                <NotFoundPage />
              </PageWrapper>
            )}
          />
        </Route>

        <Route path="/admin/*" element={<Navigate to={ADMIN_PATHS.ROOT} replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
