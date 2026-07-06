"""Admin file upload routes."""
from fastapi import APIRouter, File, UploadFile

from core.deps import CurrentUser
from utils.uploads import save_upload

router = APIRouter(prefix="/admin/uploads", tags=["Uploads"])


@router.post("")
async def upload_image(_: CurrentUser, file: UploadFile = File(...), folder: str = "images"):
    url = await save_upload(file, subfolder=folder)
    return {"url": url, "filename": url.split("/")[-1]}
