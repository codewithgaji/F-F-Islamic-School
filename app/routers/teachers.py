from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.content_schemas import TeacherResponse
from services.teachers_service import get_all_teachers, get_teacher_by_id

teachersRouter = APIRouter()


@teachersRouter.get("", response_model=list[TeacherResponse])
def get_teachers(
    limit: int = None,
    db: Session = Depends(get_db)
):
    return get_all_teachers(db, limit=limit)


@teachersRouter.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    teacher = get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher