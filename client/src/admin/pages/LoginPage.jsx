/**
 * Admin login page.
 * Location: client/src/admin/pages/LoginPage.jsx
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@context/AuthProvider';
import { COMPANY } from '@utils/constants';
import logo from '@assets/logo/logo.png';
import '../styles/admin.css';

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  if (!loading && isAuthenticated) {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(location.state?.from || '/admin', { replace: true });
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-root admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <img src={logo} alt={COMPANY.shortName} className="admin-login__logo" />
          <span>Secure Admin Login</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              autoComplete="username"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
