const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const { serializeGallery } = require('../utils/serializers');
const {
  validate,
  galleryCreateSchema,
  galleryUpdateSchema,
} = require('../validators');

const imageInclude = { images: { orderBy: { sort_order: 'asc' } } };

function parseQueryBool(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

function pickBodyKeys(parsed, body) {
  const data = {};
  for (const key of Object.keys(body || {})) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      data[key] = parsed[key];
    }
  }
  return data;
}

function mapImageCreates(images = []) {
  return images.map((img, idx) => ({
    image_url: img.image_url,
    alt_text: img.alt_text || '',
    sort_order: img.sort_order ?? idx,
  }));
}

const listGallery = asyncHandler(async (req, res) => {
  const featured = parseQueryBool(req.query.featured);
  const { category } = req.query;

  const where = { is_active: true };
  if (featured !== undefined) where.featured = featured;
  if (category && category !== 'all') where.category = category;

  const items = await prisma.gallery.findMany({
    where,
    include: imageInclude,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });

  res.json(items.map((g) => serializeGallery(g)));
});

const getGalleryItem = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const item = await prisma.gallery.findFirst({
    where: { id: itemId, is_active: true },
    include: imageInclude,
  });
  if (!item) throw new AppError(404, 'Gallery item not found');
  res.json(serializeGallery(item));
});

const adminListGallery = asyncHandler(async (req, res) => {
  const items = await prisma.gallery.findMany({
    include: imageInclude,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map((g) => serializeGallery(g, { admin: true })));
});

const createGallery = asyncHandler(async (req, res) => {
  const payload = validate(galleryCreateSchema, req.body);
  const { images, ...rest } = payload;

  const item = await prisma.gallery.create({
    data: {
      ...rest,
      images: { create: mapImageCreates(images) },
    },
    include: imageInclude,
  });

  res.status(201).json(serializeGallery(item, { admin: true }));
});

const updateGallery = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const item = await prisma.gallery.findFirst({ where: { id: itemId } });
  if (!item) throw new AppError(404, 'Gallery item not found');

  const parsed = validate(galleryUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);
  const images = Object.prototype.hasOwnProperty.call(data, 'images')
    ? data.images
    : undefined;
  delete data.images;

  if (images !== undefined) {
    await prisma.galleryImage.deleteMany({ where: { gallery_id: itemId } });
  }

  const updated = await prisma.gallery.update({
    where: { id: itemId },
    data: {
      ...data,
      ...(images !== undefined ? { images: { create: mapImageCreates(images) } } : {}),
    },
    include: imageInclude,
  });

  res.json(serializeGallery(updated, { admin: true }));
});

const deleteGallery = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const item = await prisma.gallery.findFirst({ where: { id: itemId } });
  if (!item) throw new AppError(404, 'Gallery item not found');
  await prisma.gallery.delete({ where: { id: itemId } });
  res.status(204).send();
});

module.exports = {
  listGallery,
  getGalleryItem,
  adminListGallery,
  createGallery,
  updateGallery,
  deleteGallery,
};
