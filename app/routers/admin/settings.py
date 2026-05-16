from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.settings_schemas import SiteSettingsUpdate, SiteSettingsResponse
from services.settings_service import get_settings, update_settings, update_logo
from core.security.dependencies import get_current_admin
from utils.cloudinary_helper import CloudinaryHelper

adminSettingsRouter = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]


@adminSettingsRouter.get("/", response_model=SiteSettingsResponse)
def get_site_settings(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    settings = get_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="Site settings not found")
    return settings


@adminSettingsRouter.put("/", response_model=SiteSettingsResponse)
def edit_site_settings(
    data: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return update_settings(db, data)


@adminSettingsRouter.post("/logo", response_model=SiteSettingsResponse)
def upload_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP, SVG allowed")

    existing = get_settings(db)
    if existing and existing.logo_url:
        old_public_id = CloudinaryHelper.extract_public_id(existing.logo_url)
        if old_public_id:
            CloudinaryHelper.delete_image(old_public_id)

    logo_url = CloudinaryHelper.upload_image(file.file, folder="fandf/logo")
    return update_logo(db, logo_url)