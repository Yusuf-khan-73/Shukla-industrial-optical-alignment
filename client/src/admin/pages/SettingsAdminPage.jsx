/**
 * Admin company settings and site configuration.
 * Location: client/src/admin/pages/SettingsAdminPage.jsx
 */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TOAST_DURATION_MS } from '@utils/toastConfig';
import PageLoader from '@components/Layout/PageLoader';
import { adminCompany, adminSettings, uploadAdminImage } from '@api/admin';
import { formatApiError } from '@api/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SettingsAdminPage = () => {
  const [tab, setTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [seo, setSeo] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
  });
  const [company, setCompany] = useState({
    company_name: '',
    tagline: '',
    description: '',
    logo: '',
    email: '',
    admin_login_email: '',
    phone_1: '',
    phone_2: '',
    whatsapp_number: '',
    office_address: '',
    google_map_url: '',
    hours_days: '',
    hours_time: '',
    hours_emergency: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  });

  useEffect(() => {
    Promise.all([adminSettings.get(), adminCompany.get()])
      .then(([siteData, companyData]) => {
        const seoDefaults = siteData.seo_defaults || siteData.seoDefaults || {};
        setSeo({
          seo_title: seoDefaults.title || '',
          seo_description: seoDefaults.description || '',
          seo_keywords: seoDefaults.keywords || '',
        });

        const hours = companyData.working_hours || companyData.workingHours || {};
        const phones = companyData.phones || [];
        setCompany({
          company_name: companyData.company_name || companyData.companyName || '',
          tagline: companyData.tagline || '',
          description: companyData.description || '',
          logo: companyData.logo || '',
          email: companyData.email || '',
          admin_login_email: companyData.admin_login_email || companyData.adminLoginEmail || '',
          phone_1: companyData.phone_1 || companyData.phone1 || phones[0] || '',
          phone_2: companyData.phone_2 || companyData.phone2 || phones[1] || '',
          whatsapp_number: companyData.whatsapp_number || companyData.whatsappNumber || '',
          office_address: companyData.office_address || companyData.officeAddress
            || companyData.address?.full || '',
          google_map_url: companyData.google_map_url || companyData.googleMapUrl
            || siteData.map_embed_url || siteData.mapEmbedUrl || '',
          hours_days: hours.days || '',
          hours_time: hours.time || '',
          hours_emergency: hours.emergency || '',
          facebook: companyData.facebook || siteData.social_links?.facebook || '',
          instagram: companyData.instagram || siteData.social_links?.instagram || '',
          linkedin: companyData.linkedin || siteData.social_links?.linkedin || '',
          youtube: companyData.youtube || siteData.social_links?.youtube || '',
        });
      })
      .catch(() => toast.error('Failed to load settings', { autoClose: TOAST_DURATION_MS }))
      .finally(() => setLoading(false));
  }, []);

  const validateCompany = () => {
    const nextErrors = {};
    const publicEmail = company.email.trim();
    const adminEmail = company.admin_login_email.trim();

    if (!publicEmail) {
      nextErrors.email = 'Public Company Email is required.';
    } else if (!EMAIL_PATTERN.test(publicEmail)) {
      nextErrors.email = 'Enter a valid public company email address.';
    }

    if (!adminEmail) {
      nextErrors.admin_login_email = 'Admin Login Email Address is required.';
    } else if (!EMAIL_PATTERN.test(adminEmail)) {
      nextErrors.admin_login_email = 'Enter a valid admin login email address.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveCompany = async () => {
    if (!validateCompany()) {
      toast.error('Please fix the highlighted email fields.', { autoClose: TOAST_DURATION_MS });
      return;
    }

    setSaving(true);
    try {
      await adminCompany.update({
        company_name: company.company_name,
        tagline: company.tagline,
        description: company.description,
        logo: company.logo,
        email: company.email.trim(),
        admin_login_email: company.admin_login_email.trim(),
        phone_1: company.phone_1,
        phone_2: company.phone_2,
        whatsapp_number: company.whatsapp_number,
        office_address: company.office_address,
        google_map_url: company.google_map_url,
        facebook: company.facebook,
        instagram: company.instagram,
        linkedin: company.linkedin,
        youtube: company.youtube,
        working_hours: {
          days: company.hours_days,
          time: company.hours_time,
          emergency: company.hours_emergency,
        },
      });

      await adminSettings.update({
        map_embed_url: company.google_map_url,
        social_links: {
          whatsapp: company.whatsapp_number
            ? `https://wa.me/${company.whatsapp_number.replace(/\D/g, '')}`
            : '',
          facebook: company.facebook,
          instagram: company.instagram,
          linkedin: company.linkedin,
          youtube: company.youtube,
        },
      });

      toast.success('Company settings saved', { autoClose: TOAST_DURATION_MS });
    } catch (error) {
      toast.error(formatApiError(error, 'Failed to save company settings'), {
        autoClose: TOAST_DURATION_MS,
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSeo = async () => {
    setSaving(true);
    try {
      await adminSettings.update({
        seo_defaults: {
          title: seo.seo_title,
          description: seo.seo_description,
          keywords: seo.seo_keywords,
        },
      });
      toast.success('SEO settings saved', { autoClose: TOAST_DURATION_MS });
    } catch {
      toast.error('Failed to save SEO settings', { autoClose: TOAST_DURATION_MS });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file, 'logo');
      setCompany((c) => ({ ...c, logo: url }));
      toast.success('Logo uploaded', { autoClose: TOAST_DURATION_MS });
    } catch {
      toast.error('Logo upload failed', { autoClose: TOAST_DURATION_MS });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <PageLoader />;

  const setCompanyField = (key, value) => {
    setCompany((c) => ({ ...c, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };
  const setSeoField = (key, value) => setSeo((s) => ({ ...s, [key]: value }));

  return (
    <div>
      <h1 className="admin-page-title">Company Settings</h1>
      <p className="admin-page-subtitle text-muted mb-4">
        Update company information, contact details, map, and social links without changing frontend code.
      </p>

      <div className="admin-tabs">
        <button type="button" className={tab === 'company' ? 'active' : ''} onClick={() => setTab('company')}>
          Company Information
        </button>
        <button type="button" className={tab === 'seo' ? 'active' : ''} onClick={() => setTab('seo')}>
          SEO Settings
        </button>
      </div>

      {tab === 'company' && (
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="full-width">
              <label className="form-label">Company Name</label>
              <input className="form-control" value={company.company_name} onChange={(e) => setCompanyField('company_name', e.target.value)} />
            </div>
            <div className="full-width">
              <label className="form-label">Tagline</label>
              <input className="form-control" value={company.tagline} onChange={(e) => setCompanyField('tagline', e.target.value)} />
            </div>
            <div className="full-width">
              <label className="form-label">Company Description</label>
              <textarea className="form-control" rows={4} value={company.description} onChange={(e) => setCompanyField('description', e.target.value)} />
            </div>
            <div className="full-width">
              <label className="form-label">Company Logo</label>
              {company.logo && (
                <div className="mb-2">
                  <img src={company.logo} alt="Company logo" style={{ maxHeight: 80, borderRadius: 8 }} />
                </div>
              )}
              <input type="file" className="form-control" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            </div>
            <div>
              <label className="form-label">Primary Mobile (+91 9510900608)</label>
              <input className="form-control" value={company.phone_1} onChange={(e) => setCompanyField('phone_1', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Secondary Mobile (+91 8707305703)</label>
              <input className="form-control" value={company.phone_2} onChange={(e) => setCompanyField('phone_2', e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="public-company-email">Public Company Email</label>
              <input
                id="public-company-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={company.email}
                onChange={(e) => setCompanyField('email', e.target.value)}
                placeholder="info@shuklaalignment.com"
                required
              />
              {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
              <small className="text-muted">Shown on the Contact page, footer, and customer enquiry emails.</small>
            </div>
            <div>
              <label className="form-label">WhatsApp Number (digits only, e.g. 919510900608)</label>
              <input className="form-control" value={company.whatsapp_number} onChange={(e) => setCompanyField('whatsapp_number', e.target.value)} />
            </div>
            <div className="full-width">
              <label className="form-label">Office Address</label>
              <textarea className="form-control" rows={2} value={company.office_address} onChange={(e) => setCompanyField('office_address', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Working Days</label>
              <input className="form-control" value={company.hours_days} onChange={(e) => setCompanyField('hours_days', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Working Hours</label>
              <input className="form-control" value={company.hours_time} onChange={(e) => setCompanyField('hours_time', e.target.value)} />
            </div>
            <div className="full-width">
              <label className="form-label">Emergency Support</label>
              <input className="form-control" value={company.hours_emergency} onChange={(e) => setCompanyField('hours_emergency', e.target.value)} />
            </div>
            <div className="full-width">
              <label className="form-label">Google Maps Embed URL</label>
              <textarea className="form-control" rows={3} value={company.google_map_url} onChange={(e) => setCompanyField('google_map_url', e.target.value)} />
            </div>
            <div><label className="form-label">Facebook URL</label><input className="form-control" value={company.facebook} onChange={(e) => setCompanyField('facebook', e.target.value)} /></div>
            <div><label className="form-label">Instagram URL</label><input className="form-control" value={company.instagram} onChange={(e) => setCompanyField('instagram', e.target.value)} /></div>
            <div><label className="form-label">LinkedIn URL</label><input className="form-control" value={company.linkedin} onChange={(e) => setCompanyField('linkedin', e.target.value)} /></div>
            <div><label className="form-label">YouTube URL</label><input className="form-control" value={company.youtube} onChange={(e) => setCompanyField('youtube', e.target.value)} /></div>
          </div>

          <hr className="my-4" />

          <h2 className="h5 mb-1">Admin Login Settings</h2>
          <p className="text-muted small mb-3">
            Used only for Admin Panel login and password reset. Never displayed on the public website.
          </p>
          <div className="admin-form-grid">
            <div className="full-width">
              <label className="form-label" htmlFor="admin-login-email">
                Admin Login Email Address <span className="text-danger">*</span>
              </label>
              <input
                id="admin-login-email"
                type="email"
                className={`form-control ${errors.admin_login_email ? 'is-invalid' : ''}`}
                value={company.admin_login_email}
                onChange={(e) => setCompanyField('admin_login_email', e.target.value)}
                placeholder="admin@shuklaalignment.com"
                required
              />
              {errors.admin_login_email && (
                <div className="invalid-feedback d-block">{errors.admin_login_email}</div>
              )}
              <small className="text-muted">
                Changing this updates the admin login email immediately. Public Company Email stays unchanged.
              </small>
            </div>
          </div>

          <button type="button" className="btn btn-primary mt-3" onClick={saveCompany} disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save Company Settings'}
          </button>
        </div>
      )}

      {tab === 'seo' && (
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="full-width"><label className="form-label">SEO Title</label><input className="form-control" value={seo.seo_title} onChange={(e) => setSeoField('seo_title', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">SEO Description</label><textarea className="form-control" rows={2} value={seo.seo_description} onChange={(e) => setSeoField('seo_description', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">SEO Keywords</label><input className="form-control" value={seo.seo_keywords} onChange={(e) => setSeoField('seo_keywords', e.target.value)} /></div>
          </div>
          <button type="button" className="btn btn-primary mt-3" onClick={saveSeo} disabled={saving}>
            {saving ? 'Saving…' : 'Save SEO Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsAdminPage;
