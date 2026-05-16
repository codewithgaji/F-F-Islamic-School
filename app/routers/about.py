from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import AboutResponse
from services.about_service import get_about

AboutRouter = APIRouter()


@AboutRouter.get("/", response_model=AboutResponse)
def get_about_content(db: Session = Depends(get_db)):
    about = get_about(db)
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    return about