const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const settings = require('./config/settings');
const apiRouter = require('./routes');
const {
  notFoundHandler,
  errorHandler,
} = require('./middleware/errorHandler');
const { uploadRoot, ensureUploadDir } = require('./utils/uploads');

function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(compression());
  app.use(
    morgan(settings.appEnv === 'production' ? 'combined' : 'dev')
  );
  app.use(
    rateLimit({
      windowMs: settings.rateLimitWindowMs,
      max: settings.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      message: { detail: 'Too many requests, please try again later.' },
    })
  );
  app.use(
    cors({
      origin: settings.corsOrigins.length ? settings.corsOrigins : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  ensureUploadDir();
  app.use('/uploads', express.static(uploadRoot()));

  app.get('/', (req, res) => {
    res.json({
      message: settings.appName,
      status: 'running',
      version: '1.0.0',
      docs: '/api/docs',
    });
  });

  app.use(settings.apiV1Prefix, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
