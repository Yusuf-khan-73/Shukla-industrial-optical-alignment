const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const settings = require('../config/settings');
const { AppError } = require('../middleware/errorHandler');

function uploadRoot() {
  return path.isAbsolute(settings.uploadDir)
    ? settings.uploadDir
    : path.resolve(__dirname, '../..', settings.uploadDir);
}

function ensureUploadDir() {
  const root = uploadRoot();
  fs.mkdirSync(root, { recursive: true });
  return root;
}

function saveUploadBuffer(file, subfolder = 'images') {
  if (!file) {
    throw new AppError(400, 'No file uploaded');
  }

  if (!settings.allowedImageTypes.includes(file.mimetype)) {
    throw new AppError(
      400,
      `Invalid file type. Allowed: ${settings.allowedImageTypesRaw}`
    );
  }

  const maxBytes = settings.maxUploadSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new AppError(400, `File too large. Max ${settings.maxUploadSizeMb}MB`);
  }

  const ext = path.extname(file.originalname || 'image.jpg').toLowerCase() || '.jpg';
  const filename = `${randomUUID().replace(/-/g, '')}${ext}`;
  const destDir = path.join(ensureUploadDir(), subfolder);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, filename);
  fs.writeFileSync(destPath, file.buffer);

  return `/uploads/${subfolder}/${filename}`;
}

module.exports = {
  ensureUploadDir,
  saveUploadBuffer,
  uploadRoot,
};
