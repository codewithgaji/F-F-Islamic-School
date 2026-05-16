from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import GalleryResponse, GalleryCategoryResponse
from services.gallery_service import (
    get_all_images,
    get_image_by_id,
    get_all_categories
)

galleryRouter = APIRouter()


@galleryRouter.get("/categories", response_model=list[GalleryCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return get_all_categories(db)


@galleryRouter.get("/", response_model=list[GalleryResponse])
def get_images(
    category: str = None,
    db: Session = Depends(get_db)
):
    return get_all_images(db, category_filter_key=category)


@galleryRouter.get("/{image_id}", response_model=GalleryResponse)
def get_image(
    image_id: int,
    db: Session = Depends(get_db)
):
    image = get_image_by_id(db, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image