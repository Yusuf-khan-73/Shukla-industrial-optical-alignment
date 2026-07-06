"""Site settings schemas."""
from typing import Any, Dict, Optional

from pydantic import BaseModel

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class SiteSettingsPublic(BaseModel):
    model_config = PUBLIC_CONFIG

    map_embed_url: str
    social_links: Dict[str, Any] = {}
    seo_defaults: Dict[str, Any] = {}


class SiteSettingsUpdate(BaseModel):
    map_embed_url: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    seo_defaults: Optional[Dict[str, Any]] = None


class SiteSettingsAdmin(SiteSettingsPublic):
    model_config = ADMIN_CONFIG

    id: int
