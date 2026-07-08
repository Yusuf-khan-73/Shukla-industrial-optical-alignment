"""Company information singleton model."""
from typing import Any, Optional

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base, TimestampMixin


class CompanyInformation(Base, TimestampMixin):
    __tablename__ = "company_information"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    tagline: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    logo: Mapped[Optional[str]] = mapped_column(String(500), nullable=True, default="")
    phone_1: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="")
    phone_2: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="")
    phones: Mapped[Optional[list[Any]]] = mapped_column(JSONB, nullable=True, default=list)
    email: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    admin_login_email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )
    whatsapp_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, default="")
    office_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True, default="")
    google_map_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True, default="")
    facebook: Mapped[Optional[str]] = mapped_column(String(500), nullable=True, default="")
    instagram: Mapped[Optional[str]] = mapped_column(String(500), nullable=True, default="")
    linkedin: Mapped[Optional[str]] = mapped_column(String(500), nullable=True, default="")
    youtube: Mapped[Optional[str]] = mapped_column(String(500), nullable=True, default="")
    address: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True, default=dict)
    working_hours: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True, default=dict)
    stats: Mapped[Optional[list[Any]]] = mapped_column(JSONB, nullable=True, default=list)
