const path = require('path');

// Local (`npm run dev`): .env overrides shell. On Vercel, platform env wins;
// missing keys can still be filled from .env during `vercel dev`.
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
  override: !process.env.VERCEL,
});

function parseList(value = '') {
  return String(value)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function toBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

const settings = {
  appName: process.env.APP_NAME || 'Shukla Industrial Optical Alignment API',
  appEnv: process.env.APP_ENV || 'development',
  debug: toBool(process.env.DEBUG, true),
  apiV1Prefix: process.env.API_V1_PREFIX || '/api/v1',
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 8001),
  databaseUrl: process.env.DATABASE_URL || '',
  secretKey: process.env.SECRET_KEY || '',
  algorithm: process.env.ALGORITHM || 'HS256',
  accessTokenExpireMinutes: Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 60),
  corsOrigins: parseList(process.env.CORS_ORIGINS || ''),
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 10),
  allowedImageTypes: parseList(
    process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif'
  ),
  allowedImageTypesRaw:
    process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
  passwordResetExpireMinutes: Number(process.env.PASSWORD_RESET_EXPIRE_MINUTES || 15),
  passwordResetPath: process.env.PASSWORD_RESET_PATH || '/reset-password',
  adminDashboardPath: process.env.ADMIN_DASHBOARD_PATH || '/admin',
  companyName:
    process.env.COMPANY_NAME || 'SHUKLA INDUSTRIAL OPTICAL ALIGNMENT',
  companyPhone: process.env.COMPANY_PHONE || '+91 9510900608',
  companyEmail: process.env.COMPANY_EMAIL || '',
  companyWebsite: process.env.COMPANY_WEBSITE || 'www.shuklaalignment.com',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USERNAME || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  smtpFromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_FROM || '',
  smtpFromName: process.env.SMTP_FROM_NAME || '',
  smtpUseTls: toBool(process.env.SMTP_USE_TLS, true),
  smtpUseSsl: toBool(process.env.SMTP_USE_SSL, false),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 300),
};

Object.defineProperty(settings, 'passwordResetUrlBase', {
  get() {
    return `${this.frontendUrl}${this.passwordResetPath}`;
  },
});

Object.defineProperty(settings, 'adminDashboardUrl', {
  get() {
    return `${this.frontendUrl}${this.adminDashboardPath}`;
  },
});

module.exports = settings;
