const { asyncHandler } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');

const healthCheck = asyncHandler(async (req, res) => {
  let dbStatus = 'healthy';
  let dbError = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'unavailable';
    // Surface full Prisma error for ops/logs (never include DATABASE_URL / password).
    dbError = {
      name: err?.name || 'Error',
      code: err?.code || null,
      message: err?.message || String(err),
      meta: err?.meta || null,
      clientVersion: err?.clientVersion || null,
    };
    console.error('Health DB check failed:', JSON.stringify(dbError));
  }

  const body = {
    status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
    service: 'shukla-industrial-api',
    database: dbStatus,
  };

  // Only expose error details outside production to avoid leaking internals publicly.
  if (dbError && process.env.APP_ENV !== 'production') {
    body.databaseError = dbError;
  }

  res.json(body);
});

module.exports = {
  healthCheck,
};
