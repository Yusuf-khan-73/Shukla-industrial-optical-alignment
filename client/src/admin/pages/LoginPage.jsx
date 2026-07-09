/**
 * Admin login page.
 * Location: client/src/admin/pages/LoginPage.jsx
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import notify from '@utils/notify';
import { getLoginErrorMessage } from '@api/auth';
import { useAuth } from '@context/AuthProvider';
import { COMPANY } from '@utils/constants';
import logo from '@assets/logo/logo.png';
import '../styles/admin.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  if (!loading && isAuthenticated) {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  const onSubmit = async (data) => {
    setAuthError('');
    clearErrors();

    const toastId = notify.loading('Authenticating...');

    try {
      setSubmitting(true);
      await login(data.email.trim(), data.password);
      notify.updateSuccess(toastId, 'Login successful');
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (error) {
      const message = getLoginErrorMessage(error);
      notify.updateError(toastId, message);
      setAuthError(message);

      if (error.response?.status === 401) {
        setError('email', { type: 'server', message: ' ' });
        setError('password', { type: 'server', message: 'Invalid email or password' });
      } else if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          detail.forEach((item) => {
            const field = item.loc?.[item.loc.length - 1];
            if (field === 'email') {
              setError('email', { type: 'server', message: 'Enter a valid email address' });
            }
            if (field === 'password') {
              setError('password', { type: 'server', message: 'Password must be at least 6 characters' });
            }
          });
        }
      }
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

        {authError && (
          <div className="admin-login__alert" role="alert">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              autoComplete="username"
              placeholder="admin@shuklaindustrial.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_PATTERN,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email?.message?.trim() && (
              <div className="invalid-feedback d-block">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password.message}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-center mt-3 mb-0">
            <Link to="/admin/forgot-password" className="small">Forgot Password?</Link>
          </p>
        </form>

        <p className="admin-login__hint">
          Use the Admin Login Email configured in Company Settings.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
