"""Email and activity logs for contact inquiries."""
from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base, TimestampMixin


class ContactEmailLog(Base, TimestampMixin):
    __tablename__ = "contact_email_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    contact_message_id: Mapped[int] = mapped_column(ForeignKey("contact_messages.id"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    recipient: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    subject: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="SUCCESS")
    message: Mapped[str] = mapped_column(Text, nullable=False, default="")
    retry_count: Mapped[int] = mapped_column(nullable=False, default=0)
