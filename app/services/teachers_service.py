from sqlalchemy.orm import Session
from db.models.contentmodels import TeacherModel
from schemas.content_schemas import TeacherCreate, TeacherUpdate


def get_all_teachers(db: Session, limit: int = None):
    query = db.query(TeacherModel)
    if limit:
        query = query.limit(limit)
    return query.all()


def get_teacher_by_id(db: Session, teacher_id: int):
    return db.query(TeacherModel).filter(TeacherModel.id == teacher_id).first()


def create_teacher(db: Session, data: TeacherCreate):
    teacher = TeacherModel(
        name=data.name,
        role=data.role,
        bio=data.bio,
        image_url=data.image_url,
        twitter=data.twitter,
        facebook=data.facebook,
        linkedin=data.linkedin
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


def update_teacher(db: Session, teacher_id: int, data: TeacherUpdate):
    teacher = get_teacher_by_id(db, teacher_id)
    if not teacher:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(teacher, key, value)
    db.commit()
    db.refresh(teacher)
    return teacher


def delete_teacher(db: Session, teacher_id: int):
    teacher = get_teacher_by_id(db, teacher_id)
    if not teacher:
        return None
    db.delete(teacher)
    db.commit()
    return teacher