"""Hero slide schemas."""
from typing import Optional

from pydantic import BaseModel

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class HeroSlidePublic(BaseModel):
    model_config = PUBLIC_CONFIG

    id: int
    image_url: str
    alt_text: str
    caption: Optional[str] = None
    sort_order: int


class HeroSlideCreate(BaseModel):
    image_url: str
    alt_text: str = ""
    caption: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class HeroSlideUpdate(BaseModel):
    image_url: Optional[str] = None
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class HeroSlideAdmin(HeroSlidePublic):
    model_config = ADMIN_CONFIG

    is_active: bool
