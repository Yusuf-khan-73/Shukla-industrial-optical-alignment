"""Site settings singleton model."""
from typing import Any, Optional

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base, TimestampMixin


class SiteSettings(Base, TimestampMixin):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    map_embed_url: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    social_links: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True, default=dict)
    seo_defaults: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True, default=dict)
