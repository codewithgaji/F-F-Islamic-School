from sqlalchemy.orm import Session
from db.models.contentmodels import ClassModel
from schemas.content_schemas import ClassCreate, ClassUpdate


def get_all_classes(db: Session, featured_only: bool = False, limit: int = None):
    query = db.query(ClassModel)
    if featured_only:
        query = query.filter(ClassModel.is_featured == True)
    if limit:
        query = query.limit(limit)
    return query.all()



def get_class_by_id(db: Session, class_id: int):
    return db.query(ClassModel).filter(ClassModel.id == class_id).first()


def create_class(db: Session, data: ClassCreate):
    new_class = ClassModel(
        title=data.title,
        description=data.description,
        image_url=data.image_url,
        age_range=data.age_range,
        total_seats=data.total_seats,
        class_time=data.class_time,
        monthly_fee=data.monthly_fee,
        is_featured=data.is_featured
    )
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class


def update_class(db: Session, class_id: int, data: ClassUpdate):
    existing_class = get_class_by_id(db, class_id)
    if not existing_class:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing_class, key, value)
    db.commit()
    db.refresh(existing_class)
    return existing_class


def delete_class(db: Session, class_id: int):
    existing_class = get_class_by_id(db, class_id)
    if not existing_class:
        return None
    db.delete(existing_class)
    db.commit()
    return existing_class