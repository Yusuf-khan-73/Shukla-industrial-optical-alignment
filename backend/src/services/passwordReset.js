const crypto = require('crypto');
const prisma = require('../prisma/client');
const settings = require('../config/settings');

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

async function cleanupExpiredTokens() {
  const now = new Date();
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      OR: [
        { expires_at: { lt: now } },
        { used: true },
        { used_at: { not: null } },
      ],
    },
  });
  return result.count;
}

async function invalidateUserTokens(userId) {
  await prisma.passwordResetToken.deleteMany({
    where: {
      user_id: userId,
      used: false,
      used_at: null,
    },
  });
}

async function createResetToken(user) {
  await cleanupExpiredTokens();
  await invalidateUserTokens(user.id);

  const rawToken = crypto.randomBytes(48).toString('base64url');
  const expiresAt = new Date(
    Date.now() + settings.passwordResetExpireMinutes * 60 * 1000
  );

  await prisma.passwordResetToken.create({
    data: {
      user_id: user.id,
      email: user.email,
      token_hash: hashResetToken(rawToken),
      expires_at: expiresAt,
      used: false,
    },
  });

  return rawToken;
}

async function getValidTokenRecord(rawToken) {
  if (!rawToken || rawToken.length < 20) return null;

  const tokenHash = hashResetToken(rawToken);
  const now = new Date();

  return prisma.passwordResetToken.findFirst({
    where: {
      token_hash: tokenHash,
      used: false,
      used_at: null,
      expires_at: { gte: now },
    },
  });
}

async function consumeResetToken(record) {
  await prisma.passwordResetToken.delete({ where: { id: record.id } });
}

module.exports = {
  hashResetToken,
  cleanupExpiredTokens,
  invalidateUserTokens,
  createResetToken,
  getValidTokenRecord,
  consumeResetToken,
};
