/**
 * Admin profile settings page.
 * Location: client/src/admin/pages/ProfileAdminPage.jsx
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageLoader from '@components/Layout/PageLoader';
import { changePassword, fetchCurrentUser, updateProfile } from '@api/auth';
import { uploadAdminImage } from '@api/admin';
import { useAuth } from '@context/AuthProvider';
import notify from '@utils/notify';
import { formatApiError, getServerFieldErrors } from '@api/errors';
import { isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE } from '@utils/passwordValidation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[+]?\d[\d\s-]{9,14}$/;

const PROFILE_FIELDS = ['full_name', 'phone', 'secondary_email'];
const PASSWORD_FIELDS = ['current_password', 'new_password', 'confirm_password'];

const ProfileAdminPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    setError: setProfileError,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: { full_name: '', phone: '', secondary_email: '' },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    setError: setPasswordError,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  });

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setProfileValue('full_name', data.full_name || data.fullName || '');
        setProfileValue('phone', data.phone || '');
        setProfileValue('secondary_email', data.secondary_email || data.secondaryEmail || '');
        setLoginEmail(data.email || '');
        setProfilePicture(data.profile_picture || data.profilePicture || '');
      })
      .catch(() => notify.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [setProfileValue]);

  const applyServerFieldErrors = (error, knownFields, setError) => {
    const fieldErrors = getServerFieldErrors(error);
    const matched = Object.entries(fieldErrors).filter(([field]) => knownFields.includes(field));
    matched.forEach(([field, message]) => {
      setError(field, { type: 'server', message });
    });
    return matched.length > 0;
  };

  const onProfileSubmit = async (values) => {
    setSaving(true);
    const toastId = notify.loading('Saving profile...');
    const trimmedSecondaryEmail = (values.secondary_email || '').trim();
    const payload = {
      full_name: values.full_name.trim(),
      phone: values.phone.trim(),
      // Explicit null (not omitted) so a cleared value actually overwrites
      // the stored one instead of being skipped by the backend as "unset".
      secondary_email: trimmedSecondaryEmail ? trimmedSecondaryEmail : null,
      profile_picture: profilePicture,
    };

    try {
      await updateProfile(payload);
      notify.updateSuccess(toastId, 'Profile updated successfully');
    } catch (error) {
      const handled = applyServerFieldErrors(error, PROFILE_FIELDS, setProfileError);
      if (handled) {
        notify.dismiss(toastId);
      } else {
        notify.updateError(toastId, formatApiError(error, 'Failed to update profile'));
      }
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (values) => {
    setPasswordSaving(true);
    const toastId = notify.loading('Updating password...');
    try {
      await changePassword(values.current_password, values.new_password);
      notify.updateSuccess(toastId, 'Password changed successfully');
      resetPasswordForm();
    } catch (error) {
      const handled = applyServerFieldErrors(error, PASSWORD_FIELDS, setPasswordError);
      if (handled) {
        notify.dismiss(toastId);
      } else {
        notify.updateError(toastId, formatApiError(error, 'Failed to change password'));
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const onAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await notify.run('Uploading profile picture...', () => uploadAdminImage(file, 'avatars'), {
        success: 'Profile picture uploaded successfully',
        error: 'Profile picture upload failed',
      });
      setProfilePicture(url);
    } catch {
      // Error toast handled by notify.run
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="admin-page-title">Admin Profile</h1>
      <p className="text-muted mb-4">Signed in as {user?.email}</p>

      <div className="admin-card mb-4">
        <h3 className="h5 mb-3">Personal Information</h3>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} noValidate>
          <div className="admin-form-grid">
            <div className="full-width">
              {profilePicture && (
                <img src={profilePicture} alt="Profile" className="admin-profile-avatar mb-2" />
              )}
              <input type="file" accept="image/*" className="form-control" onChange={onAvatarUpload} />
            </div>
            <div>
              <label className="form-label" htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                className={`form-control ${profileErrors.full_name ? 'is-invalid' : ''}`}
                {...registerProfile('full_name', {
                  required: 'Full Name is required.',
                  minLength: { value: 2, message: 'Full Name must be at least 2 characters.' },
                })}
              />
              {profileErrors.full_name && (
                <div className="invalid-feedback d-block">{profileErrors.full_name.message}</div>
              )}
            </div>
            <div>
              <label className="form-label" htmlFor="phone">Mobile Number</label>
              <input
                id="phone"
                className={`form-control ${profileErrors.phone ? 'is-invalid' : ''}`}
                {...registerProfile('phone', {
                  required: 'Mobile Number is required.',
                  pattern: { value: MOBILE_PATTERN, message: 'Please enter a valid mobile number.' },
                })}
              />
              {profileErrors.phone && (
                <div className="invalid-feedback d-block">{profileErrors.phone.message}</div>
              )}
            </div>
            <div>
              <label className="form-label" htmlFor="login_email">Primary Email (login)</label>
              <input id="login_email" type="email" className="form-control" value={loginEmail} readOnly disabled />
              <small className="text-muted">Change Admin Login Email in Company Settings.</small>
            </div>
            <div>
              <label className="form-label" htmlFor="secondary_email">Secondary Email</label>
              <input
                id="secondary_email"
                type="email"
                className={`form-control ${profileErrors.secondary_email ? 'is-invalid' : ''}`}
                {...registerProfile('secondary_email', {
                  validate: (value) => {
                    const trimmed = (value || '').trim();
                    if (!trimmed) return true;
                    return EMAIL_PATTERN.test(trimmed) || 'Please enter a valid email address.';
                  },
                })}
              />
              {profileErrors.secondary_email && (
                <div className="invalid-feedback d-block">{profileErrors.secondary_email.message}</div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={saving}>Save Profile</button>
        </form>
      </div>

      <div className="admin-card">
        <h3 className="h5 mb-3">Change Password</h3>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate>
          <div className="admin-form-grid">
            <div>
              <label className="form-label" htmlFor="current_password">Current Password</label>
              <input
                id="current_password"
                type="password"
                className={`form-control ${passwordErrors.current_password ? 'is-invalid' : ''}`}
                {...registerPassword('current_password', {
                  required: 'Current password is required.',
                })}
              />
              {passwordErrors.current_password && (
                <div className="invalid-feedback d-block">{passwordErrors.current_password.message}</div>
              )}
            </div>
            <div>
              <label className="form-label" htmlFor="new_password">New Password</label>
              <input
                id="new_password"
                type="password"
                className={`form-control ${passwordErrors.new_password ? 'is-invalid' : ''}`}
                {...registerPassword('new_password', {
                  required: 'New password is required.',
                  validate: (value) => isStrongPassword(value) || PASSWORD_REQUIREMENTS_MESSAGE,
                })}
              />
              {passwordErrors.new_password && (
                <div className="invalid-feedback d-block">{passwordErrors.new_password.message}</div>
              )}
            </div>
            <div>
              <label className="form-label" htmlFor="confirm_password">Confirm New Password</label>
              <input
                id="confirm_password"
                type="password"
                className={`form-control ${passwordErrors.confirm_password ? 'is-invalid' : ''}`}
                {...registerPassword('confirm_password', {
                  required: 'Confirm Password is required.',
                  validate: (value) => value === watchPassword('new_password') || 'Passwords do not match.',
                })}
              />
              {passwordErrors.confirm_password && (
                <div className="invalid-feedback d-block">{passwordErrors.confirm_password.message}</div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-outline-primary mt-3" disabled={passwordSaving}>Update Password</button>
        </form>
      </div>

      <p className="text-muted small mt-3">
        Company details, logo, and contact settings are managed under{' '}
        <a href="/admin/settings">Company Settings</a>.
      </p>
    </div>
  );
};

export default ProfileAdminPage;