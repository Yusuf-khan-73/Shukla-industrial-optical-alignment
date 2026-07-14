const { PrismaClient } = require('@prisma/client');

/**
 * Reuse a single PrismaClient across warm serverless invocations.
 * Creating a new client per request exhausts database connections on Vercel.
 */
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__shuklaPrisma ??
  new PrismaClient({
    log: process.env.APP_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

globalForPrisma.__shuklaPrisma = prisma;

module.exports = prisma;
