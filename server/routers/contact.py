"""Contact form public and admin routes."""
import logging

from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.contact import ContactMessage
from schemas.contact import ContactCreate, ContactMessageAdmin, ContactReadUpdate, ContactResponse
from services.email import (
    generate_inquiry_number,
    send_contact_admin_notification,
    send_contact_customer_thank_you,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Contact"])


@router.post("/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactCreate, db: DbSession):
    # --- STEP 1 (CRITICAL — EXISTING FLOW, unchanged): save inquiry to
    # PostgreSQL first. If this fails, it is a genuine save failure and the
    # request SHOULD surface an error — that part of the contract is
    # unchanged from before the email feature existed. ---
    record = ContactMessage(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    logger.info("Inquiry created | id=%s", record.id)

    # --- STEP 2: build the success response NOW, before touching anything
    # optional. Whatever happens below, this is what gets returned. ---
    response = ContactResponse(id=record.id, inquiry_number=None)

    # --- STEP 3 (OPTIONAL / BEST-EFFORT): inquiry number + emails.
    # Everything in this block is wrapped in a single try/except so that no
    # failure here — SMTP down, template missing, DB hiccup, anything — can
    # ever turn into an HTTP 500 for this endpoint. The inquiry is already
    # safely committed above. ---
    try:
        inquiry_number = generate_inquiry_number(db)
        record.inquiry_number = inquiry_number
        db.commit()
        db.refresh(record)
        response.inquiry_number = inquiry_number

        email_kwargs = dict(
            inquiry_number=inquiry_number,
            name=record.name,
            phone=record.phone,
            email=record.email,
            company_name=record.company_name,
            city=record.city,
            service_required=record.service_required,
            message=record.message,
        )

        admin_sent = send_contact_admin_notification(db=db, **email_kwargs)
        customer_sent = send_contact_customer_thank_you(**email_kwargs)

        logger.info(
            "Inquiry %s | admin_email=%s | customer_email=%s",
            inquiry_number,
            "sent" if admin_sent else "failed",
            "sent" if customer_sent else "failed",
        )

        record.admin_email_sent = admin_sent
        record.customer_email_sent = customer_sent
        record.email_error = None if (admin_sent and customer_sent) else "SMTP send failed for one or more notifications"
        db.commit()
    except Exception:
        # Never fail the API because of this. Roll back only the optional
        # bookkeeping above (the original inquiry save is unaffected — it
        # was already committed in STEP 1) and log for diagnostics.
        logger.exception("Email/inquiry-number step failed | id=%s", record.id)
        db.rollback()

    # --- STEP 4: always return success once STEP 1 has committed. ---
    return response


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