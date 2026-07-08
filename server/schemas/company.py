"""Company information schemas."""
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


def _strip_email(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, str):
        trimmed = value.strip()
        return trimmed if trimmed else None
    return value


class CompanyInfoPublic(BaseModel):
    """Public company profile — never includes admin login email."""

    model_config = PUBLIC_CONFIG

    company_name: str
    tagline: str
    description: str
    logo: str = ""
    phone_1: str = ""
    phone_2: str = ""
    phones: List[Any] = []
    email: EmailStr
    whatsapp_number: str = ""
    office_address: str = ""
    google_map_url: str = ""
    facebook: str = ""
    instagram: str = ""
    linkedin: str = ""
    youtube: str = ""
    address: Dict[str, Any] = {}
    working_hours: Dict[str, Any] = {}
    stats: List[Any] = []


class CompanyInfoUpdate(BaseModel):
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None
    phone_1: Optional[str] = None
    phone_2: Optional[str] = None
    phones: Optional[List[Any]] = None
    email: Optional[EmailStr] = None
    admin_login_email: Optional[EmailStr] = Field(
        default=None,
        description="Admin panel login email — not shown on the public website.",
    )
    whatsapp_number: Optional[str] = None
    office_address: Optional[str] = None
    google_map_url: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    youtube: Optional[str] = None
    address: Optional[Dict[str, Any]] = None
    working_hours: Optional[Dict[str, Any]] = None
    stats: Optional[List[Any]] = None

    @field_validator("email", "admin_login_email", mode="before")
    @classmethod
    def normalize_emails(cls, value: Optional[str]) -> Optional[str]:
        return _strip_email(value)


class CompanyInfoAdmin(CompanyInfoPublic):
    """Admin-only company payload including login email."""

    model_config = ADMIN_CONFIG

    id: int
    admin_login_email: EmailStr
