const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const settings = require('../config/settings');

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

async function getPasswordHash(password) {
  return bcrypt.hash(password, 10);
}

function createAccessToken(subject, expiresDeltaMinutes) {
  const minutes = expiresDeltaMinutes ?? settings.accessTokenExpireMinutes;
  return jwt.sign(
    { sub: String(subject) },
    settings.secretKey,
    {
      algorithm: settings.algorithm,
      expiresIn: `${minutes}m`,
    }
  );
}

function decodeAccessToken(token) {
  try {
    const payload = jwt.verify(token, settings.secretKey, {
      algorithms: [settings.algorithm],
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

module.exports = {
  verifyPassword,
  getPasswordHash,
  createAccessToken,
  decodeAccessToken,
};
