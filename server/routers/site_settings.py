"""Site settings routes."""
from fastapi import APIRouter

from core.deps import CurrentUser, DbSession
from models.site_settings import SiteSettings
from schemas.site_settings import SiteSettingsAdmin, SiteSettingsPublic, SiteSettingsUpdate

router = APIRouter(tags=["Site Settings"])


def get_or_create_settings(db) -> SiteSettings:
    settings_row = db.query(SiteSettings).first()
    if settings_row:
        return settings_row
    settings_row = SiteSettings(map_embed_url="", social_links={}, seo_defaults={})
    db.add(settings_row)
    db.commit()
    db.refresh(settings_row)
    return settings_row


@router.get("/site-settings", response_model=SiteSettingsPublic)
def get_site_settings(db: DbSession):
    return get_or_create_settings(db)


@router.put("/admin/site-settings", response_model=SiteSettingsAdmin)
def update_site_settings(payload: SiteSettingsUpdate, db: DbSession, _: CurrentUser):
    settings_row = get_or_create_settings(db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(settings_row, key, value)
    db.commit()
    db.refresh(settings_row)
    return settings_row
