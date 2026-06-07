import os
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, Security
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
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Dependency untuk mendapatkan user saat ini dari token"""
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        username: str = payload.get("sub")
        role: str = payload.get("role")
        token_type: str = payload.get("type")

        if username is None:
            raise HTTPException(status_code=401, detail="Token tidak valid")

        # Optional: cek apakah token tipe access
        if token_type != "access":
            raise HTTPException(status_code=401, detail="Token refresh tidak boleh digunakan untuk akses")

        return {"username": username, "role": role}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesi telah berakhir, silakan login kembali")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid atau telah rusak")