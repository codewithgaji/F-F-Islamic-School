from sqlalchemy.orm import Session
from db.models.contentmodels import FacilityModel
from schemas.content_schemas import FacilityCreate, FacilityUpdate


def get_all_facilities(db: Session):
    return db.query(FacilityModel).all()


def get_facility_by_id(db: Session, facility_id: int):
    return db.query(FacilityModel).filter(FacilityModel.id == facility_id).first()


def create_facility(db: Session, data: FacilityCreate):
    facility = FacilityModel(
        icon_name=data.icon_name,
        title=data.title,
        description=data.description
    )
    db.add(facility)
    db.commit()
    db.refresh(facility)
    return facility


def update_facility(db: Session, facility_id: int, data: FacilityUpdate):
    facility = get_facility_by_id(db, facility_id)
    if not facility:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(facility, key, value)
    db.commit()
    db.refresh(facility)
    return facility


def delete_facility(db: Session, facility_id: int):
    facility = get_facility_by_id(db, facility_id)
    if not facility:
        return None
    db.delete(facility)
    db.commit()
    return facility