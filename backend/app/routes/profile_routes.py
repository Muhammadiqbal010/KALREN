import cloudinary.uploader
from datetime import datetime
from typing import Optional
from bson import ObjectId
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status
)
from pydantic import BaseModel

from app.core.security import (
    get_current_user,
    verify_password,
    get_password_hash
)
from app.database.collections import user_collection
from app.services.upload_service import upload_image_to_cloudinary
# 🎯 IMPORT CENTRAL CLOUDINARY WIPEOUT HELPER LU BAL!
from app.utils.cloudinary_helper import delete_cloudinary_asset

router = APIRouter(
    prefix="/api/user",
    tags=["User Profile Management"]
)


# =========================================================
# SCHEMA
# =========================================================

class UpdatePasswordRequest(BaseModel):
    old_password: str
    new_password: str


# =========================================================
# GET PROFILE
# =========================================================

@router.get("/profile")
async def get_current_profile(
    current_user: dict = Depends(get_current_user)
):
    user_data = await user_collection.find_one(
        {"username": current_user.get("username")}
    )

    if not user_data:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    user_data["_id"] = str(user_data["_id"])
    user_data.pop("password", None)

    return user_data


# =========================================================
# UPDATE PROFILE (NAMA + USERNAME + AVATAR)
# =========================================================

@router.put("/profile")
async def update_profile(
    name: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    user_db = await user_collection.find_one(
        {"_id": ObjectId(current_user.get("id"))}
    )

    if not user_db:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    update_data = {}

    if name and name.strip():
        update_data["name"] = name.strip()

    if username and username.strip():
        # Pastikan username baru tidak bentrok dengan user lain Bal
        if username.strip() != user_db["username"]:
            existing = await user_collection.find_one({"username": username.strip()})
            if existing:
                raise HTTPException(status_code=409, detail="Username sudah digunakan oleh admin/staff lain!")
            update_data["username"] = username.strip()

    # =====================================================
    # UPLOAD AVATAR BARU KE CLOUDINARY + AUTO-CLEAN LAMA
    # =====================================================

    if avatar:
        try:
            file_bytes = await avatar.read()

            upload_result = await upload_image_to_cloudinary(file_bytes)

            avatar_url = (
                upload_result.get("secure_url")
                if isinstance(upload_result, dict)
                else upload_result
            )

            if not avatar_url:
                raise HTTPException(
                    status_code=500,
                    detail="Cloudinary tidak mengembalikan URL"
                )

            # 🚀 AMBIL AVATAR LAMA DAN BANTAI PAKAI CENTRAL HELPER BARU LU BAL!
            old_url = user_db.get("avatar") or user_db.get("profile_image_url")
            if old_url:
                delete_cloudinary_asset(old_url)

            update_data["avatar"] = avatar_url
            update_data["profile_image_url"] = avatar_url

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Gagal upload avatar ke Cloudinary Bal: {str(e)}"
            )

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="Tidak ada data identitas yang diubah"
        )

    update_data["updated_at"] = datetime.utcnow()

    await user_collection.update_one(
        {"username": current_user.get("username")},
        {"$set": update_data}
    )

    # Ambil ulang data fresh setelah update berhasil Bal
    target_username = update_data.get("username", current_user.get("username"))
    updated_user = await user_collection.find_one({"username": target_username})

    updated_user["_id"] = str(updated_user["_id"])
    updated_user.pop("password", None)

    return {
        "success": True,
        "message": "Profil berhasil disinkronkan ke database KALREN",
        "user": updated_user
    }


# =========================================================
# UPDATE PASSWORD (MASTER SYSTEM REDIRECTION)
# =========================================================

@router.put("/password")
async def update_password(
    payload: UpdatePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    user = await user_collection.find_one(
        {"username": current_user.get("username")}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    # Validasi password lama murni enkripsi bcrypt
    if not verify_password(
        payload.old_password,
        user["password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password lama kontrol utama salah, Bal!"
        )

    await user_collection.update_one(
        {"username": current_user.get("username")},
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
        "message": "Enkripsi password master berhasil diubah di database Atlas!"
    }