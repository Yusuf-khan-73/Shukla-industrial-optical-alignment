@echo off
REM Shukla Industrial — Start frontend dev server (Windows)
cd /d "%~dp0..\client"
if not exist ".env" copy .env.example .env
if not exist "node_modules\" call npm install
echo Starting frontend on http://localhost:5173
npm run dev
