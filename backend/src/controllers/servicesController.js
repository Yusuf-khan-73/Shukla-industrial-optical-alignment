const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const {
  serializeServicePublic,
  serializeServiceAdmin,
} = require('../utils/serializers');
const {
  validate,
  serviceCreateSchema,
  serviceUpdateSchema,
} = require('../validators');

const imageInclude = { images: { orderBy: { sort_order: 'asc' } } };

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

const listServices = asyncHandler(async (req, res) => {
  const items = await prisma.service.findMany({
    where: { is_active: true },
    include: imageInclude,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map(serializeServicePublic));
});

const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await prisma.service.findFirst({
    where: { slug: req.params.slug, is_active: true },
    include: imageInclude,
  });
  if (!service) throw new AppError(404, 'Service not found');
  res.json(serializeServicePublic(service));
});

const adminListServices = asyncHandler(async (req, res) => {
  const items = await prisma.service.findMany({
    include: imageInclude,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map(serializeServiceAdmin));
});

const createService = asyncHandler(async (req, res) => {
  const payload = validate(serviceCreateSchema, req.body);

  const existing = await prisma.service.findFirst({ where: { slug: payload.slug } });
  if (existing) throw new AppError(400, 'Slug already exists');

  const { images, ...rest } = payload;
  const service = await prisma.service.create({
    data: {
      ...rest,
      images: { create: mapImageCreates(images) },
    },
    include: imageInclude,
  });

  res.status(201).json(serializeServiceAdmin(service));
});

const updateService = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const service = await prisma.service.findFirst({ where: { id: itemId } });
  if (!service) throw new AppError(404, 'Service not found');

  const parsed = validate(serviceUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);
  const images = Object.prototype.hasOwnProperty.call(data, 'images')
    ? data.images
    : undefined;
  delete data.images;

  if (images !== undefined) {
    await prisma.serviceImage.deleteMany({ where: { service_id: itemId } });
  }

  const updated = await prisma.service.update({
    where: { id: itemId },
    data: {
      ...data,
      ...(images !== undefined ? { images: { create: mapImageCreates(images) } } : {}),
    },
    include: imageInclude,
  });

  res.json(serializeServiceAdmin(updated));
});

const deleteService = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const service = await prisma.service.findFirst({ where: { id: itemId } });
  if (!service) throw new AppError(404, 'Service not found');
  await prisma.service.delete({ where: { id: itemId } });
  res.status(204).send();
});

module.exports = {
  listServices,
  getServiceBySlug,
  adminListServices,
  createService,
  updateService,
  deleteService,
};
