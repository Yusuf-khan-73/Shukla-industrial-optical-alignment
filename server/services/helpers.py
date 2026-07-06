"""
Shared service helpers for API serialization.
Location: server/services/helpers.py
"""
from models.gallery import Gallery
from schemas.gallery import GalleryPublic
from schemas.project import ProjectPublic


def serialize_project(project) -> dict:
    return ProjectPublic.model_validate(project).model_dump(by_alias=True)


def serialize_gallery(item: Gallery) -> dict:
    data = GalleryPublic.model_validate(item).model_dump(by_alias=True)
    first = item.images[0] if item.images else None
    if first:
        data["image"] = {"url": first.image_url, "alt": first.alt_text}
    elif data.get("images"):
        img = data["images"][0]
        data["image"] = {"url": img.get("url"), "alt": img.get("alt", "")}
    return data


def replace_nested_images(model, images_in, image_model, fk_name: str):
    """Replace child images on a parent ORM object."""
    model.images.clear()
    for idx, img in enumerate(images_in):
        payload = img.model_dump() if hasattr(img, "model_dump") else img
        model.images.append(
            image_model(
                **payload,
                sort_order=payload.get("sort_order", idx),
            )
        )
