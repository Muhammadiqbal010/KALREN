from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# =========================================================
# REQUEST MODELS
# =========================================================
class LoginRequest(BaseModel):
    """Model untuk request login (bisa pakai email atau username)"""
    email: str
    password: str


class RefreshRequest(BaseModel):
    """Model untuk refresh token"""
    refresh_token: str


# =========================================================
# RESPONSE MODELS
# =========================================================
class UserDetailResponse(BaseModel):
    """Data user yang dikembalikan ke frontend"""
    id: str
    username: str
    email: EmailStr
    role: str
    name: Optional[str] = None
    avatar: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Untuk kompatibilitas dengan MongoDB (ORM mode)


class LoginResponse(BaseModel):
    """Response utama setelah login berhasil"""
    success: bool = True
    message: str = "Login berhasil"
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserDetailResponse


class RefreshResponse(BaseModel):
    """Response untuk refresh token"""
    success: bool = True
    access_token: str
    token_type: str = "bearer"


class ErrorResponse(BaseModel):
    """Response untuk error"""
    success: bool = False
    message: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    username: str
    password: str
    role: str = "admin"
    master_key: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str
    master_key: str