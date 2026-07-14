const prisma = require('../prisma/client');

async function getOrCreateSettings() {
  let row = await prisma.siteSettings.findFirst();
  if (row) return row;

  row = await prisma.siteSettings.create({
    data: {
      map_embed_url: '',
      social_links: {},
      seo_defaults: {},
    },
  });
  return row;
}

module.exports = {
  getOrCreateSettings,
};
