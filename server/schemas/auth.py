"""Authentication schemas."""
import re
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from schemas.common import ADMIN_CONFIG

PASSWORD_MIN_LENGTH = 8
PASSWORD_PATTERN = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
)
PASSWORD_REQUIREMENTS_MSG = (
    "Password must be at least 8 characters and include uppercase, "
    "lowercase, number, and special character."
)


def validate_strong_password(value: str) -> str:
    if not PASSWORD_PATTERN.match(value):
        raise ValueError(PASSWORD_REQUIREMENTS_MSG)
    return value


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
    secondary_email: Optional[str] = ""
    full_name: str
    phone: Optional[str] = ""
    profile_picture: Optional[str] = ""
    is_active: bool
    is_superuser: bool


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=20)
    password: str = Field(min_length=PASSWORD_MIN_LENGTH)

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        return validate_strong_password(value)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=6)
    new_password: str = Field(min_length=PASSWORD_MIN_LENGTH)

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        return validate_strong_password(value)


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    secondary_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None


class MessageResponse(BaseModel):
    message: str


class VerifyResetTokenResponse(BaseModel):
    valid: bool
    email: Optional[str] = None
    message: str
