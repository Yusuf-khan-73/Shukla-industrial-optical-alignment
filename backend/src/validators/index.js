const { z } = require('zod');

const PASSWORD_REQUIREMENTS_MSG =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';

const strongPassword = z
  .string()
  .min(8)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    PASSWORD_REQUIREMENTS_MSG
  );

const emailSchema = z.string().email();

const imageInSchema = z.object({
  image_url: z.string().min(1),
  alt_text: z.string().optional().default(''),
  sort_order: z.number().int().optional().default(0),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: strongPassword,
});

const changePasswordSchema = z.object({
  current_password: z.string().min(6),
  new_password: strongPassword,
});

const profileUpdateSchema = z.object({
  full_name: z.string().optional(),
  email: emailSchema.optional(),
  secondary_email: emailSchema.optional().or(z.literal('')).optional(),
  phone: z.string().optional(),
  profile_picture: z.string().optional(),
});

const contactCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: emailSchema,
  company_name: z.string().optional().default(''),
  city: z.string().min(1),
  service_required: z.string().min(1),
  message: z.string().min(10),
});

const contactReadUpdateSchema = z.object({
  is_read: z.boolean(),
});

const projectCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  client: z.string().min(1),
  location: z.string().min(1),
  industry: z.string().min(1),
  industry_label: z.string().min(1),
  completion_date: z.string().nullable().optional(),
  service_type: z.string().min(1),
  short_description: z.string().optional().default(''),
  description: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
  images: z.array(imageInSchema).optional().default([]),
});

const projectUpdateSchema = projectCreateSchema.partial();

const galleryCreateSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  date: z.string().nullable().optional(),
  category: z.string().optional().default('general'),
  category_label: z.string().optional().default('General'),
  description: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
  images: z.array(imageInSchema).optional().default([]),
});

const galleryUpdateSchema = galleryCreateSchema.partial();

const clientCreateSchema = z.object({
  name: z.string().min(1),
  initials: z.string().optional().default(''),
  category: z.string().min(1),
  category_label: z.string().min(1),
  logo_url: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
});

const clientUpdateSchema = clientCreateSchema.partial();

const serviceCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  short_description: z.string().optional().default(''),
  description: z.string().optional().default(''),
  icon: z.string().optional().default('bi-gear'),
  benefits: z.array(z.any()).optional().default([]),
  faqs: z.array(z.any()).optional().default([]),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
  images: z.array(imageInSchema).optional().default([]),
});

const serviceUpdateSchema = serviceCreateSchema.partial();

const testimonialCreateSchema = z.object({
  name: z.string().min(1),
  designation: z.string().optional().default(''),
  company: z.string().min(1),
  quote: z.string().min(1),
  rating: z.number().int().optional().default(5),
  initials: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
});

const testimonialUpdateSchema = testimonialCreateSchema.partial();

const heroCreateSchema = z.object({
  image_url: z.string().min(1),
  alt_text: z.string().optional().default(''),
  caption: z.string().nullable().optional(),
  sort_order: z.number().int().optional().default(0),
  is_active: z.boolean().optional().default(true),
});

const heroUpdateSchema = heroCreateSchema.partial();

const companyUpdateSchema = z.object({
  company_name: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  phone_1: z.string().optional(),
  phone_2: z.string().optional(),
  phones: z.array(z.any()).optional(),
  email: emailSchema.optional().or(z.literal('')).optional(),
  admin_login_email: emailSchema.optional().or(z.literal('')).optional(),
  whatsapp_number: z.string().optional(),
  office_address: z.string().optional(),
  google_map_url: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  address: z.record(z.any()).optional(),
  working_hours: z.record(z.any()).optional(),
  stats: z.array(z.any()).optional(),
});

const siteSettingsUpdateSchema = z.object({
  map_embed_url: z.string().optional(),
  social_links: z.record(z.any()).optional(),
  seo_defaults: z.record(z.any()).optional(),
});

function validate(schema, data) {
  return schema.parse(data);
}

function validatePartial(schema, data) {
  return schema.parse(data);
}

module.exports = {
  PASSWORD_REQUIREMENTS_MSG,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  profileUpdateSchema,
  contactCreateSchema,
  contactReadUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  galleryCreateSchema,
  galleryUpdateSchema,
  clientCreateSchema,
  clientUpdateSchema,
  serviceCreateSchema,
  serviceUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  heroCreateSchema,
  heroUpdateSchema,
  companyUpdateSchema,
  siteSettingsUpdateSchema,
  validate,
  validatePartial,
};
