const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const {
  serializeClientPublic,
  serializeClientAdmin,
} = require('../utils/serializers');
const {
  validate,
  clientCreateSchema,
  clientUpdateSchema,
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

const listClients = asyncHandler(async (req, res) => {
  const featured = parseQueryBool(req.query.featured);
  const { category } = req.query;

  const where = { is_active: true };
  if (category && category !== 'all') where.category = category;
  if (featured !== undefined) where.featured = featured;

  const items = await prisma.client.findMany({
    where,
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });

  res.json(items.map(serializeClientPublic));
});

const adminListClients = asyncHandler(async (req, res) => {
  const items = await prisma.client.findMany({
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  });
  res.json(items.map(serializeClientAdmin));
});

const createClient = asyncHandler(async (req, res) => {
  const payload = validate(clientCreateSchema, req.body);
  const client = await prisma.client.create({ data: payload });
  res.status(201).json(serializeClientAdmin(client));
});

const updateClient = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const client = await prisma.client.findFirst({ where: { id: itemId } });
  if (!client) throw new AppError(404, 'Client not found');

  const parsed = validate(clientUpdateSchema, req.body);
  const data = pickBodyKeys(parsed, req.body);

  const updated = await prisma.client.update({
    where: { id: itemId },
    data,
  });
  res.json(serializeClientAdmin(updated));
});

const deleteClient = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.item_id);
  const client = await prisma.client.findFirst({ where: { id: itemId } });
  if (!client) throw new AppError(404, 'Client not found');
  await prisma.client.delete({ where: { id: itemId } });
  res.status(204).send();
});

module.exports = {
  listClients,
  adminListClients,
  createClient,
  updateClient,
  deleteClient,
};
