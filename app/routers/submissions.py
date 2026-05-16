from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.submission_schemas import (
    ContactMessageCreate,
    ContactMessageResponse,
    BookingCreate,
    BookingResponse,
    NewsletterCreate,
    NewsletterResponse
)
from services.submissions_service import (
    create_message,
    create_booking,
    create_subscriber
)

submissionsRouter = APIRouter()


# --- CONTACT MESSAGE ROUTES ---

@submissionsRouter.post("/contact", response_model=ContactMessageResponse, status_code=201)
def send_message(
    data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    return create_message(db, data)


# --- BOOKING ROUTES ---

@submissionsRouter.post("/bookings", response_model=BookingResponse, status_code=201)
def book_seat(
    data: BookingCreate,
    db: Session = Depends(get_db)
):
    return create_booking(db, data)


# --- NEWSLETTER ROUTES ---

@submissionsRouter.post("/newsletter/subscribe", response_model=NewsletterResponse, status_code=201)
def subscribe(
    data: NewsletterCreate,
    db: Session = Depends(get_db)
):
    subscriber = create_subscriber(db, data)
    if not subscriber:
        raise HTTPException(
            status_code=400,
            detail="This email is already subscribed"
        )
    return subscriber