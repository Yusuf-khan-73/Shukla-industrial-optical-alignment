const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const settings = require('../config/settings');
const { AppError } = require('./errorHandler');

function extractBearer(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

async function authenticate(req, res, next) {
  try {
    const token = extractBearer(req);
    if (!token) {
      throw new AppError(401, 'Not authenticated');
    }

    let payload;
    try {
      payload = jwt.verify(token, settings.secretKey, {
        algorithms: [settings.algorithm],
      });
    } catch {
      throw new AppError(401, 'Invalid token');
    }

    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) {
      throw new AppError(401, 'Invalid token');
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, is_active: true },
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticate, extractBearer };
