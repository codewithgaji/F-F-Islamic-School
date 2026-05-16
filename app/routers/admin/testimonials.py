from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from schemas.content_schemas import TestimonialResponse
from services.testimonials_service import (
    get_all_testimonials,
    get_testimonial_by_id,
    create_testimonial,
    update_testimonial,
    delete_testimonial
)
from core.security.dependencies import get_current_admin
from utils.cloudinary_helper import CloudinaryHelper

adminTestimonialsRouter = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]


@adminTestimonialsRouter.get("/", response_model=list[TestimonialResponse])
def get_testimonials(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_testimonials(db)


@adminTestimonialsRouter.get("/{testimonial_id}", response_model=TestimonialResponse)
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    testimonial = get_testimonial_by_id(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial


@adminTestimonialsRouter.post("/", response_model=TestimonialResponse, status_code=201)
def add_testimonial(
    quote: str = Form(...),
    parent_name: str = Form(...),
    profession: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    image_url = None
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/testimonials")

    from schemas.content_schemas import TestimonialCreate
    data = TestimonialCreate(
        quote=quote,
        parent_name=parent_name,
        profession=profession,
        image_url=image_url
    )
    return create_testimonial(db, data)


@adminTestimonialsRouter.put("/{testimonial_id}", response_model=TestimonialResponse)
def edit_testimonial(
    testimonial_id: int,
    quote: Optional[str] = Form(None),
    parent_name: Optional[str] = Form(None),
    profession: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_testimonial_by_id(db, testimonial_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    image_url = existing.image_url
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        if existing.image_url:
            old_public_id = CloudinaryHelper.extract_public_id(existing.image_url)
            if old_public_id:
                CloudinaryHelper.delete_image(old_public_id)
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/testimonials")

    from schemas.content_schemas import TestimonialUpdate
    data = TestimonialUpdate(
        quote=quote,
        parent_name=parent_name,
        profession=profession,
        image_url=image_url
    )
    updated = update_testimonial(db, testimonial_id, data)
    return updated


@adminTestimonialsRouter.delete("/{testimonial_id}", status_code=204)
def remove_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_testimonial_by_id(db, testimonial_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    if existing.image_url:
        public_id = CloudinaryHelper.extract_public_id(existing.image_url)
        if public_id:
            CloudinaryHelper.delete_image(public_id)
    delete_testimonial(db, testimonial_id)