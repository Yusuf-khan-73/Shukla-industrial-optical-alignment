"""Service public and admin routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.service import Service, ServiceImage
from schemas.service import ServiceAdmin, ServiceCreate, ServicePublic, ServiceUpdate

router = APIRouter(tags=["Services"])


def serialize_service(service: Service) -> dict:
    return ServicePublic.model_validate(service).model_dump(by_alias=True)


@router.get("/services", response_model=list[ServicePublic])
def list_services(db: DbSession):
    items = db.query(Service).filter(Service.is_active.is_(True)).order_by(Service.sort_order, Service.id).all()
    return [serialize_service(s) for s in items]


@router.get("/services/{slug}", response_model=ServicePublic)
def get_service_by_slug(slug: str, db: DbSession):
    service = db.query(Service).filter(Service.slug == slug, Service.is_active.is_(True)).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return serialize_service(service)


@router.get("/admin/services", response_model=list[ServiceAdmin])
def admin_list_services(db: DbSession, _: CurrentUser):
    return db.query(Service).order_by(Service.sort_order, Service.id).all()


@router.post("/admin/services", response_model=ServiceAdmin, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, db: DbSession, _: CurrentUser):
    if db.query(Service).filter(Service.slug == payload.slug).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    service = Service(**payload.model_dump(exclude={"images"}))
    for idx, img in enumerate(payload.images):
        service.images.append(
            ServiceImage(
                image_url=img.image_url,
                alt_text=img.alt_text,
                sort_order=img.sort_order or idx,
            )
        )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/admin/services/{item_id}", response_model=ServiceAdmin)
def update_service(item_id: int, payload: ServiceUpdate, db: DbSession, _: CurrentUser):
    service = db.query(Service).filter(Service.id == item_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    data = payload.model_dump(exclude_unset=True)
    images = data.pop("images", None)
    for key, value in data.items():
        setattr(service, key, value)
    if images is not None:
        service.images.clear()
        for idx, img in enumerate(images):
            service.images.append(
                ServiceImage(
                    image_url=img["image_url"],
                    alt_text=img.get("alt_text", ""),
                    sort_order=img.get("sort_order", idx),
                )
            )
    db.commit()
    db.refresh(service)
    return service


@router.delete("/admin/services/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(item_id: int, db: DbSession, _: CurrentUser):
    service = db.query(Service).filter(Service.id == item_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    db.delete(service)
    db.commit()
