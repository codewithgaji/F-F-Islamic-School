from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.settings_schemas import SiteSettingsResponse
from services.settings_service import get_settings

settingsRouter = APIRouter()


@settingsRouter.get("/", response_model=SiteSettingsResponse)
def get_site_settings(db: Session = Depends(get_db)):
    settings = get_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="Site settings not found")
    return settings