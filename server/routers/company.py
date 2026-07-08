"""Company information routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.company import CompanyInformation
from schemas.company import CompanyInfoAdmin, CompanyInfoPublic, CompanyInfoUpdate
from services.admin_login import (
    DEFAULT_ADMIN_LOGIN_EMAIL,
    DEFAULT_COMPANY_NAME,
    DEFAULT_PUBLIC_EMAIL,
    normalize_email,
    sync_user_email_from_admin_login,
)

router = APIRouter(tags=["Company Info"])


def sync_company_fields(company: CompanyInformation) -> CompanyInformation:
    """Keep JSONB and flat fields in sync for backward compatibility."""
    phones = [p for p in [company.phone_1, company.phone_2] if p]
    if phones:
        company.phones = phones
    elif company.phones:
        company.phone_1 = company.phones[0] if len(company.phones) > 0 else ""
        company.phone_2 = company.phones[1] if len(company.phones) > 1 else ""

    if company.office_address:
        company.address = {
            **(company.address or {}),
            "full": company.office_address,
            "line1": company.office_address,
            "country": (company.address or {}).get("country", "India"),
        }
    elif company.address and company.address.get("full"):
        company.office_address = company.address["full"]

    if not company.whatsapp_number and company.phone_1:
        company.whatsapp_number = "".join(c for c in company.phone_1 if c.isdigit())

    return company


def get_or_create_company(db) -> CompanyInformation:
    company = db.query(CompanyInformation).first()
    if company:
        if not company.admin_login_email:
            company.admin_login_email = DEFAULT_ADMIN_LOGIN_EMAIL
            db.commit()
            db.refresh(company)
        return sync_company_fields(company)

    company = CompanyInformation(
        company_name=DEFAULT_COMPANY_NAME,
        tagline="Precision • Accuracy • Reliability",
        description="",
        phone_1="+91 9510900608",
        phone_2="+91 8707305703",
        phones=["+91 9510900608", "+91 8707305703"],
        email=DEFAULT_PUBLIC_EMAIL,
        admin_login_email=DEFAULT_ADMIN_LOGIN_EMAIL,
        whatsapp_number="919510900608",
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


@router.get("/company-info", response_model=CompanyInfoPublic)
def get_company_info(db: DbSession):
    """Public company profile — admin login email is never exposed."""
    return get_or_create_company(db)


@router.get("/admin/company-info", response_model=CompanyInfoAdmin)
def get_admin_company_info(db: DbSession, _: CurrentUser):
    """Admin company profile including Admin Login Email Address."""
    return get_or_create_company(db)


@router.put("/admin/company-info", response_model=CompanyInfoAdmin)
def update_company_info(payload: CompanyInfoUpdate, db: DbSession, _: CurrentUser):
    company = get_or_create_company(db)
    data = payload.model_dump(exclude_unset=True)
    previous_admin_email = company.admin_login_email

    if "phone_1" in data or "phone_2" in data:
        p1 = data.get("phone_1", company.phone_1)
        p2 = data.get("phone_2", company.phone_2)
        data["phones"] = [p for p in [p1, p2] if p]

    if "office_address" in data and data["office_address"]:
        data["address"] = {
            **(company.address or {}),
            "full": data["office_address"],
            "line1": data["office_address"],
            "country": "India",
        }

    if "admin_login_email" in data:
        new_admin_email = normalize_email(str(data["admin_login_email"] or ""))
        if not new_admin_email:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Admin Login Email Address is required.",
            )
        data["admin_login_email"] = new_admin_email

        try:
            sync_user_email_from_admin_login(db, previous_admin_email, new_admin_email)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(exc),
            ) from exc

    if "email" in data and data["email"] is not None:
        data["email"] = normalize_email(str(data["email"]))

    for key, value in data.items():
        setattr(company, key, value)

    sync_company_fields(company)
    db.commit()
    db.refresh(company)
    return company
