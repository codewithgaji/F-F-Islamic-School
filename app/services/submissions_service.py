from sqlalchemy.orm import Session
from db.models.submissionModels import ContactMessageModel, BookingModel, NewsletterSubscriberModel
from schemas.submission_schemas import ContactMessageCreate, BookingCreate, NewsletterCreate


# --- CONTACT MESSAGE SERVICES ---

def get_all_messages(db: Session):
    return db.query(ContactMessageModel).order_by(ContactMessageModel.created_at.desc()).all()


def get_message_by_id(db: Session, message_id: int):
    return db.query(ContactMessageModel).filter(ContactMessageModel.id == message_id).first()


def create_message(db: Session, data: ContactMessageCreate):
    message = ContactMessageModel(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def mark_message_as_read(db: Session, message_id: int):
    message = get_message_by_id(db, message_id)
    if not message:
        return None
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message


def delete_message(db: Session, message_id: int):
    message = get_message_by_id(db, message_id)
    if not message:
        return None
    db.delete(message)
    db.commit()
    return message


# --- BOOKING SERVICES ---

def get_all_bookings(db: Session):
    return db.query(BookingModel).order_by(BookingModel.created_at.desc()).all()


def get_booking_by_id(db: Session, booking_id: int):
    return db.query(BookingModel).filter(BookingModel.id == booking_id).first()


def create_booking(db: Session, data: BookingCreate):
    booking = BookingModel(
        name=data.name,
        email=data.email,
        phone=data.phone,
        class_id=data.class_id,
        status="pending"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def update_booking_status(db: Session, booking_id: int, status: str):
    booking = get_booking_by_id(db, booking_id)
    if not booking:
        return None
    allowed_statuses = ["pending", "confirmed", "cancelled"]
    if status not in allowed_statuses:
        return None
    booking.status = status
    db.commit()
    db.refresh(booking)
    return booking


def delete_booking(db: Session, booking_id: int):
    booking = get_booking_by_id(db, booking_id)
    if not booking:
        return None
    db.delete(booking)
    db.commit()
    return booking


# --- NEWSLETTER SERVICES ---

def get_all_subscribers(db: Session):
    return db.query(NewsletterSubscriberModel).order_by(
        NewsletterSubscriberModel.subscribed_at.desc()
    ).all()


def get_subscriber_by_email(db: Session, email: str):
    return db.query(NewsletterSubscriberModel).filter(
        NewsletterSubscriberModel.email == email
    ).first()


def create_subscriber(db: Session, data: NewsletterCreate):
    existing = get_subscriber_by_email(db, data.email)
    if existing:
        return None
    subscriber = NewsletterSubscriberModel(
        name=data.name,
        email=data.email
    )
    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return subscriber


def delete_subscriber(db: Session, subscriber_id: int):
    subscriber = db.query(NewsletterSubscriberModel).filter(
        NewsletterSubscriberModel.id == subscriber_id
    ).first()
    if not subscriber:
        return None
    db.delete(subscriber)
    db.commit()
    return subscriber