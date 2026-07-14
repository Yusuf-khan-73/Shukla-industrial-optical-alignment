class AppError extends Error {
  constructor(statusCode, detail) {
    super(typeof detail === 'string' ? detail : JSON.stringify(detail));
    this.statusCode = statusCode;
    this.detail = detail;
    this.isOperational = true;
  }
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function notFoundHandler(req, res, next) {
  next(new AppError(404, 'Not Found'));
}

function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  if (err.name === 'ZodError') {
    return res.status(422).json({
      detail: err.errors.map((e) => ({
        loc: ['body', ...e.path],
        msg: e.message,
        type: e.code,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ detail: err.detail });
  }

  if (err.code === 'P2002') {
    return res.status(400).json({ detail: 'Slug already exists' });
  }

  console.error(err);
  const status = err.statusCode || err.status || 500;
  const detail = err.detail || err.message || 'Internal Server Error';
  return res.status(status).json({ detail });
}

module.exports = {
  AppError,
  asyncHandler,
  notFoundHandler,
  errorHandler,
};
