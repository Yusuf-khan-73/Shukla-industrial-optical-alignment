const settings = require('./config/settings');
const { createApp } = require('./app');
const prisma = require('./prisma/client');
const { ensureUploadDir } = require('./utils/uploads');
const { runAllSeeds } = require('./services/seed');

async function bootstrap() {
  const dbUrl = settings.databaseUrl || '';
  const isPlaceholder =
    !dbUrl ||
    /USER:PASSWORD|@HOST:|PASSWORD@HOST|localhost:5432\/DATABASE/i.test(dbUrl) ||
    /postgresql:\/\/user:pass@/i.test(dbUrl);

  if (isPlaceholder) {
    console.error(
      'DATABASE_URL in backend/.env is missing or still a placeholder.\n' +
        'Set it to your Supabase Postgres URI, for example:\n' +
        '  postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?schema=public\n' +
        'or the direct connection from Supabase → Project Settings → Database.'
    );
    process.exit(1);
  }
  if (!settings.secretKey || /change-this-to-a-long-random/i.test(settings.secretKey)) {
    console.error(
      'SECRET_KEY in backend/.env must be set to a long random secret (not the example default).'
    );
    process.exit(1);
  }

  ensureUploadDir();

  try {
    await runAllSeeds();
    console.info('Database seeds checked.');
  } catch (err) {
    console.error('Seed failed (continuing startup):', err.message);
  }

  const app = createApp();
  const server = app.listen(settings.port, settings.host, () => {
    console.info(
      `${settings.appName} listening on http://${settings.host}:${settings.port}`
    );
    console.info(`API prefix: ${settings.apiV1Prefix}`);
  });

  const shutdown = async (signal) => {
    console.info(`${signal} received — shutting down`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch(async (err) => {
  console.error('Failed to start server:', err);
  await prisma.$disconnect();
  process.exit(1);
});
