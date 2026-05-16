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
    get_all_messages,
    get_message_by_id,
    create_message,
    mark_message_as_read,
    delete_message,
    get_all_bookings,
    get_booking_by_id,
    create_booking,
    update_booking_status,
    delete_booking,
    get_all_subscribers,
    create_subscriber,
    delete_subscriber
)
from core.security.dependencies import get_current_admin
from pydantic import BaseModel

adminSubmissionsRouter = APIRouter()


class BookingStatusUpdate(BaseModel):
    status: str


# --- CONTACT MESSAGE ROUTES ---

@adminSubmissionsRouter.get("/messages", response_model=list[ContactMessageResponse])
def get_messages(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_messages(db)


@adminSubmissionsRouter.get("/messages/{message_id}", response_model=ContactMessageResponse)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    message = get_message_by_id(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@adminSubmissionsRouter.patch("/messages/{message_id}/read", response_model=ContactMessageResponse)
def read_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    message = mark_message_as_read(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@adminSubmissionsRouter.delete("/messages/{message_id}", status_code=204)
def remove_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    message = delete_message(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")


# --- BOOKING ROUTES ---

@adminSubmissionsRouter.get("/bookings", response_model=list[BookingResponse])
def get_bookings(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_bookings(db)


@adminSubmissionsRouter.get("/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    booking = get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@adminSubmissionsRouter.patch("/bookings/{booking_id}/status", response_model=BookingResponse)
def change_booking_status(
    booking_id: int,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    booking = update_booking_status(db, booking_id, data.status)
    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found or invalid status. Allowed: pending, confirmed, cancelled"
        )
    return booking


@adminSubmissionsRouter.delete("/bookings/{booking_id}", status_code=204)
def remove_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    booking = delete_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")


# --- NEWSLETTER ROUTES ---

@adminSubmissionsRouter.get("/newsletter", response_model=list[NewsletterResponse])
def get_subscribers(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_subscribers(db)


@adminSubmissionsRouter.delete("/newsletter/{subscriber_id}", status_code=204)
def remove_subscriber(
    subscriber_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    subscriber = delete_subscriber(db, subscriber_id)
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")