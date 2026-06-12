import os
import cloudinary.uploader

from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database.collections import user_collection
from app.schemas.auth_schema import (
    LoginRequest, LoginResponse, RefreshRequest, RegisterRequest, ResetPasswordRequest
)
from app.services.auth_service import (
    login_service, refresh_token_service, get_current_user_service
)
from app.core.security import (
    decode_token, get_password_hash, create_tokens_bundle, get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

IS_PRODUCTION = os.getenv("ENV", "development") == "production"
MASTER_KEY = os.getenv("MASTER_KEY", "ci i o kita keren")


# =========================================================
# LOGIN
# =========================================================
@router.post("/login")
async def login(response: Response, payload: LoginRequest):
    result = await login_service(payload)
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email atau password salah!")

    response.set_cookie(key="kalren_token", value=result["access_token"],
                        httponly=True, secure=IS_PRODUCTION, samesite="lax", max_age=3600 * 24)
    response.set_cookie(key="kalren_refresh", value=result["refresh_token"],
                        httponly=True, secure=IS_PRODUCTION, samesite="lax", max_age=3600 * 24 * 7)

    return {
        "success": True,
        "message": "Login berhasil",
        "user": result["user"],
        "access_token": result["access_token"]
    }


# =========================================================
# LOGOUT
# =========================================================
@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("kalren_token")
    response.delete_cookie("kalren_refresh")
    return {"success": True, "message": "Logout berhasil"}


# =========================================================
# REGISTER
# =========================================================
@router.post("/register")
async def register(payload: RegisterRequest):
    if payload.master_key != MASTER_KEY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Kode Sakral salah.")

    existing = await user_collection.find_one({
        "$or": [{"email": payload.email}, {"username": payload.username}]
    })
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email atau username sudah terdaftar.")

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
    return {"success": True, "message": f"Akun '{payload.username}' berhasil dibuat."}


# =========================================================
# REFRESH TOKEN
# =========================================================
@router.post("/refresh")
async def refresh(request: Request, response: Response):
    refresh_token = request.cookies.get("kalren_refresh")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token tidak ditemukan")

    class TokenData:
        pass
    data = TokenData()
    data.refresh_token = refresh_token

    result = await refresh_token_service(data)
    if not result:
        raise HTTPException(status_code=401, detail="Refresh token tidak valid atau expired")

    response.set_cookie(key="kalren_token", value=result["access_token"],
                        httponly=True, secure=IS_PRODUCTION, samesite="lax", max_age=3600 * 24)
    response.set_cookie(key="kalren_refresh", value=result["refresh_token"],
                        httponly=True, secure=IS_PRODUCTION, samesite="lax", max_age=3600 * 24 * 7)
    return {"success": True, "message": "Token diperbarui"}


# =========================================================
# RESET PASSWORD
# =========================================================
@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    if payload.master_key != MASTER_KEY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Kode Sakral salah.")

    user = await user_collection.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Email tidak ditemukan.")

    new_hashed = get_password_hash(payload.new_password)

    result = await user_collection.update_one(
        {"_id": user["_id"]},  # pakai _id, bukan email — lebih aman & pasti
        {"$set": {
            "password": new_hashed,
            "updated_at": datetime.utcnow()
        }}
    )

    # Verifikasi update benar-benar tersimpan
    if result.modified_count == 0:
        raise HTTPException(
            status_code=500,
            detail="Gagal memperbarui password. Coba lagi."
        )

    print(f"[RESET PASSWORD] ✅ Password user '{user.get('email')}' berhasil diperbarui.")
    return {"success": True, "message": "Password berhasil diperbarui."}


# =========================================================
# GET CURRENT USER — baca cookie + fallback Bearer header
# =========================================================
@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await get_current_user_service(current_user["username"])
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return user


# =========================================================
# UPDATE PROFILE — baca cookie + fallback Bearer header
# =========================================================
@router.put("/me")
async def update_profile(
    name: str = Form(None),
    username: str = Form(None),
    password: str = Form(None),
    avatar: UploadFile = File(None),
    current_user: dict = Depends(get_current_user)
):
    current_username = current_user["username"]

    user = await user_collection.find_one({
        "$or": [{"username": current_username}, {"email": current_username}]
    })
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    update_data = {"updated_at": datetime.utcnow()}

    if name and name.strip():
        update_data["name"] = name.strip()

    if username and username.strip():
        username = username.strip()
        if username != user["username"]:
            existing_user = await user_collection.find_one({"username": username})
            if existing_user:
                raise HTTPException(status_code=409, detail="Username sudah digunakan")
            update_data["username"] = username

    if password and password.strip():
        update_data["password"] = get_password_hash(password.strip())
        print(f"[UPDATE PROFILE] 🔐 Password baru di-hash untuk user '{user.get('username')}'")

    if avatar and avatar.filename:
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

    # ✅ Satu kali update saja, langsung ambil dokumen terbaru
    updated_user = await user_collection.find_one_and_update(
        {"_id": user["_id"]},
        {"$set": update_data},
        return_document=True
    )

    if not updated_user:
        raise HTTPException(status_code=500, detail="Gagal memperbarui profil.")

    print(f"[UPDATE PROFILE] ✅ Profil '{updated_user.get('username')}' berhasil diperbarui.")

    tokens = create_tokens_bundle(
        username=updated_user["username"],
        role=updated_user.get("role", "owner")
    )

    return {
        "success": True,
        "message": "Profil berhasil diperbarui",
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