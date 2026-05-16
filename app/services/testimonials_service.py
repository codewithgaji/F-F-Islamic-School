from sqlalchemy.orm import Session
from db.models.contentmodels import TestimonialModel
from schemas.content_schemas import TestimonialCreate, TestimonialUpdate


def get_all_testimonials(db: Session):
    return db.query(TestimonialModel).all()


def get_testimonial_by_id(db: Session, testimonial_id: int):
    return db.query(TestimonialModel).filter(TestimonialModel.id == testimonial_id).first()


def create_testimonial(db: Session, data: TestimonialCreate):
    testimonial = TestimonialModel(
        quote=data.quote,
        parent_name=data.parent_name,
        profession=data.profession,
        image_url=data.image_url
    )
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


def update_testimonial(db: Session, testimonial_id: int, data: TestimonialUpdate):
    testimonial = get_testimonial_by_id(db, testimonial_id)
    if not testimonial:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(testimonial, key, value)
    db.commit()
    db.refresh(testimonial)
    return testimonial


def delete_testimonial(db: Session, testimonial_id: int):
    testimonial = get_testimonial_by_id(db, testimonial_id)
    if not testimonial:
        return None
    db.delete(testimonial)
    db.commit()
    return testimonial