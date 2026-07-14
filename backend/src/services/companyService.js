const prisma = require('../prisma/client');
const { AppError } = require('../middleware/errorHandler');
const {
  DEFAULT_ADMIN_LOGIN_EMAIL,
  DEFAULT_COMPANY_NAME,
  DEFAULT_PUBLIC_EMAIL,
  normalizeEmail,
  syncUserEmailFromAdminLogin,
} = require('./adminLogin');

function syncCompanyFields(company) {
  const phones = [company.phone_1, company.phone_2].filter(Boolean);
  if (phones.length) {
    company.phones = phones;
  } else if (Array.isArray(company.phones) && company.phones.length) {
    company.phone_1 = company.phones[0] || '';
    company.phone_2 = company.phones[1] || '';
  }

  if (company.office_address) {
    company.address = {
      ...(company.address || {}),
      full: company.office_address,
      line1: company.office_address,
      country: (company.address && company.address.country) || 'India',
    };
  } else if (company.address && company.address.full) {
    company.office_address = company.address.full;
  }

  if (!company.whatsapp_number && company.phone_1) {
    company.whatsapp_number = String(company.phone_1).replace(/\D/g, '');
  }

  return company;
}

async function getOrCreateCompany() {
  let company = await prisma.companyInformation.findFirst();

  if (company) {
    if (!company.admin_login_email) {
      company = await prisma.companyInformation.update({
        where: { id: company.id },
        data: { admin_login_email: DEFAULT_ADMIN_LOGIN_EMAIL },
      });
    }
    return syncCompanyFields({ ...company });
  }

  company = await prisma.companyInformation.create({
    data: {
      company_name: DEFAULT_COMPANY_NAME,
      tagline: 'Precision • Accuracy • Reliability',
      description: '',
      phone_1: '+91 9510900608',
      phone_2: '+91 8707305703',
      phones: ['+91 9510900608', '+91 8707305703'],
      email: DEFAULT_PUBLIC_EMAIL,
      admin_login_email: DEFAULT_ADMIN_LOGIN_EMAIL,
      whatsapp_number: '919510900608',
    },
  });

  return company;
}

async function updateCompany(payload) {
  const company = await getOrCreateCompany();
  const data = { ...payload };
  const previousAdminEmail = company.admin_login_email;

  if ('phone_1' in data || 'phone_2' in data) {
    const p1 = Object.prototype.hasOwnProperty.call(data, 'phone_1')
      ? data.phone_1
      : company.phone_1;
    const p2 = Object.prototype.hasOwnProperty.call(data, 'phone_2')
      ? data.phone_2
      : company.phone_2;
    data.phones = [p1, p2].filter(Boolean);
  }

  if ('office_address' in data && data.office_address) {
    data.address = {
      ...(company.address || {}),
      full: data.office_address,
      line1: data.office_address,
      country: 'India',
    };
  }

  if ('admin_login_email' in data) {
    const newAdminEmail = normalizeEmail(String(data.admin_login_email || ''));
    if (!newAdminEmail) {
      throw new AppError(422, 'Admin Login Email Address is required.');
    }
    data.admin_login_email = newAdminEmail;

    try {
      await syncUserEmailFromAdminLogin(previousAdminEmail, newAdminEmail);
    } catch (err) {
      throw new AppError(400, err.message || String(err));
    }
  }

  if ('email' in data && data.email != null) {
    data.email = normalizeEmail(String(data.email));
  }

  const merged = syncCompanyFields({ ...company, ...data });

  return prisma.companyInformation.update({
    where: { id: company.id },
    data: {
      ...data,
      phones: merged.phones,
      address: merged.address,
      office_address: merged.office_address,
      whatsapp_number: merged.whatsapp_number,
      phone_1: merged.phone_1,
      phone_2: merged.phone_2,
    },
  });
}

module.exports = {
  syncCompanyFields,
  getOrCreateCompany,
  updateCompany,
};
