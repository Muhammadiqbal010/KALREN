import os
import cloudinary.uploader

from datetime import datetime
from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Depends,
    UploadFile,
    File,
    Form
)
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from app.database.collections import user_collection

from app.schemas.auth_schema import (
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest
)

from app.services.auth_service import (
    login_service,
    refresh_token_service,
    get_current_user_service
)

from app.core.security import (
    decode_token,
    get_password_hash,
    create_tokens_bundle
)

# KUNCI UTAMA: Ubah prefix jadi /api/auth agar sirkuit routing KALREN terpisah bersih Bal!
router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

security = HTTPBearer()

import os

MASTER_KEY = os.getenv(
    "MASTER_KEY",
    "ci i o kita keren"
)

# =========================================================
# LOGIN
# =========================================================
@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    """Login user / admin"""
    result = await login_service(payload)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah!"
        )

    return result

@router.post("/register")
async def register(payload: RegisterRequest):

    if payload.master_key != MASTER_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kode Sakral salah."
        )

    existing = await user_collection.find_one({
        "$or": [
            {"email": payload.email},
            {"username": payload.username}
        ]
    })

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email atau username sudah terdaftar."
        )

    new_user = {
        "name": payload.name,
        "email": payload.email,
        "username": payload.username,
        "password": get_password_hash(payload.password),
        "role": payload.role,
        "avatar": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    await user_collection.insert_one(new_user)

    return {
        "success": True,
        "message": f"Akun '{payload.username}' berhasil dibuat."
    }

# =========================================================
# REFRESH TOKEN
# =========================================================
@router.post("/refresh", response_model=dict)
async def refresh_token(payload: RefreshRequest):
    """Memperbarui access token menggunakan refresh token"""
    result = await refresh_token_service(payload)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired atau tidak valid."
        )

    return result

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):

    if payload.master_key != MASTER_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kode Sakral salah."
        )

    user = await user_collection.find_one({
        "email": payload.email
    })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email tidak ditemukan."
        )

    await user_collection.update_one(
        {"email": payload.email},
        {
            "$set": {
                "password": get_password_hash(
                    payload.new_password
                ),
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "success": True,
        "message": "Password berhasil diperbarui."
    }

# =========================================================
# GET CURRENT USER
# =========================================================
@router.get("/me")
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Mengambil data user berdasarkan token yang sedang aktif"""
    token = credentials.credentials

    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau telah expired"
        )

    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid"
        )

    user = await get_current_user_service(username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan"
        )

    return user

@router.put("/me")
async def update_profile(
    name: str = Form(None),         # 🚀 SEKARANG KITA TANGKAP FIELD NAME KENDALI UTAMA!
    username: str = Form(None),
    password: str = Form(None),
    avatar: UploadFile = File(None),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token tidak valid")

    current_username = payload.get("sub")

    user = await user_collection.find_one({
        "$or": [
            {"username": current_username},
            {"email": current_username}
        ]
    })

    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    # Inisialisasi data yang wajib ikut berubah
    update_data = {
        "updated_at": datetime.utcnow()
    }

    # ==================================================
    # ✅ FIX 1: UPDATE FIELD NAME (Biar kesimpan ke MongoDB)
    # ==================================================
    if name and name.strip():
        update_data["name"] = name.strip()

    # ==================================================
    # UPDATE USERNAME
    # ==================================================
    if username and username.strip():
        username = username.strip()
        if username != user["username"]:
            existing_user = await user_collection.find_one({"username": username})
            if existing_user:
                raise HTTPException(status_code=409, detail="Username sudah digunakan")
            update_data["username"] = username

    # ==================================================
    # UPDATE PASSWORD (Menampung ganti password sekaligus)
    # ==================================================
    if password and password.strip():
        update_data["password"] = get_password_hash(password.strip())

    # ==================================================
    # UPDATE AVATAR CLOUDINARY
    # ==================================================
    if avatar:
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if avatar.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Format gambar harus JPG, PNG atau WEBP")

        old_public_id = user.get("avatar_public_id")
        if old_public_id:
            try:
                cloudinary.uploader.destroy(old_public_id)
            except Exception as e:
                print(f"Gagal hapus avatar lama: {e}")

        upload_result = cloudinary.uploader.upload(avatar.file, folder="kalren/avatar")
        update_data["avatar"] = upload_result["secure_url"]
        update_data["avatar_public_id"] = upload_result["public_id"]

    # ==================================================
    # SAVE PERUBAHAN KE DATABASE ATLAS
    # ==================================================
    await user_collection.update_one(
        {"_id": user["_id"]},
        {"$set": update_data}
    )

    updated_user = await user_collection.find_one({"_id": user["_id"]})

    # Generate token bundle baru biar session sinkron tanpa relogin
    tokens = create_tokens_bundle(
        username=updated_user["username"],
        role=updated_user.get("role", "owner")
    )

    return {
        "success": True,
        "message": "Profil berhasil diperbarui di MongoDB Atlas",
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "token_type": "bearer",
        "user": {
            "id": str(updated_user["_id"]),
            "name": updated_user.get("name"),
            "username": updated_user.get("username"),
            "email": updated_user.get("email"),
            "role": updated_user.get("role"),
            "avatar": updated_user.get("avatar")
        }
    }