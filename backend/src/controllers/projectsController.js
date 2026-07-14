const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const { serializeProject } = require('../utils/serializers');
const {
  validate,
  projectCreateSchema,
  projectUpdateSchema,
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

function normalizeCompletionDate(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return value instanceof Date ? value : new Date(value);
}

const listProjects = asyncHandler(async (req, res) => {
  const featured = parseQueryBool(req.query.featured);
  const { industry } = req.query;

  const where = { is_active: true };
  if (featured !== undefined) where.featured = featured;
  if (industry && industry !== 'all') where.industry = industry;

  const items = await prisma.project.findMany({
    where,
    include: imageInclude,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });

  res.json(items.map((p) => serializeProject(p)));
});

const getProject = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const project = await prisma.project.findFirst({
    where: { id: itemId, is_active: true },
    include: imageInclude,
  });
  if (!project) throw new AppError(404, 'Project not found');
  res.json(serializeProject(project));
});

const adminListProjects = asyncHandler(async (req, res) => {
  const items = await prisma.project.findMany({
    include: imageInclude,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map((p) => serializeProject(p, { admin: true })));
});

const createProject = asyncHandler(async (req, res) => {
  const payload = validate(projectCreateSchema, req.body);

  const existing = await prisma.project.findFirst({ where: { slug: payload.slug } });
  if (existing) throw new AppError(400, 'Slug already exists');

  const { images, completion_date, ...rest } = payload;
  const project = await prisma.project.create({
    data: {
      ...rest,
      completion_date: normalizeCompletionDate(completion_date),
      images: { create: mapImageCreates(images) },
    },
    include: imageInclude,
  });

  res.status(201).json(serializeProject(project, { admin: true }));
});

const updateProject = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const project = await prisma.project.findFirst({ where: { id: itemId } });
  if (!project) throw new AppError(404, 'Project not found');

  const parsed = validate(projectUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);
  const images = Object.prototype.hasOwnProperty.call(data, 'images')
    ? data.images
    : undefined;
  delete data.images;

  if (Object.prototype.hasOwnProperty.call(data, 'completion_date')) {
    data.completion_date = normalizeCompletionDate(data.completion_date);
  }

  if (images !== undefined) {
    await prisma.projectImage.deleteMany({ where: { project_id: itemId } });
  }

  const updated = await prisma.project.update({
    where: { id: itemId },
    data: {
      ...data,
      ...(images !== undefined ? { images: { create: mapImageCreates(images) } } : {}),
    },
    include: imageInclude,
  });

  res.json(serializeProject(updated, { admin: true }));
});

const deleteProject = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const project = await prisma.project.findFirst({ where: { id: itemId } });
  if (!project) throw new AppError(404, 'Project not found');
  await prisma.project.delete({ where: { id: itemId } });
  res.status(204).send();
});

module.exports = {
  listProjects,
  getProject,
  adminListProjects,
  createProject,
  updateProject,
  deleteProject,
};
