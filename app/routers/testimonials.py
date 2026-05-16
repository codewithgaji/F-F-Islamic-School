from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import TestimonialResponse
from services.testimonials_service import get_all_testimonials, get_testimonial_by_id

testimonialsRouter = APIRouter()


@testimonialsRouter.get("/", response_model=list[TestimonialResponse])
def get_testimonials(db: Session = Depends(get_db)):
    return get_all_testimonials(db)


@testimonialsRouter.get("/{testimonial_id}", response_model=TestimonialResponse)
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db)
):
    testimonial = get_testimonial_by_id(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial