from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class SiteSettingsBase(BaseModel):
    school_name: str
    tagline: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    opening_hours: Optional[str] = None
    logo_url: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    whatsapp: Optional[str] = None


class SiteSettingsUpdate(BaseModel):
    school_name: Optional[str] = None
    tagline: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    opening_hours: Optional[str] = None
    logo_url: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    whatsapp: Optional[str] = None


class SiteSettingsResponse(SiteSettingsBase):
    id: int

    model_config = ConfigDict(from_attributes=True)