const { asyncHandler, AppError } = require('../middleware/errorHandler');
const prisma = require('../prisma/client');
const settings = require('../config/settings');
const { findAdminUserByLoginEmail } = require('../services/adminLogin');
const {
  verifyPassword,
  getPasswordHash,
  createAccessToken,
} = require('../utils/security');
const {
  cleanupExpiredTokens,
  createResetToken,
  getValidTokenRecord,
  consumeResetToken,
} = require('../services/passwordReset');
const { sendPasswordResetEmail } = require('../services/email');
const { serializeUser } = require('../utils/serializers');
const {
  validate,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  profileUpdateSchema,
} = require('../validators');

async function loginUser(email, password) {
  const user = await findAdminUserByLoginEmail(email);
  if (!user || !(await verifyPassword(password, user.hashed_password))) {
    throw new AppError(401, 'Invalid credentials');
  }
  if (!user.is_active) {
    throw new AppError(403, 'Account disabled');
  }
  const token = createAccessToken(user.id);
  return { access_token: token, token_type: 'bearer' };
}

const login = asyncHandler(async (req, res) => {
  const payload = validate(loginSchema, req.body);
  const result = await loginUser(payload.email, payload.password);
  res.json(result);
});

const loginForm = asyncHandler(async (req, res) => {
  const payload = validate(loginSchema, {
    email: req.body.username,
    password: req.body.password,
  });
  const result = await loginUser(payload.email, payload.password);
  res.json(result);
});

const me = asyncHandler(async (req, res) => {
  res.json(serializeUser(req.user));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const payload = validate(forgotPasswordSchema, req.body);

  try {
    await cleanupExpiredTokens();

    const user = await findAdminUserByLoginEmail(payload.email);
    if (!user) {
      throw new AppError(404, 'Email not found.');
    }

    if (!user.is_active) {
      throw new AppError(
        403,
        'This account is disabled. Please contact the site administrator.'
      );
    }

    const rawToken = await createResetToken(user);
    const resetUrl = `${settings.passwordResetUrlBase}?token=${rawToken}`;
    const sent = await sendPasswordResetEmail(user.email, resetUrl);

    if (!sent) {
      throw new AppError(503, 'Unable to send reset email. Please try again later.');
    }

    res.json({ message: 'Email sent successfully.' });
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('Forgot password failed:', err);
    throw new AppError(500, 'Unable to process your request. Please try again later.');
  }
});

const verifyResetToken = asyncHandler(async (req, res) => {
  try {
    const token = String(req.query.token || '');
    if (token.length < 20) {
      return res.json({
        valid: false,
        message: 'Invalid or expired reset token.',
      });
    }

    await cleanupExpiredTokens();
    const record = await getValidTokenRecord(token);

    if (!record) {
      return res.json({
        valid: false,
        message: 'Invalid or expired reset token.',
      });
    }

    return res.json({
      valid: true,
      email: record.email,
      message: 'Token is valid.',
    });
  } catch (err) {
    console.error('Verify reset token failed:', err);
    return res.json({
      valid: false,
      message: 'Unable to verify reset link. Please try again.',
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const payload = validate(resetPasswordSchema, req.body);
    await cleanupExpiredTokens();
    const record = await getValidTokenRecord(payload.token);

    if (!record) {
      throw new AppError(400, 'Invalid or expired reset token.');
    }

    const user = await prisma.user.findFirst({ where: { id: record.user_id } });
    if (!user || !user.is_active) {
      throw new AppError(400, 'Invalid or expired reset token.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { hashed_password: await getPasswordHash(payload.password) },
    });
    await consumeResetToken(record);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.name === 'ZodError') throw err;
    console.error('Reset password failed:', err);
    throw new AppError(500, 'Unable to reset password. Please try again later.');
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const payload = validate(profileUpdateSchema, req.body);
  // Live DB users table only has full_name among profile-editable fields.
  // Login email is managed exclusively in Company Settings.
  const updateData = {};
  if (Object.prototype.hasOwnProperty.call(req.body, 'full_name') && payload.full_name !== undefined) {
    updateData.full_name = payload.full_name;
  }

  const user = Object.keys(updateData).length
    ? await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
      })
    : await prisma.user.findUnique({ where: { id: req.user.id } });

  res.json(serializeUser(user));
});

const changePassword = asyncHandler(async (req, res) => {
  const payload = validate(changePasswordSchema, req.body);

  if (!(await verifyPassword(payload.current_password, req.user.hashed_password))) {
    throw new AppError(400, 'Current password is incorrect');
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: { hashed_password: await getPasswordHash(payload.new_password) },
  });

  res.json({ message: 'Password changed successfully.' });
});

module.exports = {
  login,
  loginForm,
  me,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  updateProfile,
  changePassword,
};
