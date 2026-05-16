from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from decouple import config
from core.security.AuthHandler import AuthHandler
from core.security.hashHelper import HashHelper

authRouter = APIRouter()

class LoginDetails(BaseModel):
    email: str
    password: str

@authRouter.post("/login")
def login(details: LoginDetails):
    
    # Check email against .env
    if details.email != config("ADMIN_EMAIL"):
        raise HTTPException(
            status_code=403,
            detail="Invalid credentials"
        )
    
    # Check password against hashed password in .env
    if not HashHelper.verify_password(details.password, config("ADMIN_PASSWORD")):
        raise HTTPException(
            status_code=403,
            detail="Invalid credentials"
        )
    
    # Generate and return token
    token = AuthHandler.sign_jwt(user_id=1)
    return {
        "token": token,
        "message": "Login successful"
    }