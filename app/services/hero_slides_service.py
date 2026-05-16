from sqlalchemy.orm import Session
from db.models.contentmodels import HeroSlidesModel
from schemas.content_schemas import HeroSlideCreate, HeroSlideUpdate



def get_all_slides(db: Session, active_only: bool = False):
    query = db.query(HeroSlidesModel).order_by(HeroSlidesModel.order)
    if active_only:
        query = query.filter(HeroSlidesModel.is_active == True)
    return query.all()


def get_slide_by_id(db: Session, slide_id: int):
    return db.query(HeroSlidesModel).filter(HeroSlidesModel.id == slide_id).first()


def create_slide(db: Session, data: HeroSlideCreate):
    slide = HeroSlidesModel(
        image_url=data.image_url,
        caption=data.caption,
        subtitle=data.subtitle,
        order=data.order,
        is_active=data.is_active
    )
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


def update_slide(db: Session, slide_id: int, data: HeroSlideUpdate):
    slide = get_slide_by_id(db, slide_id)
    if not slide:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(slide, key, value)
    db.commit()
    db.refresh(slide)
    return slide


def delete_slide(db: Session, slide_id: int):
    slide = get_slide_by_id(db, slide_id)
    if not slide:
        return None
    db.delete(slide)
    db.commit()
    return slide


def reorder_slides(db: Session, ordered_ids: list[int]):
    for index, slide_id in enumerate(ordered_ids):
        slide = get_slide_by_id(db, slide_id)
        if slide:
            slide.order = index + 1
    db.commit()
    return get_all_slides(db)