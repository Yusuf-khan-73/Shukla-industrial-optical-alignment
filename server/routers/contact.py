"""Contact form public and admin routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.contact import ContactMessage
from schemas.contact import ContactCreate, ContactMessageAdmin, ContactReadUpdate, ContactResponse

router = APIRouter(tags=["Contact"])


@router.post("/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactCreate, db: DbSession):
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return ContactResponse(id=message.id)


@router.get("/admin/contact-messages", response_model=list[ContactMessageAdmin])
def list_contact_messages(db: DbSession, _: CurrentUser, unread_only: bool = False):
    query = db.query(ContactMessage).order_by(ContactMessage.created_at.desc())
    if unread_only:
        query = query.filter(ContactMessage.is_read.is_(False))
    return query.all()


@router.patch("/admin/contact-messages/{item_id}", response_model=ContactMessageAdmin)
def mark_contact_read(item_id: int, payload: ContactReadUpdate, db: DbSession, _: CurrentUser):
    message = db.query(ContactMessage).filter(ContactMessage.id == item_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    message.is_read = payload.is_read
    db.commit()
    db.refresh(message)
    return message


@router.delete("/admin/contact-messages/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(item_id: int, db: DbSession, _: CurrentUser):
    message = db.query(ContactMessage).filter(ContactMessage.id == item_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    db.delete(message)
    db.commit()
