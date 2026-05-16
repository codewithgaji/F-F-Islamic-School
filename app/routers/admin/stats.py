from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db.models.contentmodels import TeacherModel, ClassModel
from db.models.submissionModels import BookingModel, ContactMessageModel
from core.security.dependencies import get_current_admin

adminStatsRouter = APIRouter()


@adminStatsRouter.get("/students")
def get_student_count(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    count = db.query(BookingModel).filter(BookingModel.status == "confirmed").count()
    return {"count": count}


@adminStatsRouter.get("/teachers")
def get_teacher_count(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    count = db.query(TeacherModel).count()
    return {"count": count}


@adminStatsRouter.get("/classes")
def get_class_count(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    count = db.query(ClassModel).count()
    return {"count": count}


@adminStatsRouter.get("/messages")
def get_message_count(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    count = db.query(ContactMessageModel).filter(ContactMessageModel.is_read == False).count()
    return {"count": count}