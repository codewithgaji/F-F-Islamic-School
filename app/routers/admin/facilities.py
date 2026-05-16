from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import FacilityCreate, FacilityUpdate, FacilityResponse
from services.facilities_service import (
    get_all_facilities,
    get_facility_by_id,
    create_facility,
    update_facility,
    delete_facility
)
from core.security.dependencies import get_current_admin

adminFacilitiesRouter = APIRouter()


@adminFacilitiesRouter.get("/", response_model=list[FacilityResponse])
def get_facilities(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_facilities(db)


@adminFacilitiesRouter.get("/{facility_id}", response_model=FacilityResponse)
def get_facility(
    facility_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    facility = get_facility_by_id(db, facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility


@adminFacilitiesRouter.post("/", response_model=FacilityResponse, status_code=201)
def add_facility(
    data: FacilityCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return create_facility(db, data)


@adminFacilitiesRouter.put("/{facility_id}", response_model=FacilityResponse)
def edit_facility(
    facility_id: int,
    data: FacilityUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    facility = update_facility(db, facility_id, data)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility


@adminFacilitiesRouter.delete("/{facility_id}", status_code=204)
def remove_facility(
    facility_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    facility = delete_facility(db, facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")