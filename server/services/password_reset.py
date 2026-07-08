"""
Password reset token lifecycle — create, verify, consume, cleanup.
Location: server/services/password_reset.py
"""
import hashlib
import logging
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from config.settings import settings
from models.password_reset import PasswordResetToken
from models.user import User

logger = logging.getLogger(__name__)


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def cleanup_expired_tokens(db: Session) -> int:
    """Remove expired or already-used reset tokens."""
    now = datetime.now(timezone.utc)
    deleted = (
        db.query(PasswordResetToken)
        .filter(
            (PasswordResetToken.expires_at < now)
            | (PasswordResetToken.used.is_(True))
            | (PasswordResetToken.used_at.isnot(None))
        )
        .delete(synchronize_session=False)
    )
    if deleted:
        db.commit()
        logger.info("Cleaned up %s expired/used password reset tokens", deleted)
    return deleted


def invalidate_user_tokens(db: Session, user_id: int) -> None:
    """Invalidate any outstanding reset tokens for a user before issuing a new one."""
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user_id,
        PasswordResetToken.used.is_(False),
        PasswordResetToken.used_at.is_(None),
    ).delete(synchronize_session=False)


def create_reset_token(db: Session, user: User) -> str:
    """Create a secure one-time reset token and return the raw value for the email link."""
    cleanup_expired_tokens(db)
    invalidate_user_tokens(db, user.id)

    raw_token = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.password_reset_expire_minutes
    )

    db.add(
        PasswordResetToken(
            user_id=user.id,
            email=user.email,
            token_hash=hash_reset_token(raw_token),
            expires_at=expires_at,
            used=False,
        )
    )
    db.commit()
    return raw_token


def get_valid_token_record(db: Session, raw_token: str) -> PasswordResetToken | None:
    if not raw_token or len(raw_token) < 20:
        return None

    token_hash = hash_reset_token(raw_token)
    now = datetime.now(timezone.utc)

    record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used.is_(False),
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at >= now,
        )
        .first()
    )
    return record


def consume_reset_token(db: Session, record: PasswordResetToken) -> None:
    """Delete token after successful password reset — one-time use only."""
    db.delete(record)
    db.commit()
