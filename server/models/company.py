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
    phones: Mapped[Optional[list[Any]]] = mapped_column(JSONB, nullable=True, default=list)
    email: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    address: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True, default=dict)
    working_hours: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True, default=dict)
    stats: Mapped[Optional[list[Any]]] = mapped_column(JSONB, nullable=True, default=list)
