"""Authentication schemas."""
from pydantic import BaseModel, EmailStr, Field

from schemas.common import ADMIN_CONFIG


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ADMIN_CONFIG

    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    is_superuser: bool
