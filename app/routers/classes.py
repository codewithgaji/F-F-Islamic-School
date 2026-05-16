from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import ClassResponse
from services.classes_service import get_all_classes, get_class_by_id

classesRouter = APIRouter()


@classesRouter.get("/", response_model=list[ClassResponse])
def get_classes(
    featured: bool = False,
    limit: int = None,
    db: Session = Depends(get_db)
):
    return get_all_classes(db, featured_only=featured)


@classesRouter.get("/{class_id}", response_model=ClassResponse)
def get_class(
    class_id: int,
    db: Session = Depends(get_db)
):
    existing_class = get_class_by_id(db, class_id)
    if not existing_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return existing_class