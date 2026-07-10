"""Contact message schemas."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class ContactCreate(BaseModel):
    name: str = Field(min_length=2)
    phone: str = Field(min_length=10)
    email: EmailStr
    company_name: str = ""
    city: str = Field(min_length=1)
    service_required: str = Field(min_length=1)
    message: str = Field(min_length=10)


class ContactResponse(BaseModel):
    model_config = PUBLIC_CONFIG

    id: int
    message: str = "Thank you! Your inquiry has been received. We will contact you shortly."
    inquiry_number: Optional[str] = None


class ContactMessageAdmin(BaseModel):
    model_config = ADMIN_CONFIG

    id: int
    name: str
    phone: str
    email: EmailStr
    company_name: str
    city: str
    service_required: str
    message: str
    is_read: bool
    created_at: datetime
    inquiry_number: Optional[str] = None
    admin_email_sent: bool = False
    customer_email_sent: bool = False


class ContactReadUpdate(BaseModel):
    is_read: bool