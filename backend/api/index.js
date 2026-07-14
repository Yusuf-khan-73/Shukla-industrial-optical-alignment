/**
 * Vercel Serverless entry point.
 * Exports the Express app — do not call app.listen() here.
 * Local development continues to use `npm run dev` / `npm start` (src/server.js).
 */
const { createApp } = require('../src/app');

module.exports = createApp();
