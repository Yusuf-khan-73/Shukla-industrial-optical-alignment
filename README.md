# Shukla Industrial Optical Alignment — Corporate Website



> **Precision • Accuracy • Reliability** — 18+ years of Industrial Optical Alignment, Theodolite Alignment, and Paper Mill Alignment Projects across India.



## Tech Stack



| Layer      | Technologies |

|------------|--------------|

| Frontend   | React 19, Vite, Bootstrap 5.3, Framer Motion, GSAP, SwiperJS, AOS, Lenis |

| Backend    | Python 3.13+, FastAPI, SQLAlchemy, Alembic, JWT |

| Database   | PostgreSQL 16+ |



## Project Structure



```

Shukla-Industrial-Website/

├── client/          # React frontend (Vite)

├── server/          # FastAPI backend

├── database/        # SQL schema, seeds, backups

├── scripts/         # Windows setup helpers

└── README.md

```



## How to Run (Windows)



### Prerequisites



- **Node.js 20+** — https://nodejs.org

- **Python 3.13+** — https://python.org

- **PostgreSQL 16+** — https://www.postgresql.org/download/windows/



> **Note:** The website frontend works without the backend (uses built-in sample data). For contact form, admin panel, and live database content you need PostgreSQL + API running.



---



### Step 1 — PostgreSQL database (one time)



Open **pgAdmin** or **psql** and create the database user and database, then run the SQL files:



```powershell

cd C:\Users\DELL\Desktop\Shukla-Industrial-Website



# Using psql (adjust path if needed):

psql -U postgres -c "CREATE USER shukla_user WITH PASSWORD 'shukla_pass';"

psql -U postgres -c "CREATE DATABASE shukla_industrial OWNER shukla_user;"

psql -U shukla_user -d shukla_industrial -f database\schema.sql

psql -U shukla_user -d shukla_industrial -f database\seed.sql

```



Or run the helper script (requires `psql` in PATH):



```powershell

powershell -ExecutionPolicy Bypass -File scripts\setup-database.ps1

```



**Connection string:** `postgresql://shukla_user:shukla_pass@localhost:5432/shukla_industrial`



---



### Step 2 — Backend API



Open **Terminal 1**:



```powershell

cd C:\Users\DELL\Desktop\Shukla-Industrial-Website\server

python -m venv venv

.\venv\Scripts\activate

pip install -r requirements.txt

copy .env.example .env

uvicorn main:app --reload --host 0.0.0.0 --port 8000

```



- API: http://localhost:8000

- API docs: http://localhost:8000/api/docs

- Health: http://localhost:8000/api/v1/health



On first start the API auto-creates tables and seeds data if the database is empty.



**Default admin:** `admin@shuklaindustrial.com` / `ChangeMe@123`



---



### Step 3 — Frontend



Open **Terminal 2**:



```powershell

cd C:\Users\DELL\Desktop\Shukla-Industrial-Website\client

copy .env.example .env

npm install

npm run dev

```



- Website: http://localhost:5173

- Admin: http://localhost:5173/admin/login



---



## Production Build (without Docker)



**Build frontend:**



```powershell

cd client

npm run build

npm run preview

```



**Run API (production):**



```powershell

cd server

.\venv\Scripts\activate

uvicorn main:app --host 0.0.0.0 --port 8000

```



Deploy `client/dist` with any static host (IIS, Apache, Nginx) and point API requests to your FastAPI server.



---



## Admin Panel



| Section | URL |

|---------|-----|

| Login | `/admin/login` |

| Dashboard | `/admin` |

| Projects / Gallery / Clients / Services | `/admin/projects`, etc. |

| Contact inbox | `/admin/contact` |

| Hero slides | `/admin/hero-slides` |

| Settings | `/admin/settings` |



---



## Database Scripts



| File | Purpose |

|------|---------|

| `database/schema.sql` | Create all tables |

| `database/seed.sql` | Initial admin, clients, services, sample content |

| `database/reset.sql` | Drop all tables (dev only) |

| `server/scripts/seed_database.py` | Python seed (idempotent) |

| `server/scripts/migrate.py` | Alembic wrapper |



**Alembic (alternative to schema.sql):**



```powershell

cd server

.\venv\Scripts\activate

alembic upgrade head

python scripts\seed_database.py

```



---



## Environment Variables



### Client (`client/.env`)



| Variable | Dev value | Description |

|----------|-----------|-------------|

| `VITE_API_BASE_URL` | `/api/v1` | API path (Vite proxies to backend) |

| `VITE_API_ORIGIN` | `http://localhost:8000` | Used for uploaded image URLs |

| `VITE_SITE_URL` | `http://localhost:5173` | Public site URL for SEO |



### Server (`server/.env`)



Copy from `server/.env.example`. Key values:



| Variable | Description |

|----------|-------------|

| `DATABASE_URL` | PostgreSQL connection string |

| `SECRET_KEY` | JWT secret (change in production) |

| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` |

| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial admin login |



---



## Troubleshooting



| Problem | Fix |

|---------|-----|

| API won't start — database error | Start PostgreSQL service; run `database/schema.sql` |

| Contact form fails | Ensure API is running on port 8000 |

| Admin login fails | Check `server/.env` credentials; ensure DB is seeded |

| CORS errors | Set `CORS_ORIGINS` in `server/.env` to include `http://localhost:5173` |

| Images not loading in admin | Set `VITE_API_ORIGIN=http://localhost:8000` in `client/.env` |

| Frontend only — no API | Site still works with sample data; API features disabled |



---



## Company Contact



- **Phone:** +91 9510900608 / +91 8707305703

- **Email:** sioaw98@yahoo.com

- **Hours:** Mon–Sat, 09:00 AM – 07:00 PM | 24x7 Emergency Support



---



Designed with ❤️ by **SHUKLA INDUSTRIAL OPTICAL ALIGNMENT**

