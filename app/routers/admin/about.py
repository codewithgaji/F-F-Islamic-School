from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import AboutCreate, AboutUpdate, AboutResponse
from services.about_service import get_about, create_about, update_about
from core.security.dependencies import get_current_admin

adminAboutRouter = APIRouter()


@adminAboutRouter.get("/", response_model=AboutResponse)
def get_about_content(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    about = get_about(db)
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    return about


@adminAboutRouter.post("/", response_model=AboutResponse, status_code=201)
def create_about_content(
    data: AboutCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_about(db)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="About content already exists, use PUT to update"
        )
    return create_about(db, data)


@adminAboutRouter.put("/", response_model=AboutResponse)
def update_about_content(
    data: AboutUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    about = update_about(db, data)
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    return about