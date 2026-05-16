from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from schemas.content_schemas import TeacherResponse
from services.teachers_service import (
    get_all_teachers,
    get_teacher_by_id,
    create_teacher,
    update_teacher,
    delete_teacher
)
from core.security.dependencies import get_current_admin
from utils.cloudinary_helper import CloudinaryHelper

adminTeacherRouter = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]


@adminTeacherRouter.get("/", response_model=list[TeacherResponse])
def get_teachers(
    limit: int = None,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_teachers(db, limit=limit)


@adminTeacherRouter.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    teacher = get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@adminTeacherRouter.post("/", response_model=TeacherResponse, status_code=201)
def add_teacher(
    name: str = Form(...),
    role: str = Form(...),
    bio: Optional[str] = Form(None),
    twitter: Optional[str] = Form(None),
    facebook: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    image_url = None
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/teachers")

    from schemas.content_schemas import TeacherCreate
    data = TeacherCreate(
        name=name,
        role=role,
        bio=bio,
        image_url=image_url,
        twitter=twitter,
        facebook=facebook,
        linkedin=linkedin
    )
    return create_teacher(db, data)


@adminTeacherRouter.put("/{teacher_id}", response_model=TeacherResponse)
def edit_teacher(
    teacher_id: int,
    name: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    twitter: Optional[str] = Form(None),
    facebook: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_teacher_by_id(db, teacher_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Teacher not found")

    image_url = existing.image_url
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        if existing.image_url:
            old_public_id = CloudinaryHelper.extract_public_id(existing.image_url)
            if old_public_id:
                CloudinaryHelper.delete_image(old_public_id)
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/teachers")

    from schemas.content_schemas import TeacherUpdate
    data = TeacherUpdate(
        name=name,
        role=role,
        bio=bio,
        image_url=image_url,
        twitter=twitter,
        facebook=facebook,
        linkedin=linkedin
    )
    updated = update_teacher(db, teacher_id, data)
    return updated


@adminTeacherRouter.delete("/{teacher_id}", status_code=204)
def remove_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_teacher_by_id(db, teacher_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Teacher not found")
    if existing.image_url:
        public_id = CloudinaryHelper.extract_public_id(existing.image_url)
        if public_id:
            CloudinaryHelper.delete_image(public_id)
    delete_teacher(db, teacher_id)