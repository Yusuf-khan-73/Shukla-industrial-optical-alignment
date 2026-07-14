const prisma = require('../prisma/client');
const settings = require('../config/settings');

const DEFAULT_PUBLIC_EMAIL = settings.companyEmail || 'info@example.com';
const DEFAULT_ADMIN_LOGIN_EMAIL = settings.adminEmail || 'admin@example.com';
const DEFAULT_COMPANY_NAME = 'SHUKLA INDUSTRIAL OPTICAL ALIGNMENT';

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

async function getCompanyRecord() {
  return prisma.companyInformation.findFirst();
}

async function getAdminLoginEmail() {
  const company = await getCompanyRecord();
  if (!company || !company.admin_login_email) return null;
  return normalizeEmail(company.admin_login_email);
}

async function findAdminUserByLoginEmail(email) {
  const requested = normalizeEmail(email);
  if (!requested) return null;

  const adminLogin = await getAdminLoginEmail();
  if (!adminLogin || requested !== adminLogin) return null;

  return prisma.user.findFirst({
    where: {
      email: {
        equals: adminLogin,
        mode: 'insensitive',
      },
    },
  });
}

async function syncUserEmailFromAdminLogin(previousEmail, newEmail) {
  const previous = normalizeEmail(previousEmail);
  const next = normalizeEmail(newEmail);
  if (!next) return null;

  if (previous === next) {
    return prisma.user.findFirst({
      where: { email: { equals: next, mode: 'insensitive' } },
    });
  }

  let user = await prisma.user.findFirst({
    where: { email: { equals: previous, mode: 'insensitive' } },
  });

  if (!user) {
    user = await prisma.user.findFirst({
      where: { is_superuser: true },
      orderBy: { id: 'asc' },
    });
  }

  if (!user) return null;

  const conflict = await prisma.user.findFirst({
    where: {
      email: { equals: next, mode: 'insensitive' },
      id: { not: user.id },
    },
  });

  if (conflict) {
    throw new Error('Admin login email is already in use by another account.');
  }

  return prisma.user.update({
    where: { id: user.id },
    data: { email: next },
  });
}

module.exports = {
  DEFAULT_PUBLIC_EMAIL,
  DEFAULT_ADMIN_LOGIN_EMAIL,
  DEFAULT_COMPANY_NAME,
  normalizeEmail,
  getCompanyRecord,
  getAdminLoginEmail,
  findAdminUserByLoginEmail,
  syncUserEmailFromAdminLogin,
};
