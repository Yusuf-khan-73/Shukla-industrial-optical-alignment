"""Company information routes."""
from fastapi import APIRouter

from core.deps import CurrentUser, DbSession
from models.company import CompanyInformation
from schemas.company import CompanyInfoAdmin, CompanyInfoPublic, CompanyInfoUpdate

router = APIRouter(tags=["Company Info"])


def get_or_create_company(db) -> CompanyInformation:
    company = db.query(CompanyInformation).first()
    if company:
        return company
    company = CompanyInformation(
        company_name="SHUKLA INDUSTRIAL OPTICAL ALIGNMENT",
        tagline="Precision • Accuracy • Reliability",
        description="",
        phones=[],
        email="sioaw98@yahoo.com",
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


@router.get("/company-info", response_model=CompanyInfoPublic)
def get_company_info(db: DbSession):
    return get_or_create_company(db)


@router.put("/admin/company-info", response_model=CompanyInfoAdmin)
def update_company_info(payload: CompanyInfoUpdate, db: DbSession, _: CurrentUser):
    company = get_or_create_company(db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(company, key, value)
    db.commit()
    db.refresh(company)
    return company
