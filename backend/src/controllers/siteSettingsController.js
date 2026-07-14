const { asyncHandler } = require('../middleware/errorHandler');
const {
  serializeSiteSettingsPublic,
  serializeSiteSettingsAdmin,
} = require('../utils/serializers');
const { validate, siteSettingsUpdateSchema } = require('../validators');
const { getOrCreateSettings } = require('../services/siteSettingsService');
const prisma = require('../prisma/client');

function pickBodyKeys(parsed, body) {
  const data = {};
  for (const key of Object.keys(body || {})) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      data[key] = parsed[key];
    }
  }
  return data;
}

const getSiteSettings = asyncHandler(async (req, res) => {
  const row = await getOrCreateSettings();
  res.json(serializeSiteSettingsPublic(row));
});

const updateSiteSettings = asyncHandler(async (req, res) => {
  const settingsRow = await getOrCreateSettings();
  const parsed = validate(siteSettingsUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);

  const updated = await prisma.siteSettings.update({
    where: { id: settingsRow.id },
    data,
  });

  res.json(serializeSiteSettingsAdmin(updated));
});

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};
