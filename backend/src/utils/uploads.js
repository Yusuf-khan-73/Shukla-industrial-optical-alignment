const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const settings = require('../config/settings');
const { AppError } = require('../middleware/errorHandler');

/** Vercel (and Lambda) filesystems are read-only except /tmp. */
function isEphemeralFs() {
  return Boolean(process.env.VERCEL) || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function uploadRoot() {
  if (path.isAbsolute(settings.uploadDir)) {
    return settings.uploadDir;
  }
  if (isEphemeralFs()) {
    // Writable on serverless; files are ephemeral per instance — see DEPLOY_VERCEL.md
    return path.posix.join('/tmp', settings.uploadDir || 'uploads');
  }
  return path.resolve(__dirname, '../..', settings.uploadDir);
}

function ensureUploadDir() {
  const root = uploadRoot();
  try {
    fs.mkdirSync(root, { recursive: true });
  } catch (err) {
    if (isEphemeralFs()) {
      console.warn('ensureUploadDir failed on serverless (non-fatal):', err.message);
      return root;
    }
    throw err;
  }
  return root;
}

/**
 * Supabase Storage is used when configured — files land in a durable bucket
 * with a stable public URL, instead of Vercel's per-instance /tmp disk
 * (where a file only exists on the one instance that handled the upload,
 * so other instances 404 on it — the "random image missing on refresh" bug).
 * Client is created lazily/once so a missing config doesn't crash at boot.
 */
let supabaseClient = null;
function isSupabaseStorageConfigured() {
  return Boolean(settings.supabaseUrl && settings.supabaseServiceRoleKey);
}
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(settings.supabaseUrl, settings.supabaseServiceRoleKey);
  }
  return supabaseClient;
}

async function saveToSupabase(file, subfolder, filename) {
  const objectPath = `${subfolder}/${filename}`;

  console.log("===== SUPABASE DEBUG =====");
  console.log("SUPABASE_URL:", settings.supabaseUrl);
  console.log("BUCKET:", settings.supabaseStorageBucket);
  console.log("OBJECT PATH:", objectPath);
  console.log("FILE:", file.originalname);
  console.log("MIME:", file.mimetype);

  const supabase = getSupabaseClient();

  const { data, error: uploadError } = await supabase.storage
    .from(settings.supabaseStorageBucket)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  console.log("UPLOAD DATA:", data);
  console.log("UPLOAD ERROR:", uploadError);

  if (uploadError) {
    throw new AppError(500, `Supabase upload failed: ${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage
    .from(settings.supabaseStorageBucket)
    .getPublicUrl(objectPath);

  console.log("PUBLIC URL:", publicData);

  if (!publicData?.publicUrl) {
    throw new AppError(500, "No public URL returned");
  }

  return publicData.publicUrl;
}

function saveToLocalDisk(file, subfolder, filename) {
  const destDir = path.join(ensureUploadDir(), subfolder);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, filename);
  fs.writeFileSync(destPath, file.buffer);

  return `/uploads/${subfolder}/${filename}`;
}

async function saveUploadBuffer(file, subfolder = 'images') {
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

  if (isSupabaseStorageConfigured()) {
    return saveToSupabase(file, subfolder, filename);
  }

  // Fallback: local disk (dev) or ephemeral /tmp (serverless without
  // Supabase configured — still non-crashing, just not durable).
  return saveToLocalDisk(file, subfolder, filename);
}

module.exports = {
  ensureUploadDir,
  saveUploadBuffer,
  uploadRoot,
};