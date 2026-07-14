const { asyncHandler } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');

const healthCheck = asyncHandler(async (req, res) => {
  let dbStatus = 'healthy';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'unavailable';
  }

  res.json({
    status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
    service: 'shukla-industrial-api',
    database: dbStatus,
  });
});

module.exports = {
  healthCheck,
};
