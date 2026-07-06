"""Company information schemas."""
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class CompanyInfoPublic(BaseModel):
    model_config = PUBLIC_CONFIG

    company_name: str
    tagline: str
    description: str
    phones: List[Any] = []
    email: EmailStr
    address: Dict[str, Any] = {}
    working_hours: Dict[str, Any] = {}
    stats: List[Any] = []


class CompanyInfoUpdate(BaseModel):
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    phones: Optional[List[Any]] = None
    email: Optional[EmailStr] = None
    address: Optional[Dict[str, Any]] = None
    working_hours: Optional[Dict[str, Any]] = None
    stats: Optional[List[Any]] = None


class CompanyInfoAdmin(CompanyInfoPublic):
    model_config = ADMIN_CONFIG

    id: int
