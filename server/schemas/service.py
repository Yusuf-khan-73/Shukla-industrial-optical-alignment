"""Service schemas."""
from typing import Any, List, Optional

from pydantic import BaseModel, Field

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class ServiceImageOut(BaseModel):
    model_config = PUBLIC_CONFIG

    url: str = Field(validation_alias="image_url")
    alt: str = Field(validation_alias="alt_text", default="")


class ServiceImageIn(BaseModel):
    image_url: str
    alt_text: str = ""
    sort_order: int = 0


class ServicePublic(BaseModel):
    model_config = PUBLIC_CONFIG

    id: int
    title: str
    slug: str
    short_description: str
    description: str
    icon: str
    benefits: List[Any] = []
    faqs: List[Any] = []
    image_url: Optional[str] = None
    images: List[ServiceImageOut] = []


class ServiceCreate(BaseModel):
    title: str
    slug: str
    short_description: str = ""
    description: str = ""
    icon: str = "bi-gear"
    benefits: List[Any] = []
    faqs: List[Any] = []
    image_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0
    images: List[ServiceImageIn] = []


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    benefits: Optional[List[Any]] = None
    faqs: Optional[List[Any]] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    images: Optional[List[ServiceImageIn]] = None


class ServiceAdmin(ServicePublic):
    model_config = ADMIN_CONFIG

    is_active: bool
    sort_order: int
