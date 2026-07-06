"""Gallery public and admin routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.gallery import Gallery, GalleryImage
from schemas.gallery import GalleryAdmin, GalleryCreate, GalleryPublic, GalleryUpdate
from services.helpers import serialize_gallery

router = APIRouter(tags=["Gallery"])


@router.get("/gallery", response_model=list[GalleryPublic])
def list_gallery(db: DbSession, featured: bool | None = None, category: str | None = None):
    query = db.query(Gallery).filter(Gallery.is_active.is_(True)).order_by(Gallery.sort_order, Gallery.id)
    if featured is not None:
        query = query.filter(Gallery.featured.is_(featured))
    if category and category != "all":
        query = query.filter(Gallery.category == category)
    return [serialize_gallery(g) for g in query.all()]


@router.get("/gallery/{item_id}", response_model=GalleryPublic)
def get_gallery_item(item_id: int, db: DbSession):
    item = db.query(Gallery).filter(Gallery.id == item_id, Gallery.is_active.is_(True)).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    return serialize_gallery(item)


@router.get("/admin/gallery", response_model=list[GalleryAdmin])
def admin_list_gallery(db: DbSession, _: CurrentUser):
    return [
        serialize_gallery(g) | {"isActive": g.is_active, "sortOrder": g.sort_order}
        for g in db.query(Gallery).order_by(Gallery.sort_order, Gallery.id).all()
    ]


@router.post("/admin/gallery", response_model=GalleryAdmin, status_code=status.HTTP_201_CREATED)
def create_gallery(payload: GalleryCreate, db: DbSession, _: CurrentUser):
    item = Gallery(**payload.model_dump(exclude={"images"}))
    for idx, img in enumerate(payload.images):
        item.images.append(
            GalleryImage(
                image_url=img.image_url,
                alt_text=img.alt_text,
                sort_order=img.sort_order or idx,
            )
        )
    db.add(item)
    db.commit()
    db.refresh(item)
    return serialize_gallery(item) | {"isActive": item.is_active, "sortOrder": item.sort_order}


@router.put("/admin/gallery/{item_id}", response_model=GalleryAdmin)
def update_gallery(item_id: int, payload: GalleryUpdate, db: DbSession, _: CurrentUser):
    item = db.query(Gallery).filter(Gallery.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    data = payload.model_dump(exclude_unset=True)
    images = data.pop("images", None)
    for key, value in data.items():
        setattr(item, key, value)
    if images is not None:
        item.images.clear()
        for idx, img in enumerate(images):
            item.images.append(
                GalleryImage(
                    image_url=img["image_url"],
                    alt_text=img.get("alt_text", ""),
                    sort_order=img.get("sort_order", idx),
                )
            )
    db.commit()
    db.refresh(item)
    return serialize_gallery(item) | {"isActive": item.is_active, "sortOrder": item.sort_order}


@router.delete("/admin/gallery/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery(item_id: int, db: DbSession, _: CurrentUser):
    item = db.query(Gallery).filter(Gallery.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
    db.delete(item)
    db.commit()
