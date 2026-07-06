"""Hero slides public and admin routes."""
from fastapi import APIRouter, HTTPException, status

from core.deps import CurrentUser, DbSession
from models.hero import HeroSlide
from schemas.hero import HeroSlideAdmin, HeroSlideCreate, HeroSlidePublic, HeroSlideUpdate

router = APIRouter(tags=["Hero Slides"])


@router.get("/hero-slides", response_model=list[HeroSlidePublic])
def list_hero_slides(db: DbSession):
    return (
        db.query(HeroSlide)
        .filter(HeroSlide.is_active.is_(True))
        .order_by(HeroSlide.sort_order, HeroSlide.id)
        .all()
    )


@router.get("/admin/hero-slides", response_model=list[HeroSlideAdmin])
def admin_list_hero_slides(db: DbSession, _: CurrentUser):
    return db.query(HeroSlide).order_by(HeroSlide.sort_order, HeroSlide.id).all()


@router.post("/admin/hero-slides", response_model=HeroSlideAdmin, status_code=status.HTTP_201_CREATED)
def create_hero_slide(payload: HeroSlideCreate, db: DbSession, _: CurrentUser):
    slide = HeroSlide(**payload.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


@router.put("/admin/hero-slides/{item_id}", response_model=HeroSlideAdmin)
def update_hero_slide(item_id: int, payload: HeroSlideUpdate, db: DbSession, _: CurrentUser):
    slide = db.query(HeroSlide).filter(HeroSlide.id == item_id).first()
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hero slide not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(slide, key, value)
    db.commit()
    db.refresh(slide)
    return slide


@router.delete("/admin/hero-slides/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hero_slide(item_id: int, db: DbSession, _: CurrentUser):
    slide = db.query(HeroSlide).filter(HeroSlide.id == item_id).first()
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hero slide not found")
    db.delete(slide)
    db.commit()
