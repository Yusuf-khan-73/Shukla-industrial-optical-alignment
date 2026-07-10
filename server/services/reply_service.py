"""Admin reply workflow for contact inquiries."""
from __future__ import annotations

from sqlalchemy.orm import Session

from repositories.contact_repository import ContactRepository
from services.email_service import EmailService
from services.template_service import TemplateService


class ReplyService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ContactRepository(db)
        self.email_service = EmailService(db)
        self.template_service = TemplateService()

    def send_reply(self, message, *, subject: str, body: str) -> bool:
        template = self.template_service.build_customer_acknowledgement(message)
        sent = self.email_service.send_contact_email(
            to_email=message.email,
            subject=subject or f"Re: {message.inquiry_number}",
            html_body=template["html"],
            text_body=body,
            message=message,
            event_type="ADMIN_REPLY",
        )
        self.repository.update_message(
            message,
            status="REPLIED" if sent else "NEW",
            reply_subject=subject,
            reply_message=body,
            replied_at=None if not sent else message.created_at,
        )
        return sent
