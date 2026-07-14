function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toCamelKeys(obj) {
  if (Array.isArray(obj)) return obj.map(toCamelKeys);
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj;

  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    out[snakeToCamel(key)] = toCamelKeys(value);
  }
  return out;
}

function mapImages(images = []) {
  return [...images]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => ({
      url: img.image_url,
      alt: img.alt_text || '',
    }));
}

function serializeProject(project, { admin = false } = {}) {
  const data = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    client: project.client,
    location: project.location,
    industry: project.industry,
    industryLabel: project.industry_label,
    completionDate: project.completion_date,
    serviceType: project.service_type,
    shortDescription: project.short_description,
    description: project.description,
    featured: project.featured,
    images: mapImages(project.images || []),
  };
  if (admin) {
    data.isActive = project.is_active;
    data.sortOrder = project.sort_order;
  }
  return data;
}

function serializeGallery(item, { admin = false } = {}) {
  const images = mapImages(item.images || []);
  const data = {
    id: item.id,
    title: item.title,
    company: item.company,
    location: item.location,
    date: item.date,
    category: item.category,
    categoryLabel: item.category_label,
    description: item.description,
    featured: item.featured,
    updatedAt: item.updated_at,
    image: null,
    images,
  };
  if (images.length) {
    data.image = { url: images[0].url, alt: images[0].alt || '' };
  }
  if (admin) {
    data.isActive = item.is_active;
    data.sortOrder = item.sort_order;
  }
  return data;
}

function serializeServicePublic(service) {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    shortDescription: service.short_description,
    description: service.description,
    icon: service.icon,
    benefits: service.benefits || [],
    faqs: service.faqs || [],
    imageUrl: service.image_url,
    images: mapImages(service.images || []),
  };
}

function serializeClientPublic(client) {
  return {
    id: client.id,
    name: client.name,
    initials: client.initials,
    category: client.category,
    categoryLabel: client.category_label,
    logoUrl: client.logo_url,
    website: client.website,
    featured: client.featured,
  };
}

function serializeClientAdmin(client) {
  return {
    id: client.id,
    name: client.name,
    initials: client.initials,
    category: client.category,
    category_label: client.category_label,
    logo_url: client.logo_url,
    website: client.website,
    featured: client.featured,
    is_active: client.is_active,
    sort_order: client.sort_order,
  };
}

function serializeTestimonialPublic(item) {
  return {
    id: item.id,
    name: item.name,
    designation: item.designation,
    company: item.company,
    quote: item.quote,
    rating: item.rating,
    initials: item.initials,
    featured: item.featured,
  };
}

function serializeTestimonialAdmin(item) {
  return {
    id: item.id,
    name: item.name,
    designation: item.designation,
    company: item.company,
    quote: item.quote,
    rating: item.rating,
    initials: item.initials,
    featured: item.featured,
    is_active: item.is_active,
    sort_order: item.sort_order,
  };
}

function serializeHeroPublic(slide) {
  return {
    id: slide.id,
    imageUrl: slide.image_url,
    altText: slide.alt_text,
    caption: slide.caption,
    sortOrder: slide.sort_order,
  };
}

function serializeHeroAdmin(slide) {
  return {
    id: slide.id,
    image_url: slide.image_url,
    alt_text: slide.alt_text,
    caption: slide.caption,
    sort_order: slide.sort_order,
    is_active: slide.is_active,
  };
}

function serializeServiceAdmin(service) {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    short_description: service.short_description,
    description: service.description,
    icon: service.icon,
    benefits: service.benefits || [],
    faqs: service.faqs || [],
    image_url: service.image_url,
    images: mapImages(service.images || []),
    is_active: service.is_active,
    sort_order: service.sort_order,
  };
}

function serializeCompanyPublic(company) {
  // CamelCase matches FastAPI PUBLIC_CONFIG; snake aliases help dual-read frontends.
  return {
    companyName: company.company_name,
    company_name: company.company_name,
    tagline: company.tagline,
    description: company.description,
    logo: company.logo || '',
    phone1: company.phone_1 || '',
    phone2: company.phone_2 || '',
    phone_1: company.phone_1 || '',
    phone_2: company.phone_2 || '',
    phones: company.phones || [],
    email: company.email,
    whatsappNumber: company.whatsapp_number || '',
    whatsapp_number: company.whatsapp_number || '',
    officeAddress: company.office_address || '',
    office_address: company.office_address || '',
    googleMapUrl: company.google_map_url || '',
    google_map_url: company.google_map_url || '',
    facebook: company.facebook || '',
    instagram: company.instagram || '',
    linkedin: company.linkedin || '',
    youtube: company.youtube || '',
    address: company.address || {},
    workingHours: company.working_hours || {},
    working_hours: company.working_hours || {},
    stats: company.stats || [],
  };
}

function serializeCompanyAdmin(company) {
  return {
    id: company.id,
    company_name: company.company_name,
    tagline: company.tagline,
    description: company.description,
    logo: company.logo || '',
    phone_1: company.phone_1 || '',
    phone_2: company.phone_2 || '',
    phones: company.phones || [],
    email: company.email,
    admin_login_email: company.admin_login_email,
    whatsapp_number: company.whatsapp_number || '',
    office_address: company.office_address || '',
    google_map_url: company.google_map_url || '',
    facebook: company.facebook || '',
    instagram: company.instagram || '',
    linkedin: company.linkedin || '',
    youtube: company.youtube || '',
    address: company.address || {},
    working_hours: company.working_hours || {},
    stats: company.stats || [],
  };
}

function serializeSiteSettingsPublic(row) {
  return {
    mapEmbedUrl: row.map_embed_url || '',
    socialLinks: row.social_links || {},
    seoDefaults: row.seo_defaults || {},
  };
}

function serializeSiteSettingsAdmin(row) {
  return {
    id: row.id,
    map_embed_url: row.map_embed_url || '',
    social_links: row.social_links || {},
    seo_defaults: row.seo_defaults || {},
  };
}

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    secondary_email: user.secondary_email || '',
    full_name: user.full_name,
    phone: user.phone || '',
    profile_picture: user.profile_picture || '',
    is_active: user.is_active,
    is_superuser: user.is_superuser,
  };
}

function serializeContactAdmin(msg) {
  return {
    id: msg.id,
    name: msg.name,
    phone: msg.phone,
    email: msg.email,
    company_name: msg.company_name,
    city: msg.city,
    service_required: msg.service_required,
    message: msg.message,
    is_read: msg.is_read,
    created_at: msg.created_at,
    inquiry_number: msg.inquiry_number,
    admin_email_sent: msg.admin_email_sent,
    customer_email_sent: msg.customer_email_sent,
  };
}

module.exports = {
  toCamelKeys,
  serializeProject,
  serializeGallery,
  serializeServicePublic,
  serializeServiceAdmin,
  serializeClientPublic,
  serializeClientAdmin,
  serializeTestimonialPublic,
  serializeTestimonialAdmin,
  serializeHeroPublic,
  serializeHeroAdmin,
  serializeCompanyPublic,
  serializeCompanyAdmin,
  serializeSiteSettingsPublic,
  serializeSiteSettingsAdmin,
  serializeUser,
  serializeContactAdmin,
};
