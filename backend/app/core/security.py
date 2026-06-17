import os
from datetime import datetime, timedelta
from typing import Optional, List

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Request, HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# ========================= CONFIG =========================
SECRET_KEY = os.getenv("SECRET_KEY", "KLRN_SUPER_SECURE_KEY_2026_CHANGE_IN_PRODUCTION")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security Scheme
security = HTTPBearer()


# ========================= PASSWORD =========================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# ========================= TOKEN =========================
def create_tokens_bundle(username: str, role: str = "user") -> dict:
    """Membuat access token + refresh token"""
    
    # Access Token
    access_expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_payload = {
        "sub": username,
        "role": role,
        "exp": access_expire,
        "type": "access"
    }
    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)

    # Refresh Token
    refresh_expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_payload = {
        "sub": username,
        "role": role,
        "exp": refresh_expire,
        "type": "refresh"
    }
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


def decode_token(token: str) -> Optional[dict]:
    """Decode token tanpa raise exception (untuk internal use)"""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


# ========================= CURRENT USER =========================
async def get_current_user(request: Request) -> dict:
    # Coba cookie dulu
    token = request.cookies.get("kalren_token")
    
    # Fallback ke Authorization header
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(status_code=401, detail="Token tidak ditemukan")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
        token_type = payload.get("type")

        if not username:
            raise HTTPException(status_code=401, detail="Token tidak valid")
        if token_type != "access":
            raise HTTPException(status_code=401, detail="Token tidak valid untuk akses")

        return {"username": username, "role": role}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesi telah berakhir, silakan login kembali")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid atau telah rusak")


# =========================================
# ROLE-BASED ACCESS CONTROL (RBAC) DEPENDENCY
# =========================================
class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: dict = Depends(get_current_user)):
        # Mengambil field 'role' dari current_user
        user_role = current_user.get("role", "user") # default ke user jika role tidak ada
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="OTORITAS DITOLAK: AKUN ANDA TIDAK MEMILIKI AKSES KE MODUL INI."
            )
        return current_user

# Gatekeeper yang siap lu pasang di router manapun
allow_admin_and_owner = RoleChecker(["admin", "owner"])
allow_only_owner = RoleChecker(["owner"])