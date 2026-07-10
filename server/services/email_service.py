"""Email sending utilities for contact inquiries and admin notifications."""
from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from typing import Any

from sqlalchemy.orm import Session

from config.settings import settings
from repositories.contact_repository import ContactRepository

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ContactRepository(db)

    def send_contact_email(self, *, to_email: str, subject: str, html_body: str, text_body: str,
                           message: Any, event_type: str) -> bool:
        if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
            self.repository.add_log(
                message,
                event_type=event_type,
                recipient=to_email,
                subject=subject,
                status="FAILED",
                message="SMTP settings are not configured",
            )
            return False

        smtp_from = settings.smtp_from_email or settings.smtp_user
        sender_name = settings.smtp_from_name or settings.company_name
        message_obj = MIMEMultipart("alternative")
        message_obj["Subject"] = subject
        message_obj["From"] = formataddr((sender_name, smtp_from))
        message_obj["To"] = to_email
        message_obj.attach(MIMEText(text_body, "plain", "utf-8"))
        message_obj.attach(MIMEText(html_body, "html", "utf-8"))

        try:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=30) as server:
                if settings.smtp_use_tls:
                    server.starttls()
                if settings.smtp_use_ssl:
                    server.login(settings.smtp_user, settings.smtp_password)
                server.sendmail(smtp_from, [to_email], message_obj.as_string())
            self.repository.add_log(
                message,
                event_type=event_type,
                recipient=to_email,
                subject=subject,
                status="SUCCESS",
                message="Email sent successfully",
            )
            return True
        except Exception as exc:  # pragma: no cover - network failure path
            logger.exception("Failed to send contact email")
            self.repository.add_log(
                message,
                event_type=event_type,
                recipient=to_email,
                subject=subject,
                status="FAILED",
                message=str(exc),
            )
            return False
