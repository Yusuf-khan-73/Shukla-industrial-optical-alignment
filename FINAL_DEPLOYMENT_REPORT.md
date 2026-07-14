# Final Deployment Report — Shukla Industrial Optical Alignment

**Date:** 2026-07-14  
**Status:** Production frontend ↔ production backend **connected and verified**

---

## Production URLs

| Surface | URL |
|---------|-----|
| Frontend | https://shukla-industrial-frontend.vercel.app |
| Backend API | https://shukla-industrial-backend.vercel.app |
| Health | https://shukla-industrial-backend.vercel.app/api/v1/health |
| Admin login | https://shukla-industrial-frontend.vercel.app/admin/login |

---

## What was configured

### Frontend API base URL

Primary configuration (Vite):

- `client/src/api/axios.js` — resolves `VITE_API_BASE_URL` (absolute `https://…` wins)
- All API modules (`auth`, `projects`, `gallery`, `services`, `contact`, `admin`, etc.) use the shared `apiClient`
- `client/src/utils/resolveImageUrl.js` — derives upload origin from `VITE_API_BASE_URL` / `VITE_API_ORIGIN` (so `/uploads/…` hits the backend, not the frontend host)

### Production env files / Vercel env

`client/.env.production`:

```env
VITE_API_BASE_URL=https://shukla-industrial-backend.vercel.app/api/v1
VITE_API_ORIGIN=https://shukla-industrial-backend.vercel.app
VITE_SITE_URL=https://shukla-industrial-frontend.vercel.app
```

Same three variables are set on Vercel project **shukla-industrial-frontend** for **Production** and **Preview**.

### SPA routing

`client/vercel.json` rewrites non-asset routes to `index.html` so `/admin`, `/gallery`, etc. do not 404 on refresh.

### Backend CORS

Backend allows origin:

`https://shukla-industrial-frontend.vercel.app`

(Verified via `Access-Control-Allow-Origin` on public and authenticated responses.)

---

## Redeploy

Frontend production deploy completed:

- Project: `17b-pro/shukla-industrial-frontend`
- Alias: https://shukla-industrial-frontend.vercel.app
- Inspect: https://vercel.com/17b-pro/shukla-industrial-frontend/Dw4ypR3rGjDnSZAPTB7McbgJsnJj

Production JS bundle embeds:

`https://shukla-industrial-backend.vercel.app/api/v1`  
(no `localhost:8001` in the API client chunk)

---

## Verification results

### Frontend routes (HTTP)

| Path | Result |
|------|--------|
| `/` | 200 |
| `/gallery` | 200 |
| `/projects` | 200 |
| `/services` | 200 |
| `/contact` | 200 |
| `/admin/login` | 200 |
| `/admin` | 200 |

### Public API (CORS from frontend origin)

| Endpoint | Result |
|----------|--------|
| `GET /api/v1/health` | 200, database healthy |
| `GET /api/v1/gallery` | 200 |
| `GET /api/v1/projects` | 200 |
| `GET /api/v1/services` | 200 |
| `GET /api/v1/clients` | 200 |
| `GET /api/v1/testimonials` | 200 |
| `GET /api/v1/hero-slides` | 200 |
| `GET /api/v1/company-info` | 200 |
| `GET /api/v1/site-settings` | 200 |
| `POST /api/v1/contact` (valid payload) | 201 |

No CORS failures, network errors, or 500s on these checks.

### Auth / Admin / CRUD

| Check | Result |
|-------|--------|
| `POST /api/v1/auth/login` | 200 + `access_token` |
| `GET /api/v1/auth/me` | 200 |
| Admin list: projects, gallery, services, clients, testimonials, hero, contact, company | 200 |
| Settings read (frontend uses `GET /site-settings`) | 200 |
| Admin create + delete client (smoke) | 201-style create → **204** delete |

Note: `GET /api/v1/admin/site-settings` is **not** a backend route (only `PUT /admin/site-settings` exists). The frontend correctly reads via `GET /site-settings` and updates via `PUT /admin/site-settings`.

---

## Issue checklist

| Issue | Status |
|-------|--------|
| 404 on SPA deep links | Fixed (`client/vercel.json`) |
| Relative `/api/v1` hitting frontend host | Fixed (absolute `VITE_API_BASE_URL`) |
| CORS | OK |
| Network Error | None observed |
| 500 from API on verified routes | None observed |
| Upload images pointing at frontend origin | Mitigated (`resolveImageUrl` uses backend origin). **Note:** files on Vercel `/tmp` remain ephemeral. |

---

## Remaining operational notes

1. **SMTP** — Contact inquiry persists (201), but email delivery stays off until backend `SMTP_*` vars are set.
2. **Uploads on serverless** — Prefer external storage for durable images; local `/tmp` uploads do not persist across instances.
3. **Admin password** — Production login was verified with the seeded admin account; rotate `ADMIN_PASSWORD` / user password for long-term security if still using the default.
4. **Local development** — Keep `VITE_API_ORIGIN=http://localhost:8001` in `client/.env`; production values live in `.env.production` + Vercel env.

---

## Quick re-check commands

```powershell
Invoke-RestMethod https://shukla-industrial-backend.vercel.app/api/v1/health
Invoke-WebRequest https://shukla-industrial-frontend.vercel.app -UseBasicParsing | Select-Object StatusCode
```

Redeploy frontend after env changes:

```powershell
cd client
vercel --prod
```
