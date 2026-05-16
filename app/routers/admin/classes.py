from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from schemas.content_schemas import ClassResponse
from services.classes_service import (
    get_all_classes,
    get_class_by_id,
    create_class,
    update_class,
    delete_class
)
from core.security.dependencies import get_current_admin
from utils.cloudinary_helper import CloudinaryHelper

adminClassRouter = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]


@adminClassRouter.get("/", response_model=list[ClassResponse])
def get_classes(
    featured: bool = False,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_classes(db, featured_only=featured)


@adminClassRouter.get("/{class_id}", response_model=ClassResponse)
def get_class(
    class_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing_class = get_class_by_id(db, class_id)
    if not existing_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return existing_class


@adminClassRouter.post("/", response_model=ClassResponse, status_code=201)
def add_class(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    age_range: Optional[str] = Form(None),
    total_seats: Optional[int] = Form(None),
    class_time: Optional[str] = Form(None),
    monthly_fee: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    image_url = None
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/classes")

    from schemas.content_schemas import ClassCreate
    data = ClassCreate(
        title=title,
        description=description,
        image_url=image_url,
        age_range=age_range,
        total_seats=total_seats,
        class_time=class_time,
        monthly_fee=monthly_fee,
        is_featured=is_featured
    )
    return create_class(db, data)


@adminClassRouter.put("/{class_id}", response_model=ClassResponse)
def edit_class(
    class_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    age_range: Optional[str] = Form(None),
    total_seats: Optional[int] = Form(None),
    class_time: Optional[str] = Form(None),
    monthly_fee: Optional[str] = Form(None),
    is_featured: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing_class = get_class_by_id(db, class_id)
    if not existing_class:
        raise HTTPException(status_code=404, detail="Class not found")

    image_url = existing_class.image_url
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        if existing_class.image_url:
            old_public_id = CloudinaryHelper.extract_public_id(existing_class.image_url)
            if old_public_id:
                CloudinaryHelper.delete_image(old_public_id)
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/classes")

    from schemas.content_schemas import ClassUpdate
    data = ClassUpdate(
        title=title,
        description=description,
        image_url=image_url,
        age_range=age_range,
        total_seats=total_seats,
        class_time=class_time,
        monthly_fee=monthly_fee,
        is_featured=is_featured
    )
    updated = update_class(db, class_id, data)
    return updated


@adminClassRouter.delete("/{class_id}", status_code=204)
def remove_class(
    class_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing_class = get_class_by_id(db, class_id)
    if not existing_class:
        raise HTTPException(status_code=404, detail="Class not found")
    if existing_class.image_url:
        public_id = CloudinaryHelper.extract_public_id(existing_class.image_url)
        if public_id:
            CloudinaryHelper.delete_image(public_id)
    delete_class(db, class_id)