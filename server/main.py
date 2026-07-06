"""
Shukla Industrial Optical Alignment — FastAPI Application
Location: server/main.py
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config.settings import settings
from database.base import Base
from database.session import SessionLocal, engine
from routers import api_router
from services.seed import run_all_seeds
from utils.uploads import ensure_upload_dir


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_upload_dir()
    db = SessionLocal()
    try:
        run_all_seeds(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.app_name,
    description="REST API for corporate website and admin panel",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_path = Path(settings.upload_dir)
upload_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_path)), name="uploads")

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    return {
        "message": settings.app_name,
        "status": "running",
        "version": "1.0.0",
        "docs": "/api/docs",
    }


@app.get("/api/v1/health")
async def health_check():
    from sqlalchemy import text

    from database.session import SessionLocal

    db_status = "healthy"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception:
        db_status = "unavailable"

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": "shukla-industrial-api",
        "database": db_status,
    }
