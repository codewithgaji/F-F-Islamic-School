from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


# CONTACT SCHEMA
class ContactMessageBase(BaseModel):
  name: str
  email: EmailStr
  subject: str
  message: str


class ContactMessageCreate(ContactMessageBase):
  pass


class ContactMessageUpdate(ContactMessageBase):
  name: Optional[str] = None
  email: Optional[str] = None
  subject: Optional[str] = None
  message: Optional[str] = None


class ContactMessageResponse(ContactMessageBase):
  id: int
  
  model_config = ConfigDict(
    from_attributes=True
  )






# BOOKING BASE
class BookingBase(BaseModel):
  name: str
  email: EmailStr
  phone: str
  status: str



class BookingCreate(BookingBase):
  class_id: Optional[int] = None
  pass


class BookingResponse(BookingBase):
  id: int
  class_id: Optional[int] = None
  created_at: datetime

  model_config = ConfigDict(
    from_attributes=True
  )

class BookingUpdate(BaseModel):
  name: Optional[str] = None
  email: Optional[str] = None
  phone: Optional[str] = None
  status: Optional[str] = None





# NEWS LETTER SCHEMA
class NewsletterBase(BaseModel):
  name: str
  email: EmailStr


class NewsletterCreate(NewsletterBase):
  pass


class NewsletterUpdate(BaseModel):
  name: Optional[str] = None
  email: Optional[str] = None


class NewsletterResponse(BaseModel):
  id: int
  subscribed_at: datetime
  model_config = ConfigDict(
    from_attributes=True
  )




