# Shukla Industrial Optical Alignment — Corporate Website

> **Precision • Accuracy • Reliability** — 18+ years of Industrial Optical Alignment, Theodolite Alignment, and Paper Mill Alignment Projects across India.

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, Vite, Bootstrap 5.3, Framer Motion, GSAP, SwiperJS, AOS, Lenis |
| Backend  | Node.js, Express.js, Prisma, Zod, JWT, bcrypt |
| Database | Existing PostgreSQL (e.g. Supabase) via `DATABASE_URL` |

## Project Structure

```
Shukla-industrial-optical-alignment/
├── client/          # React frontend (Vite)
├── backend/         # Express + Prisma API
├── database/        # Legacy SQL schema / seeds (reference)
├── scripts/         # Windows helpers
└── README.md
```

## How to Run

### Prerequisites

- **Node.js 18+**
- Existing **PostgreSQL** (do not recreate or wipe Supabase data)

### Step 1 — Backend

```powershell
cd backend
copy .env.example .env
# Edit .env and set DATABASE_URL, SECRET_KEY, CORS_ORIGINS, SMTP_*, etc.
npm install
npx prisma generate
# Optional: introspect live DB (safe — read-only schema pull)
# npx prisma db pull
npm run dev
```

- API: http://localhost:8001  
- Health: http://localhost:8001/api/v1/health  
- Uploads: http://localhost:8001/uploads/...

On startup the API runs **idempotent seeds** only when tables are empty (never drops data).

### Step 2 — Frontend

```powershell
cd client
copy .env.example .env
npm install
npm run dev
```

- Website: http://localhost:5173  
- Admin: http://localhost:5173/admin/login  

Ensure `VITE_API_ORIGIN=http://localhost:8001` matches the backend port.

## Production

```powershell
cd backend
npm install
npx prisma generate
npm start
```

**Vercel (serverless):** set the project Root Directory to `backend`, add env vars, and deploy. See [`backend/DEPLOY_VERCEL.md`](backend/DEPLOY_VERCEL.md). Local `npm run dev` / `npm start` still use `app.listen()` unchanged.

Deploy on Render / Railway / Koyeb with env vars only (see `backend/.env.example`). Serve `client` build separately or reverse-proxy `/api` and `/uploads` to the Node service.

```powershell
cd client
npm run build
```

## Admin Panel

| Section | URL |
|---------|-----|
| Login | `/admin/login` |
| Dashboard | `/admin` |
| Content CRUD | `/admin/projects`, `/admin/gallery`, etc. |
| Contact inbox | `/admin/contact` |
| Settings | `/admin/settings` |

## Environment Variables (backend)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Existing Postgres/Supabase connection string |
| `SECRET_KEY` | JWT signing secret |
| `CORS_ORIGINS` | Comma-separated frontend origins |
| `PORT` | Default `8001` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial seed only |
| `FRONTEND_URL` | Password-reset link base |
| `SMTP_*` | Contact + password-reset email |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| API won't start | Set `DATABASE_URL` and `SECRET_KEY` in `backend/.env` |
| Admin login fails | Login email must match `company_information.admin_login_email` |
| CORS errors | Add frontend origin to `CORS_ORIGINS` |
| Images missing | Set `VITE_API_ORIGIN` to the API origin |
| Contact emails | Configure SMTP; inquiry is still saved if SMTP fails |

## Company Contact

- **Phone:** +91 9510900608 / +91 8707305703  
- **Email:** sioaw98@yahoo.com  

---

Designed with ❤️ by **SHUKLA INDUSTRIAL OPTICAL ALIGNMENT**
