"""Gallery schemas."""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class GalleryImageOut(BaseModel):
    model_config = PUBLIC_CONFIG

    url: str = Field(validation_alias="image_url")
    alt: str = Field(validation_alias="alt_text", default="")


class GalleryImageThumb(BaseModel):
    model_config = PUBLIC_CONFIG

    url: str
    alt: str = ""


class GalleryImageIn(BaseModel):
    image_url: str
    alt_text: str = ""
    sort_order: int = 0


class GalleryPublic(BaseModel):
    model_config = PUBLIC_CONFIG

    id: int
    title: str
    company: str
    location: str
    date: Optional[str] = None
    category: str
    category_label: str
    description: str
    featured: bool
    updated_at: Optional[datetime] = None
    image: Optional[GalleryImageThumb] = None
    images: List[GalleryImageOut] = []


class GalleryCreate(BaseModel):
    title: str
    company: str
    location: str
    date: Optional[str] = None
    category: str = "general"
    category_label: str = "General"
    description: str = ""
    featured: bool = False
    is_active: bool = True
    sort_order: int = 0
    images: List[GalleryImageIn] = []


class GalleryUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    category: Optional[str] = None
    category_label: Optional[str] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    images: Optional[List[GalleryImageIn]] = None


class GalleryAdmin(GalleryPublic):
    model_config = ADMIN_CONFIG

    is_active: bool
    sort_order: int
