@echo off
REM Shukla Industrial — Start backend API (Windows)
cd /d "%~dp0..\server"
if not exist "venv\Scripts\activate.bat" (
  echo Creating virtual environment...
  python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
if not exist ".env" copy .env.example .env
echo Starting API on http://localhost:8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
