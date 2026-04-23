from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime


class SiteSettingsModel(Base):
    __tablename__ = "site_settings"
    id = Column(Integer, primary_key=True, index=True)
    school = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    opening_hours = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    facebook = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)

    