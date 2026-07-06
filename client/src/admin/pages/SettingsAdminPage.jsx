/**
 * Admin site settings and company info.
 * Location: client/src/admin/pages/SettingsAdminPage.jsx
 */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PageLoader from '@components/Layout/PageLoader';
import { adminCompany, adminSettings } from '@api/admin';

const SettingsAdminPage = () => {
  const [tab, setTab] = useState('site');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [site, setSite] = useState({
    map_embed_url: '',
    social_whatsapp: '',
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    social_youtube: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
  });
  const [company, setCompany] = useState({
    company_name: '',
    tagline: '',
    description: '',
    email: '',
    phone_primary: '',
    phone_secondary: '',
    address_full: '',
    hours_days: '',
    hours_time: '',
  });

  useEffect(() => {
    Promise.all([adminSettings.get(), adminCompany.get()])
      .then(([siteData, companyData]) => {
        const social = siteData.social_links || siteData.socialLinks || {};
        const seo = siteData.seo_defaults || siteData.seoDefaults || {};
        setSite({
          map_embed_url: siteData.map_embed_url || siteData.mapEmbedUrl || '',
          social_whatsapp: social.whatsapp || '',
          social_facebook: social.facebook || '',
          social_instagram: social.instagram || '',
          social_linkedin: social.linkedin || '',
          social_youtube: social.youtube || '',
          seo_title: seo.title || '',
          seo_description: seo.description || '',
          seo_keywords: seo.keywords || '',
        });

        const phones = companyData.phones || [];
        const address = companyData.address || {};
        const hours = companyData.working_hours || companyData.workingHours || {};
        setCompany({
          company_name: companyData.company_name || companyData.companyName || '',
          tagline: companyData.tagline || '',
          description: companyData.description || '',
          email: companyData.email || '',
          phone_primary: phones[0] || '',
          phone_secondary: phones[1] || '',
          address_full: address.full || address.line1 || '',
          hours_days: hours.days || '',
          hours_time: hours.time || '',
        });
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const saveSite = async () => {
    setSaving(true);
    try {
      await adminSettings.update({
        map_embed_url: site.map_embed_url,
        social_links: {
          whatsapp: site.social_whatsapp,
          facebook: site.social_facebook,
          instagram: site.social_instagram,
          linkedin: site.social_linkedin,
          youtube: site.social_youtube,
        },
        seo_defaults: {
          title: site.seo_title,
          description: site.seo_description,
          keywords: site.seo_keywords,
        },
      });
      toast.success('Site settings saved');
    } catch {
      toast.error('Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  const saveCompany = async () => {
    setSaving(true);
    try {
      const phones = [company.phone_primary, company.phone_secondary].filter(Boolean);
      await adminCompany.update({
        company_name: company.company_name,
        tagline: company.tagline,
        description: company.description,
        email: company.email,
        phones,
        address: { full: company.address_full, line1: company.address_full, country: 'India' },
        working_hours: { days: company.hours_days, time: company.hours_time },
      });
      toast.success('Company info saved');
    } catch {
      toast.error('Failed to save company info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const setSiteField = (key, value) => setSite((s) => ({ ...s, [key]: value }));
  const setCompanyField = (key, value) => setCompany((c) => ({ ...c, [key]: value }));

  return (
    <div>
      <div className="admin-tabs">
        <button type="button" className={tab === 'site' ? 'active' : ''} onClick={() => setTab('site')}>Site Settings</button>
        <button type="button" className={tab === 'company' ? 'active' : ''} onClick={() => setTab('company')}>Company Info</button>
      </div>

      {tab === 'site' && (
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="full-width">
              <label className="form-label">Google Maps Embed URL</label>
              <textarea className="form-control" rows={3} value={site.map_embed_url} onChange={(e) => setSiteField('map_embed_url', e.target.value)} />
            </div>
            <div><label className="form-label">WhatsApp URL</label><input className="form-control" value={site.social_whatsapp} onChange={(e) => setSiteField('social_whatsapp', e.target.value)} /></div>
            <div><label className="form-label">Facebook URL</label><input className="form-control" value={site.social_facebook} onChange={(e) => setSiteField('social_facebook', e.target.value)} /></div>
            <div><label className="form-label">Instagram URL</label><input className="form-control" value={site.social_instagram} onChange={(e) => setSiteField('social_instagram', e.target.value)} /></div>
            <div><label className="form-label">LinkedIn URL</label><input className="form-control" value={site.social_linkedin} onChange={(e) => setSiteField('social_linkedin', e.target.value)} /></div>
            <div><label className="form-label">YouTube URL</label><input className="form-control" value={site.social_youtube} onChange={(e) => setSiteField('social_youtube', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">SEO Title</label><input className="form-control" value={site.seo_title} onChange={(e) => setSiteField('seo_title', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">SEO Description</label><textarea className="form-control" rows={2} value={site.seo_description} onChange={(e) => setSiteField('seo_description', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">SEO Keywords</label><input className="form-control" value={site.seo_keywords} onChange={(e) => setSiteField('seo_keywords', e.target.value)} /></div>
          </div>
          <button type="button" className="btn btn-primary mt-3" onClick={saveSite} disabled={saving}>
            {saving ? 'Saving…' : 'Save Site Settings'}
          </button>
        </div>
      )}

      {tab === 'company' && (
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="full-width"><label className="form-label">Company Name</label><input className="form-control" value={company.company_name} onChange={(e) => setCompanyField('company_name', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">Tagline</label><input className="form-control" value={company.tagline} onChange={(e) => setCompanyField('tagline', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">Description</label><textarea className="form-control" rows={4} value={company.description} onChange={(e) => setCompanyField('description', e.target.value)} /></div>
            <div><label className="form-label">Email</label><input type="email" className="form-control" value={company.email} onChange={(e) => setCompanyField('email', e.target.value)} /></div>
            <div><label className="form-label">Primary Phone</label><input className="form-control" value={company.phone_primary} onChange={(e) => setCompanyField('phone_primary', e.target.value)} /></div>
            <div><label className="form-label">Secondary Phone</label><input className="form-control" value={company.phone_secondary} onChange={(e) => setCompanyField('phone_secondary', e.target.value)} /></div>
            <div className="full-width"><label className="form-label">Address</label><input className="form-control" value={company.address_full} onChange={(e) => setCompanyField('address_full', e.target.value)} /></div>
            <div><label className="form-label">Working Days</label><input className="form-control" value={company.hours_days} onChange={(e) => setCompanyField('hours_days', e.target.value)} /></div>
            <div><label className="form-label">Working Hours</label><input className="form-control" value={company.hours_time} onChange={(e) => setCompanyField('hours_time', e.target.value)} /></div>
          </div>
          <button type="button" className="btn btn-primary mt-3" onClick={saveCompany} disabled={saving}>
            {saving ? 'Saving…' : 'Save Company Info'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsAdminPage;
