"""Repository layer for contact inquiry persistence and admin history."""
from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from models.contact import ContactMessage

    
class ContactRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_message(self, payload: dict[str, Any]) -> ContactMessage:
        message = ContactMessage(**payload)
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def list_messages(self, unread_only: bool = False) -> list[ContactMessage]:
        query = self.db.query(ContactMessage).order_by(ContactMessage.created_at.desc())
        if unread_only:
            query = query.filter(ContactMessage.is_read.is_(False))
        return query.all()

    def get_message(self, item_id: int) -> ContactMessage | None:
        return self.db.query(ContactMessage).filter(ContactMessage.id == item_id).first()

    def update_message(self, message: ContactMessage, *, is_read: bool | None = None) -> ContactMessage:
        if is_read is not None:
            message.is_read = is_read
        self.db.commit()
        self.db.refresh(message)
        return message
