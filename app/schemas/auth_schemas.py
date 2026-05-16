from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class AdminUserBase(BaseModel):
  username: str
  email: EmailStr




class AdminUserCreate(AdminUserBase):
  password: str

class AdminUserUpdate(BaseModel):
  username: Optional[str] = None
  email: Optional[str] = None



class AdminUserResponse(BaseModel):
  id: int
  is_active: bool
  is_superuser: bool
  created_at: datetime
  model_config = ConfigDict(
    from_attributes=True
  )





class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None