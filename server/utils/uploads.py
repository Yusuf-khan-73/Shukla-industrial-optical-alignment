"""
File upload utilities for admin image uploads.
Location: server/utils/uploads.py
"""
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from config.settings import settings

UPLOAD_ROOT = Path(settings.upload_dir)


def ensure_upload_dir() -> Path:
    UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
    return UPLOAD_ROOT


async def save_upload(file: UploadFile, subfolder: str = "images") -> str:
    if file.content_type not in settings.allowed_image_type_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {settings.allowed_image_types}",
        )

    content = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max {settings.max_upload_size_mb}MB",
        )

    ext = Path(file.filename or "image.jpg").suffix.lower() or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    dest_dir = ensure_upload_dir() / subfolder
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / filename
    dest_path.write_bytes(content)

    return f"/uploads/{subfolder}/{filename}"
