"""API v1 router aggregation."""
from fastapi import APIRouter

from routers import (
    auth,
    clients,
    company,
    contact,
    gallery,
    hero,
    projects,
    services,
    site_settings,
    testimonials,
    uploads,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(gallery.router)
api_router.include_router(clients.router)
api_router.include_router(services.router)
api_router.include_router(testimonials.router)
api_router.include_router(contact.router)
api_router.include_router(hero.router)
api_router.include_router(company.router)
api_router.include_router(site_settings.router)
api_router.include_router(uploads.router)
