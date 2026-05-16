from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from schemas.content_schemas import HeroSlideResponse
from services.hero_slides_service import (
    get_all_slides,
    get_slide_by_id,
    create_slide,
    update_slide,
    delete_slide,
    reorder_slides
)
from core.security.dependencies import get_current_admin
from utils.cloudinary_helper import CloudinaryHelper
from pydantic import BaseModel

adminHeroRouter = APIRouter()


class ReorderRequest(BaseModel):
    ordered_ids: list[int]


@adminHeroRouter.get("", response_model=list[HeroSlideResponse])
def get_slides(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return get_all_slides(db)


@adminHeroRouter.get("/{slide_id}", response_model=HeroSlideResponse)
def get_slide(slide_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    slide = get_slide_by_id(db, slide_id)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide


@adminHeroRouter.post("", response_model=HeroSlideResponse, status_code=201)
def add_slide(
    caption: str = Form(...),
    subtitle: str = Form(...),
    order: int = Form(...),
    is_active: bool = Form(True),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if image.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")

    image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/hero")

    from schemas.content_schemas import HeroSlideCreate
    data = HeroSlideCreate(
        image_url=image_url,
        caption=caption,
        subtitle=subtitle,
        order=order,
        is_active=is_active
    )
    return create_slide(db, data)


@adminHeroRouter.put("/{slide_id}", response_model=HeroSlideResponse)
def edit_slide(
    slide_id: int,
    caption: Optional[str] = Form(None),
    subtitle: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    is_active: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_slide_by_id(db, slide_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Slide not found")

    image_url = existing.image_url
    if image and image.filename:
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if image.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        old_public_id = CloudinaryHelper.extract_public_id(existing.image_url)
        if old_public_id:
            CloudinaryHelper.delete_image(old_public_id)
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/hero")

    from schemas.content_schemas import HeroSlideUpdate
    data = HeroSlideUpdate(
        image_url=image_url,
        caption=caption,
        subtitle=subtitle,
        order=order,
        is_active=is_active
    )
    slide = update_slide(db, slide_id, data)
    return slide


@adminHeroRouter.delete("/{slide_id}", status_code=204)
def remove_slide(slide_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    existing = get_slide_by_id(db, slide_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Slide not found")
    public_id = CloudinaryHelper.extract_public_id(existing.image_url)
    if public_id:
        CloudinaryHelper.delete_image(public_id)
    delete_slide(db, slide_id)


@adminHeroRouter.patch("/reorder", response_model=list[HeroSlideResponse])
def reorder(data: ReorderRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return reorder_slides(db, data.ordered_ids)