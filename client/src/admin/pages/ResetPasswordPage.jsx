/**
 * Admin reset password page (from email link).
 * Location: client/src/admin/pages/ResetPasswordPage.jsx
 */
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import notify from '@utils/notify';
import { resetPassword, verifyResetToken } from '@api/auth';
import { formatPasswordResetError } from '@api/errors';
import {
  getPasswordStrength,
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
  PASSWORD_RULES,
} from '@utils/passwordValidation';
import logo from '@assets/logo/logo.png';
import '../styles/admin.css';

const PasswordField = ({
  id,
  label,
  register,
  error,
  show,
  onToggle,
}) => (
  <div className="mb-3">
    <label className="form-label" htmlFor={id}>{label}</label>
    <div className="input-group">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        autoComplete="new-password"
        {...register}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onToggle}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
      </button>
    </div>
    {error && <div className="invalid-feedback d-block">{error.message}</div>}
  </div>
);

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { password: '', confirm: '' },
  });

  const password = watch('password');
  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        setVerifying(true);
        const result = await verifyResetToken(token);
        if (cancelled) return;
        setTokenValid(result.valid);
        if (!result.valid) {
          notify.error(result.message || 'Invalid or expired reset token.');
        }
      } catch (error) {
        if (cancelled) return;
        setTokenValid(false);
        notify.error(formatPasswordResetError(error, 'Invalid or expired reset token.'));
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [token]);

  const onSubmit = async ({ password: newPassword }) => {
    if (!token || !tokenValid) {
      notify.error('Invalid reset link. Request a new password reset.');
      return;
    }
    if (!isStrongPassword(newPassword)) {
      notify.error(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    try {
      setSubmitting(true);
      await notify.run('Updating password...', () => resetPassword(token, newPassword), {
        success: 'Password updated successfully',
        error: (error) => formatPasswordResetError(error, 'Reset failed. The link may have expired.'),
      });
      setSuccess(true);
    } catch {
      // Error toast handled by notify.run
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="admin-root admin-login">
        <div className="admin-login__card">
          <div className="admin-login__brand">
            <img src={logo} alt="Shukla Industrial" className="admin-login__logo" />
            <span>Password Changed Successfully</span>
          </div>
          <div
            className="admin-login__alert"
            role="status"
            style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}
          >
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            <span>
              Your password has been updated. You can now login using your new password.
            </span>
          </div>
          <Link to="/admin/login" className="btn btn-primary w-100">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <img src={logo} alt="Shukla Industrial" className="admin-login__logo" />
          <span>Create New Password</span>
        </div>

        {verifying ? (
          <div className="text-center py-4" role="status" aria-live="polite">
            <span className="spinner-border text-primary mb-3" aria-hidden="true" />
            <p className="text-muted small mb-0">Verifying reset link…</p>
          </div>
        ) : !token || !tokenValid ? (
          <div className="admin-login__alert" role="alert">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            <span>
              Invalid or expired reset token.{' '}
              <Link to="/admin/forgot-password">Request a new link</Link>.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <PasswordField
              id="new-password"
              label="New Password"
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              error={errors.password}
              register={register('password', {
                required: 'Password is required',
                validate: (v) => isStrongPassword(v) || PASSWORD_REQUIREMENTS_MESSAGE,
              })}
            />

            {password && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Password strength</small>
                  <small style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</small>
                </div>
                <div
                  className="rounded-pill overflow-hidden"
                  style={{ height: 6, background: '#e2e8f0' }}
                  aria-hidden="true"
                >
                  <div
                    style={{
                      width: `${strength.score}%`,
                      height: '100%',
                      background: strength.color,
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
                <ul className="list-unstyled small mt-2 mb-0">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li key={rule.id} style={{ color: ok ? '#166534' : '#64748b' }}>
                        <i className={`bi ${ok ? 'bi-check-circle-fill' : 'bi-circle'} me-1`} aria-hidden="true" />
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <PasswordField
              id="confirm-password"
              label="Confirm Password"
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
              error={errors.confirm}
              register={register('confirm', {
                required: 'Please confirm password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
            />

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Updating…
                </>
              ) : (
                'Update Password'
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

export default ResetPasswordPage;
