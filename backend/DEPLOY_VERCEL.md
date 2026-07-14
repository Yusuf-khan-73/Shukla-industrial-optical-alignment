# Deploy backend to Vercel (Serverless)

The Express API runs as a single Vercel Serverless Function (`api/index.js`).
Local development still uses `app.listen()` via `src/server.js` — API routes and responses are unchanged.

---

## Local commands

From the `backend/` folder:

```powershell
# Install dependencies + generate Prisma Client
npm install

# Generate Prisma Client only
npm run prisma:generate

# Development server (nodemon + app.listen on PORT, default 8001)
npm run dev

# Production-style local server (app.listen)
npm start
```

Health check:

```text
http://localhost:8001/api/v1/health
```

Optional: exercise the Vercel entry point locally (requires [Vercel CLI](https://vercel.com/docs/cli)):

```powershell
npm i -g vercel
cd backend
vercel dev
```

`vercel dev` loads `vercel.json` rewrites and runs `api/index.js` (no `app.listen()`).

---

## Vercel CLI commands

```powershell
cd backend

# First-time link (follow prompts; set Root Directory to backend if linking from repo root)
vercel

# Preview deployment
vercel

# Production deployment
vercel --prod

# List env vars
vercel env ls

# Pull env vars into .env.local (optional)
vercel env pull .env.local
```

### Dashboard deploy

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to `backend`.
3. Framework Preset: **Other**.
4. Build Command: leave default (uses `vercel-build` → `prisma generate`) or set `prisma generate`.
5. Output Directory: leave **empty**.
6. Install Command: `npm install`.
7. Add environment variables (see below).
8. Deploy.

---

## Required environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production + Preview as needed).

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | **Yes** | Postgres connection string. Prefer Supabase **pooler** (port `6543`) for serverless: `...?pgbouncer=true&schema=public` |
| `SECRET_KEY` | **Yes** | Long random JWT secret (not the example placeholder) |
| `CORS_ORIGINS` | **Yes** | Comma-separated frontend origins, e.g. `https://your-app.vercel.app,https://www.example.com` |
| `FRONTEND_URL` | **Yes** | Public frontend origin (password-reset links) |
| `APP_ENV` | Recommended | `production` |
| `DEBUG` | Recommended | `false` |
| `API_V1_PREFIX` | Optional | Default `/api/v1` |
| `ALGORITHM` | Optional | Default `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Optional | Default `60` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional | Initial seed only (run seeds via local `npm start` once if needed) |
| `PASSWORD_RESET_EXPIRE_MINUTES` | Optional | Default `15` |
| `PASSWORD_RESET_PATH` | Optional | Default `/reset-password` |
| `ADMIN_DASHBOARD_PATH` | Optional | Default `/admin` |
| `COMPANY_NAME` / `COMPANY_PHONE` / `COMPANY_EMAIL` / `COMPANY_WEBSITE` | Optional | Email branding |
| `SMTP_HOST` | For email | |
| `SMTP_PORT` | For email | Default `587` |
| `SMTP_USERNAME` | For email | |
| `SMTP_PASSWORD` | For email | |
| `SMTP_FROM_EMAIL` / `SMTP_FROM_NAME` | For email | |
| `SMTP_USE_TLS` / `SMTP_USE_SSL` | For email | |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Optional | |
| `UPLOAD_DIR` | Optional | On Vercel, uploads go under `/tmp` automatically; do not point at a non-writable path |
| `HOST` / `PORT` | Not needed | Ignored on Vercel (no `app.listen`) |

Copy from `backend/.env.example` as a checklist. Never commit `.env`.

### Frontend

Point the client at the Vercel API origin, e.g.:

```env
VITE_API_ORIGIN=https://your-api.vercel.app
```

---

## Deployment steps

1. Ensure Postgres is reachable from the internet (Supabase pooler recommended).
2. From `backend/`, confirm local health works: `npm run dev` → `/api/v1/health`.
3. Create a Vercel project with **Root Directory = `backend`**.
4. Add all required env vars in the Vercel dashboard.
5. Deploy (`vercel --prod` or Git push).
6. Confirm:
   - `https://<deployment>/api/v1/health`
   - `https://<deployment>/` (API root JSON)
   - A public route such as projects/services still returns existing data
7. Update frontend `VITE_API_ORIGIN` / `CORS_ORIGINS` to match.

Prisma Client is generated on install/build via:

- `postinstall`: `prisma generate`
- `vercel-build`: `prisma generate`

Engine binary target `rhel-openssl-3.0.x` is configured in `prisma/schema.prisma` for Vercel’s Node runtime.

---

## Uploads on Vercel

- The serverless filesystem is **read-only** except `/tmp`.
- Upload APIs still accept files and write under `/tmp/uploads` so deployment does not crash.
- Files in `/tmp` are **ephemeral** (lost on cold starts / different instances). Serving `/uploads/...` only works for files still present on that instance.
- For durable production images, use object storage (e.g. Supabase Storage, S3, Vercel Blob) and store public URLs in the DB. Local disk uploads continue to work with `npm run dev` / `npm start`.

Vercel also limits request body size for Serverless Functions (~4.5 MB). Keep `MAX_UPLOAD_SIZE_MB` within that limit on Vercel.

---

## Seeds

Idempotent seeds run on local `npm start` / `npm run dev` startup only — **not** on every serverless invocation (avoids cold-start latency and extra DB load). If you need seed data on a fresh database, run `npm start` once against that `DATABASE_URL` locally (or temporarily invoke seeds from a one-off script).

---

## Project layout (Vercel-related)

```text
backend/
├── api/
│   └── index.js      # Serverless entry — exports Express app
├── src/
│   ├── app.js        # createApp() — shared by local + Vercel
│   └── server.js     # Local only — app.listen()
├── prisma/
│   └── schema.prisma # binaryTargets include rhel-openssl-3.0.x
├── vercel.json       # Rewrites all traffic → /api
├── .vercelignore
└── DEPLOY_VERCEL.md
```

Routing (`vercel.json`): every path is rewritten to the Express app in `api/index.js`, so existing paths such as `/api/v1/...` and `/uploads/...` keep working.
