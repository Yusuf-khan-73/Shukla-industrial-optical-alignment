"""Testimonial public and admin routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.testimonial import Testimonial
from schemas.testimonial import TestimonialAdmin, TestimonialCreate, TestimonialPublic, TestimonialUpdate

router = APIRouter(tags=["Testimonials"])


@router.get("/testimonials", response_model=list[TestimonialPublic])
def list_testimonials(db: DbSession, featured: bool | None = None):
    query = db.query(Testimonial).filter(Testimonial.is_active.is_(True)).order_by(
        Testimonial.sort_order, Testimonial.id
    )
    if featured is not None:
        query = query.filter(Testimonial.featured.is_(featured))
    return query.all()


@router.get("/admin/testimonials", response_model=list[TestimonialAdmin])
def admin_list_testimonials(db: DbSession, _: CurrentUser):
    return db.query(Testimonial).order_by(Testimonial.sort_order, Testimonial.id).all()


@router.post("/admin/testimonials", response_model=TestimonialAdmin, status_code=status.HTTP_201_CREATED)
def create_testimonial(payload: TestimonialCreate, db: DbSession, _: CurrentUser):
    item = Testimonial(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/admin/testimonials/{item_id}", response_model=TestimonialAdmin)
def update_testimonial(item_id: int, payload: TestimonialUpdate, db: DbSession, _: CurrentUser):
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/admin/testimonials/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(item_id: int, db: DbSession, _: CurrentUser):
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    db.delete(item)
    db.commit()
