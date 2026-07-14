const { asyncHandler } = require('../middleware/errorHandler');
const {
  serializeCompanyPublic,
  serializeCompanyAdmin,
} = require('../utils/serializers');
const { validate, companyUpdateSchema } = require('../validators');
const {
  getOrCreateCompany,
  updateCompany,
} = require('../services/companyService');

function pickBodyKeys(parsed, body) {
  const data = {};
  for (const key of Object.keys(body || {})) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      data[key] = parsed[key];
    }
  }
  return data;
}

const getCompanyInfo = asyncHandler(async (req, res) => {
  const company = await getOrCreateCompany();
  res.json(serializeCompanyPublic(company));
});

const getAdminCompanyInfo = asyncHandler(async (req, res) => {
  const company = await getOrCreateCompany();
  res.json(serializeCompanyAdmin(company));
});

const updateCompanyInfo = asyncHandler(async (req, res) => {
  const parsed = validate(companyUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);
  const company = await updateCompany(data);
  res.json(serializeCompanyAdmin(company));
});

module.exports = {
  getCompanyInfo,
  getAdminCompanyInfo,
  updateCompanyInfo,
};
