"""Testimonial schemas."""
from pydantic import BaseModel

from schemas.common import ADMIN_CONFIG, PUBLIC_CONFIG


class TestimonialPublic(BaseModel):
    model_config = PUBLIC_CONFIG

    id: int
    name: str
    designation: str
    company: str
    quote: str
    rating: int
    initials: str
    featured: bool


class TestimonialCreate(BaseModel):
    name: str
    designation: str = ""
    company: str
    quote: str
    rating: int = 5
    initials: str = ""
    featured: bool = False
    is_active: bool = True
    sort_order: int = 0


class TestimonialUpdate(BaseModel):
    name: str | None = None
    designation: str | None = None
    company: str | None = None
    quote: str | None = None
    rating: int | None = None
    initials: str | None = None
    featured: bool | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class TestimonialAdmin(TestimonialPublic):
    model_config = ADMIN_CONFIG

    is_active: bool
    sort_order: int
