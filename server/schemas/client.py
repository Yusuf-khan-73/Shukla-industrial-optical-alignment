"""Client schemas."""
from typing import Optional

from pydantic import BaseModel

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class ClientPublic(BaseModel):
    model_config = PUBLIC_CONFIG

    id: int
    name: str
    initials: str
    category: str
    category_label: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    featured: bool


class ClientCreate(BaseModel):
    name: str
    initials: str = ""
    category: str
    category_label: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    featured: bool = False
    is_active: bool = True
    sort_order: int = 0


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    initials: Optional[str] = None
    category: Optional[str] = None
    category_label: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    featured: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ClientAdmin(ClientPublic):
    model_config = ADMIN_CONFIG

    is_active: bool
    sort_order: int
