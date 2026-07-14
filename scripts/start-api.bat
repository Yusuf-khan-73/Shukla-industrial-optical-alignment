@echo off
REM Start the Node.js / Express API (default http://localhost:8001)
cd /d "%~dp0..\backend"
if not exist ".env" (
  echo Missing backend\.env — copy .env.example to .env and set DATABASE_URL
  exit /b 1
)
call npm run dev
