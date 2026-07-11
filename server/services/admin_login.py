"""
Helpers for resolving the admin login identity from Company Settings.
Location: server/services/admin_login.py
"""
from sqlalchemy import func
from sqlalchemy.orm import Session

from models.company import CompanyInformation
from models.user import User
from config.settings import settings

DEFAULT_PUBLIC_EMAIL = settings.company_email

DEFAULT_ADMIN_LOGIN_EMAIL = settings.admin_email
DEFAULT_COMPANY_NAME = "SHUKLA INDUSTRIAL OPTICAL ALIGNMENT"


def normalize_email(email: str | None) -> str:
    return (email or "").strip().lower()


def get_company_record(db: Session) -> CompanyInformation | None:
    return db.query(CompanyInformation).first()


def get_admin_login_email(db: Session) -> str | None:
    company = get_company_record(db)
    if not company or not company.admin_login_email:
        return None
    return normalize_email(company.admin_login_email)


def find_admin_user_by_login_email(db: Session, email: str) -> User | None:
    """
    Authenticate against Company Settings admin_login_email.

    The entered email must match company_information.admin_login_email.
    The corresponding users row is then used for password verification.
    """
    requested = normalize_email(email)
    if not requested:
        return None

    admin_login = get_admin_login_email(db)
    if not admin_login or requested != admin_login:
        return None

    return (
        db.query(User)
        .filter(func.lower(User.email) == admin_login)
        .first()
    )


def sync_user_email_from_admin_login(
    db: Session,
    previous_email: str,
    new_email: str,
) -> User | None:
    """Keep users.email in sync when admin_login_email changes in Company Settings."""
    previous = normalize_email(previous_email)
    new = normalize_email(new_email)
    if not new:
        return None

    if previous == new:
        return (
            db.query(User)
            .filter(func.lower(User.email) == new)
            .first()
        )

    user = (
        db.query(User)
        .filter(func.lower(User.email) == previous)
        .first()
    )
    if not user:
        user = (
            db.query(User)
            .filter(User.is_superuser.is_(True))
            .order_by(User.id.asc())
            .first()
        )

    if not user:
        return None

    conflict = (
        db.query(User)
        .filter(func.lower(User.email) == new, User.id != user.id)
        .first()
    )
    if conflict:
        raise ValueError("Admin login email is already in use by another account.")

    user.email = new
    return user
