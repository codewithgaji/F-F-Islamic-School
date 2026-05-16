from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import FacilityResponse
from services.facilities_service import get_all_facilities, get_facility_by_id

facilitiesRouter = APIRouter()


@facilitiesRouter.get("/", response_model=list[FacilityResponse])
def get_facilities(db: Session = Depends(get_db)):
    return get_all_facilities(db)


@facilitiesRouter.get("/{facility_id}", response_model=FacilityResponse)
def get_facility(
    facility_id: int,
    db: Session = Depends(get_db)
):
    facility = get_facility_by_id(db, facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility