/**
 * Admin profile settings page.
 * Location: client/src/admin/pages/ProfileAdminPage.jsx
 */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TOAST_DURATION_MS } from '@utils/toastConfig';
import PageLoader from '@components/Layout/PageLoader';
import { changePassword, fetchCurrentUser, updateProfile } from '@api/auth';
import { uploadAdminImage } from '@api/admin';
import { useAuth } from '@context/AuthProvider';

const ProfileAdminPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    secondary_email: '',
    phone: '',
    profile_picture: '',
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setProfile({
          full_name: data.full_name || data.fullName || '',
          email: data.email || '',
          secondary_email: data.secondary_email || data.secondaryEmail || '',
          phone: data.phone || '',
          profile_picture: data.profile_picture || data.profilePicture || '',
        });
      })
      .catch(() => toast.error('Failed to load profile', { autoClose: TOAST_DURATION_MS }))
      .finally(() => setLoading(false));
  }, []);

  const setField = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { email: _loginEmail, ...profilePayload } = profile;
      await updateProfile(profilePayload);
      toast.success('Profile updated', { autoClose: TOAST_DURATION_MS });
    } catch {
      toast.error('Failed to update profile', { autoClose: TOAST_DURATION_MS });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (passwords.next !== passwords.confirm) {
      toast.error('New passwords do not match', { autoClose: TOAST_DURATION_MS });
      return;
    }
    setSaving(true);
    try {
      await changePassword(passwords.current, passwords.next);
      toast.success('Password changed', { autoClose: TOAST_DURATION_MS });
      setPasswords({ current: '', next: '', confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password', { autoClose: TOAST_DURATION_MS });
    } finally {
      setSaving(false);
    }
  };

  const onAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAdminImage(file, 'avatars');
      setField('profile_picture', url);
      toast.success('Profile picture uploaded', { autoClose: TOAST_DURATION_MS });
    } catch {
      toast.error('Upload failed', { autoClose: TOAST_DURATION_MS });
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="admin-page-title">Admin Profile</h1>
      <p className="text-muted mb-4">Signed in as {user?.email}</p>

      <div className="admin-card mb-4">
        <h3 className="h5 mb-3">Personal Information</h3>
        <div className="admin-form-grid">
          <div className="full-width">
            {profile.profile_picture && (
              <img src={profile.profile_picture} alt="Profile" className="admin-profile-avatar mb-2" />
            )}
            <input type="file" accept="image/*" className="form-control" onChange={onAvatarUpload} />
          </div>
          <div><label className="form-label">Full Name</label><input className="form-control" value={profile.full_name} onChange={(e) => setField('full_name', e.target.value)} /></div>
          <div><label className="form-label">Mobile Number</label><input className="form-control" value={profile.phone} onChange={(e) => setField('phone', e.target.value)} /></div>
          <div>
            <label className="form-label">Primary Email (login)</label>
            <input type="email" className="form-control" value={profile.email} readOnly disabled />
            <small className="text-muted">Change Admin Login Email in Company Settings.</small>
          </div>
          <div><label className="form-label">Secondary Email</label><input type="email" className="form-control" value={profile.secondary_email} onChange={(e) => setField('secondary_email', e.target.value)} /></div>
        </div>
        <button type="button" className="btn btn-primary mt-3" onClick={saveProfile} disabled={saving}>Save Profile</button>
      </div>

      <div className="admin-card">
        <h3 className="h5 mb-3">Change Password</h3>
        <div className="admin-form-grid">
          <div><label className="form-label">Current Password</label><input type="password" className="form-control" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} /></div>
          <div><label className="form-label">New Password</label><input type="password" className="form-control" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} /></div>
          <div><label className="form-label">Confirm New Password</label><input type="password" className="form-control" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} /></div>
        </div>
        <button type="button" className="btn btn-outline-primary mt-3" onClick={savePassword} disabled={saving}>Update Password</button>
      </div>

      <p className="text-muted small mt-3">
        Company details, logo, and contact settings are managed under{' '}
        <a href="/admin/settings">Company Settings</a>.
      </p>
    </div>
  );
};

export default ProfileAdminPage;
