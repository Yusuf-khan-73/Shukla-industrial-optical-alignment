"""
Application settings loaded from environment variables.
Location: server/config/settings.py
"""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Shukla Industrial Optical Alignment API"
    app_env: str = "development"
    debug: bool = True

    api_v1_prefix: str = "/api/v1"

    host: str = "0.0.0.0"
    port: int = 8000


    # DATABASE

    database_url: str = ""


    # JWT

    secret_key: str = ""
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60


    # CORS

    cors_origins: str = ""


    # Upload

    upload_dir: str = "uploads"

    max_upload_size_mb: int = 10

    allowed_image_types: str = (
        "image/jpeg,image/png,image/webp,image/gif"
    )


    # ADMIN

    admin_email: str = ""

    admin_password: str = ""


    # FRONTEND

    frontend_url: str = "http://localhost:5173"


    password_reset_expire_minutes: int = 15

    password_reset_path: str = "/reset-password"



    # COMPANY

    company_name: str = (
        "SHUKLA INDUSTRIAL OPTICAL ALIGNMENT"
    )

    company_phone: str = "+91 9510900608"

    company_email: str = "sioaw98@yahoo.com"

    company_website: str = "www.shuklaalignment.com"



    # ==========================
    # SMTP SETTINGS
    # ==========================


    smtp_host: str = "smtp.gmail.com"

    smtp_port: int = 587


    smtp_user: str = Field(
        default="",
        validation_alias="SMTP_USERNAME"
    )


    smtp_password: str = Field(
        default="",
        validation_alias="SMTP_PASSWORD"
    )


    smtp_from_email: str = Field(
        default="",
        validation_alias="SMTP_FROM_EMAIL"
    )


    smtp_from_name: str = Field(
        default="",
        validation_alias="SMTP_FROM_NAME"
    )


    smtp_use_tls: bool = True

    smtp_use_ssl: bool = False



    admin_dashboard_path: str = "/admin"



    @property
    def password_reset_url_base(self):
        return (
            f"{self.frontend_url.rstrip('/')}"
            f"{self.password_reset_path}"
        )


    @property
    def admin_dashboard_url(self):

        return (
            f"{self.frontend_url.rstrip('/')}"
            f"{self.admin_dashboard_path}"
        )


    @property
    def cors_origin_list(self)->List[str]:

        return [
            x.strip()
            for x in self.cors_origins.split(",")
            if x.strip()
        ]


    @property
    def allowed_image_type_list(self):

        return [
            x.strip()
            for x in self.allowed_image_types.split(",")
            if x.strip()
        ]



@lru_cache
def get_settings():

    return Settings()



settings = get_settings()