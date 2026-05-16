from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from db.database import Base

class AdminUserModel(Base):
  __tablename__="admin_user"
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, unique=True, nullable=False)
  email = Column(String, unique=True, nullable=False)
  hashed_password = Column(String, nullable=False)
  is_active = Column(Boolean, default=True)
  is_superuser = Column(Boolean, default=False)
  created_at = Column(DateTime, default=datetime.utcnow, nullable=False)