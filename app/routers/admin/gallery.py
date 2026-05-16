from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from schemas.content_schemas import (
    GalleryResponse,
    GalleryCategoryCreate,
    GalleryCategoryResponse
)
from services.gallery_service import (
    get_all_images,
    get_image_by_id,
    create_image,
    update_image,
    delete_image,
    get_all_categories,
    create_category,
    delete_category
)
from core.security.dependencies import get_current_admin
from utils.cloudinary_helper import CloudinaryHelper

adminGalleryRouter = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]


# --- CATEGORY ROUTES ---

@adminGalleryRouter.get("/categories", response_model=list[GalleryCategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_categories(db)


@adminGalleryRouter.post("/categories", response_model=GalleryCategoryResponse, status_code=201)
def add_category(
    data: GalleryCategoryCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return create_category(db, data.label, data.filter_key)


@adminGalleryRouter.delete("/categories/{category_id}", status_code=204)
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    category = delete_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")


# --- IMAGE ROUTES ---

@adminGalleryRouter.get("/", response_model=list[GalleryResponse])
def get_images(
    category: str = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_images(db, category_filter_key=category)


@adminGalleryRouter.get("/{image_id}", response_model=GalleryResponse)
def get_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    image = get_image_by_id(db, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image


@adminGalleryRouter.post("/", response_model=GalleryResponse, status_code=201)
def add_image(
    category_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")

    image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/gallery")

    from schemas.content_schemas import GalleryCreate
    data = GalleryCreate(
        image_url=image_url,
        category_id=category_id
    )
    return create_image(db, data)


@adminGalleryRouter.put("/{image_id}", response_model=GalleryResponse)
def edit_image(
    image_id: int,
    category_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_image_by_id(db, image_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Image not found")

    image_url = existing.image_url
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        if existing.image_url:
            old_public_id = CloudinaryHelper.extract_public_id(existing.image_url)
            if old_public_id:
                CloudinaryHelper.delete_image(old_public_id)
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/gallery")

    from schemas.content_schemas import GalleryUpdate
    data = GalleryUpdate(
        image_url=image_url,
        category_id=category_id
    )
    updated = update_image(db, image_id, data)
    return updated


@adminGalleryRouter.delete("/{image_id}", status_code=204)
def remove_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_image_by_id(db, image_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Image not found")
    if existing.image_url:
        public_id = CloudinaryHelper.extract_public_id(existing.image_url)
        if public_id:
            CloudinaryHelper.delete_image(public_id)
    delete_image(db, image_id)