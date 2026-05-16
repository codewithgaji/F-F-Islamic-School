from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import HeroSlideResponse
from services.hero_slides_service import get_all_slides, get_slide_by_id

heroSlidesRouter = APIRouter()


@heroSlidesRouter.get("/", response_model=list[HeroSlideResponse])
def get_slides(db: Session = Depends(get_db)):
    return get_all_slides(db, active_only=True)



@heroSlidesRouter.get("/{slide_id}", response_model=HeroSlideResponse)
def get_slide(
    slide_id: int,
    db: Session = Depends(get_db)
):
    slide = get_slide_by_id(db, slide_id)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide