const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const {
  serializeHeroPublic,
  serializeHeroAdmin,
} = require('../utils/serializers');
const {
  validate,
  heroCreateSchema,
  heroUpdateSchema,
} = require('../validators');

function pickBodyKeys(parsed, body) {
  const data = {};
  for (const key of Object.keys(body || {})) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      data[key] = parsed[key];
    }
  }
  return data;
}

const listHeroSlides = asyncHandler(async (req, res) => {
  const items = await prisma.heroSlide.findMany({
    where: { is_active: true },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map(serializeHeroPublic));
});

const adminListHeroSlides = asyncHandler(async (req, res) => {
  const items = await prisma.heroSlide.findMany({
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map(serializeHeroAdmin));
});

const createHeroSlide = asyncHandler(async (req, res) => {
  const payload = validate(heroCreateSchema, req.body);
  const slide = await prisma.heroSlide.create({ data: payload });
  res.status(201).json(serializeHeroAdmin(slide));
});

const updateHeroSlide = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const slide = await prisma.heroSlide.findFirst({ where: { id: itemId } });
  if (!slide) throw new AppError(404, 'Hero slide not found');

  const parsed = validate(heroUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);

  const updated = await prisma.heroSlide.update({
    where: { id: itemId },
    data,
  });
  res.json(serializeHeroAdmin(updated));
});

const deleteHeroSlide = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const slide = await prisma.heroSlide.findFirst({ where: { id: itemId } });
  if (!slide) throw new AppError(404, 'Hero slide not found');
  await prisma.heroSlide.delete({ where: { id: itemId } });
  res.status(204).send();
});

module.exports = {
  listHeroSlides,
  adminListHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
