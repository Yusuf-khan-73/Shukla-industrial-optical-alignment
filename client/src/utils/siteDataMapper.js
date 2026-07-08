/**
 * Maps API company-info + site-settings into frontend context shapes.
 * Location: client/src/utils/siteDataMapper.js
 */
import {
  COMPANY,
  CONTACT,
  SOCIAL_LINKS,
  MAP_EMBED_URL,
  MAP_LINK,
  OFFICE_ADDRESS,
  SEO_DEFAULT,
} from '@utils/constants';

const buildMapLink = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const buildMapEmbedUrl = (address) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=en&z=16&output=embed`;

const WHATSAPP_MESSAGE =
  'Hello,\nI visited your website and would like to know more about your Industrial Optical Alignment Services.';

const EMAIL_SUBJECT = 'Industrial Optical Alignment Inquiry';
const EMAIL_BODY =
  'Hello,\n\nI visited your website and would like to know more about your Industrial Optical Alignment Services.\n\nPlease contact me.\n\nThank You.';

const digitsOnly = (phone) => (phone || '').replace(/\D/g, '');

const buildTel = (phone) => {
  const digits = digitsOnly(phone);
  return digits ? `tel:+${digits}` : '';
};

const buildWhatsAppUrl = (phone, message = WHATSAPP_MESSAGE) => {
  const digits = digitsOnly(phone);
  if (!digits) return CONTACT.whatsapp.fullUrl;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

const buildMailto = (email) => {
  if (!email) return CONTACT.emailMailto;
  const params = new URLSearchParams({
    subject: EMAIL_SUBJECT,
    body: EMAIL_BODY,
  });
  return `mailto:${email}?${params.toString()}`;
};

const resolvePhones = (company) => {
  const fromFlat = [company.phone_1, company.phone_2].filter(Boolean);
  if (fromFlat.length) return fromFlat;
  if (Array.isArray(company.phones) && company.phones.length) return company.phones;
  return CONTACT.phones;
};

const resolveAddress = (company) => {
  if (company.office_address) {
    return { full: company.office_address, line1: company.office_address, country: 'India' };
  }
  if (company.address?.full) return company.address;
  if (company.address?.line1) {
    return { ...company.address, full: company.address.full || company.address.line1 };
  }
  return CONTACT.address;
};

const resolveWorkingHours = (company) => {
  const hours = company.working_hours || company.workingHours || {};
  const days = (hours.days || '').trim();
  const time = (hours.time || '').trim();
  const emergency = (hours.emergency || '').trim();

  return {
    days,
    time,
    emergency,
    hasHours: Boolean(days || time || emergency),
  };
};

const resolveWhatsappDigits = (company, phones) => {
  if (company.whatsapp_number) return digitsOnly(company.whatsapp_number);
  return digitsOnly(phones[0]) || CONTACT.phoneRaw[0];
};

export const mapCompanyToContext = (apiCompany = {}) => {
  const phones = resolvePhones(apiCompany);
  const whatsappDigits = resolveWhatsappDigits(apiCompany, phones);
  const email = apiCompany.email || CONTACT.email;
  const address = resolveAddress(apiCompany);
  const workingHours = resolveWorkingHours(apiCompany);

  return {
    company: {
      name: apiCompany.company_name || apiCompany.companyName || COMPANY.name,
      shortName: COMPANY.shortName,
      tagline: apiCompany.tagline || COMPANY.tagline,
      experience: COMPANY.experience,
      experienceLabel: COMPANY.experienceLabel,
      description: apiCompany.description || COMPANY.description,
      foundedYear: COMPANY.foundedYear,
      logo: apiCompany.logo || null,
      stats: apiCompany.stats?.length ? apiCompany.stats : null,
    },
    contact: {
      phones,
      phoneRaw: phones.map(digitsOnly),
      primaryPhone: phones[0] || CONTACT.primaryPhone,
      primaryPhoneTel: buildTel(phones[0]) || CONTACT.primaryPhoneTel,
      secondaryPhoneTel: buildTel(phones[1]) || CONTACT.secondaryPhoneTel,
      email,
      emailMailto: buildMailto(email),
      whatsapp: {
        url: `https://wa.me/${whatsappDigits}`,
        message: WHATSAPP_MESSAGE,
        fullUrl: buildWhatsAppUrl(whatsappDigits),
      },
      workingHours,
      address,
    },
  };
};

export const mapSiteSettingsToContext = (apiSettings = {}) => {
  const social = apiSettings.social_links || apiSettings.socialLinks || {};
  const seo = apiSettings.seo_defaults || apiSettings.seoDefaults || {};
  const mapEmbedUrl =
    apiSettings.map_embed_url || apiSettings.mapEmbedUrl || MAP_EMBED_URL;

  return {
    social: {
      whatsapp: social.whatsapp || SOCIAL_LINKS.whatsapp,
      facebook: social.facebook || SOCIAL_LINKS.facebook,
      instagram: social.instagram || SOCIAL_LINKS.instagram,
      linkedin: social.linkedin || SOCIAL_LINKS.linkedin,
      youtube: social.youtube || SOCIAL_LINKS.youtube,
    },
    mapEmbedUrl,
    mapLink: MAP_LINK,
    seo: {
      title: seo.title || SEO_DEFAULT.title,
      description: seo.description || SEO_DEFAULT.description,
      keywords: seo.keywords || SEO_DEFAULT.keywords,
      siteUrl: SEO_DEFAULT.siteUrl,
    },
  };
};

export const mergeSiteData = (companyData, siteData) => {
  const companyMapped = mapCompanyToContext(companyData);
  const siteMapped = mapSiteSettingsToContext(siteData);

  const whatsappFromSocial = siteMapped.social.whatsapp;
  if (whatsappFromSocial && whatsappFromSocial !== '#') {
    const digits = digitsOnly(whatsappFromSocial.replace(/.*wa\.me\//, ''));
    if (digits) {
      companyMapped.contact.whatsapp = {
        url: `https://wa.me/${digits}`,
        message: WHATSAPP_MESSAGE,
        fullUrl: buildWhatsAppUrl(digits),
      };
    }
  }

  if (companyData?.google_map_url || companyData?.googleMapUrl) {
    siteMapped.mapEmbedUrl = companyData.google_map_url || companyData.googleMapUrl;
    siteMapped.mapLink = MAP_LINK;
  } else if (companyData?.office_address || companyData?.officeAddress) {
    const addr = companyData.office_address || companyData.officeAddress;
    siteMapped.mapEmbedUrl = buildMapEmbedUrl(addr);
    siteMapped.mapLink = buildMapLink(addr);
  } else if (companyMapped.contact?.address?.full) {
    siteMapped.mapEmbedUrl = buildMapEmbedUrl(companyMapped.contact.address.full);
    siteMapped.mapLink = buildMapLink(companyMapped.contact.address.full);
  }

  const socialFromCompany = {
    facebook: companyData?.facebook,
    instagram: companyData?.instagram,
    linkedin: companyData?.linkedin,
    youtube: companyData?.youtube,
  };
  Object.entries(socialFromCompany).forEach(([key, value]) => {
    if (value) siteMapped.social[key] = value;
  });

  return {
    ...companyMapped,
    ...siteMapped,
  };
};
