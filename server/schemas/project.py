"""Project schemas."""
from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class ProjectImageOut(BaseModel):
    model_config = PUBLIC_CONFIG

    url: str = Field(validation_alias="image_url")
    alt: str = Field(validation_alias="alt_text", default="")


class ProjectImageIn(BaseModel):
    image_url: str
    alt_text: str = ""
    sort_order: int = 0


class ProjectPublic(BaseModel):
    model_config = PUBLIC_CONFIG

    id: int
    title: str
    slug: str
    client: str
    location: str
    industry: str
    industry_label: str
    completion_date: Optional[date] = None
    service_type: str
    short_description: str
    description: str
    featured: bool
    images: List[ProjectImageOut] = []


class ProjectCreate(BaseModel):
    title: str
    slug: str
    client: str
    location: str
    industry: str
    industry_label: str
    completion_date: Optional[date] = None
    service_type: str
    short_description: str = ""
    description: str = ""
    featured: bool = False
    is_active: bool = True
    sort_order: int = 0
    images: List[ProjectImageIn] = []


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    client: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None
    industry_label: Optional[str] = None
    completion_date: Optional[date] = None
    service_type: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    images: Optional[List[ProjectImageIn]] = None


class ProjectAdmin(ProjectPublic):
    model_config = ADMIN_CONFIG

    is_active: bool
    sort_order: int
