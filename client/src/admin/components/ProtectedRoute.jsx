/**
 * Protect admin routes — redirect to login if unauthenticated.
 * Location: client/src/admin/components/ProtectedRoute.jsx
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthProvider';
import PageLoader from '@components/Layout/PageLoader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
