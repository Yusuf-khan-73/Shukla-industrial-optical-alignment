const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const {
  serializeTestimonialPublic,
  serializeTestimonialAdmin,
} = require('../utils/serializers');
const {
  validate,
  testimonialCreateSchema,
  testimonialUpdateSchema,
} = require('../validators');

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

const listTestimonials = asyncHandler(async (req, res) => {
  const featured = parseQueryBool(req.query.featured);
  const where = { is_active: true };
  if (featured !== undefined) where.featured = featured;

  const items = await prisma.testimonial.findMany({
    where,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });

  res.json(items.map(serializeTestimonialPublic));
});

const adminListTestimonials = asyncHandler(async (req, res) => {
  const items = await prisma.testimonial.findMany({
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map(serializeTestimonialAdmin));
});

const createTestimonial = asyncHandler(async (req, res) => {
  const payload = validate(testimonialCreateSchema, req.body);
  const item = await prisma.testimonial.create({ data: payload });
  res.status(201).json(serializeTestimonialAdmin(item));
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const item = await prisma.testimonial.findFirst({ where: { id: itemId } });
  if (!item) throw new AppError(404, 'Testimonial not found');

  const parsed = validate(testimonialUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);

  const updated = await prisma.testimonial.update({
    where: { id: itemId },
    data,
  });
  res.json(serializeTestimonialAdmin(updated));
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const item = await prisma.testimonial.findFirst({ where: { id: itemId } });
  if (!item) throw new AppError(404, 'Testimonial not found');
  await prisma.testimonial.delete({ where: { id: itemId } });
  res.status(204).send();
});

module.exports = {
  listTestimonials,
  adminListTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
