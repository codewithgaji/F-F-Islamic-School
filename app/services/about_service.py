from sqlalchemy.orm import Session
from db.models.contentmodels import AboutModel
from schemas.content_schemas import AboutCreate, AboutUpdate


def get_about(db: Session):
    return db.query(AboutModel).filter(AboutModel.id == 1).first()


def create_about(db: Session, data: AboutCreate):
    about = AboutModel(
        title=data.title,
        description=data.description,
        main_image_url=data.main_image_url,
        secondary_image_url=data.secondary_image_url,
        bullet_points=data.bullet_points
    )
    db.add(about)
    db.commit()
    db.refresh(about)
    return about


def update_about(db: Session, data: AboutUpdate):
    about = get_about(db)
    if not about:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(about, key, value)
    db.commit()
    db.refresh(about)
    return about