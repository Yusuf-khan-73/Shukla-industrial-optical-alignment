"""Service layer for contact inquiry validation and persistence."""
from __future__ import annotations

import re
from typing import Any

MAX_MESSAGE_LENGTH = 2000
MIN_MESSAGE_LENGTH = 10


def sanitize_text(value: str | None) -> str:
    if value is None:
        return ""
    text = value or ""
    text = re.sub(r"<script.*?</script>", " ", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def validate_contact_payload(payload: dict[str, Any]) -> dict[str, Any]:
    cleaned: dict[str, Any] = {}
    name = sanitize_text(payload.get("name"))
    phone = sanitize_text(payload.get("phone"))
    email = sanitize_text(payload.get("email"))
    company_name = sanitize_text(payload.get("company_name"))
    city = sanitize_text(payload.get("city"))
    service_required = sanitize_text(payload.get("service_required"))
    message = sanitize_text(payload.get("message"))

    if not name or len(name) < 2:
        raise ValueError("Name is required")
    if not re.fullmatch(r"[+]?\d[\d\s-]{9,14}", phone.replace(" ", "")):
        raise ValueError("Please enter a valid phone number")
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise ValueError("Please enter a valid email")
    if not city:
        raise ValueError("City is required")
    if not service_required:
        raise ValueError("Service is required")
    if len(message) < MIN_MESSAGE_LENGTH:
        raise ValueError("Message is too short")
    if len(message) > MAX_MESSAGE_LENGTH:
        raise ValueError("Message is too long")

    cleaned.update(
        {
            "name": name,
            "phone": phone,
            "email": email.lower(),
            "company_name": company_name,
            "city": city,
            "service_required": service_required,
            "message": message,
        }
    )
    return cleaned
