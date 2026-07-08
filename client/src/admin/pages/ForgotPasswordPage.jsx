/**
 * Admin forgot password page.
 * Location: client/src/admin/pages/ForgotPasswordPage.jsx
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '@api/auth';
import { formatPasswordResetError } from '@api/errors';
import { TOAST_DURATION_MS } from '@utils/toastConfig';
import logo from '@assets/logo/logo.png';
import '../styles/admin.css';

const ForgotPasswordPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    try {
      setSubmitting(true);
      const { message } = await requestPasswordReset(email.trim());
      setSuccessMessage(message);
      setSent(true);
      toast.success(message || 'Email sent successfully.', { autoClose: TOAST_DURATION_MS });
    } catch (error) {
      toast.error(formatPasswordResetError(error, 'Unable to process request. Please try again.'), {
        autoClose: TOAST_DURATION_MS,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-root admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <img src={logo} alt="Shukla Industrial" className="admin-login__logo" />
          <span>Reset Admin Password</span>
        </div>

        {sent ? (
          <div className="admin-login__alert" role="status" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            <span>{successMessage || 'Check your email for a password reset link. The link expires in 15 minutes.'}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <p className="text-muted small mb-3">Enter your admin email and we will send a secure reset link.</p>
            <div className="mb-4">
              <label className="form-label" htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
              />
              {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}

        <p className="admin-login__hint mt-3 mb-0">
          <Link to="/admin/login">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
