from fastapi import Depends, HTTPException, Header
from core.security.AuthHandler import AuthHandler

def get_current_admin(authorization: str = Header(...)):
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid auth header")
    
    decoded = AuthHandler.decode_jwt(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return decoded