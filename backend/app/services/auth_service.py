from app.schemas.auth_schema import LoginRequest
from app.database.collections import user_collection
from app.core.security import (
    verify_password,
    create_tokens_bundle,
    decode_token
)

# =========================================================
# LOGIN SERVICE
# =========================================================
async def login_service(data: LoginRequest):
    # Mencari user berdasarkan email ATAU username di MongoDB Atlas
    user = await user_collection.find_one({
        "$or": [
            {"email": data.email},
            {"username": data.email}
        ]
    })

    if not user:
        return None

    if not verify_password(data.password, user["password"]):
        return None

    tokens = create_tokens_bundle(
        username=user["username"],
        role=user.get("role", "owner")
    )

    return {
        "success": True,
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user.get("email"),
            "role": user.get("role", "owner"),
            "name": user.get("name", "Muhammad Iqbal"),
        }
    }


# =========================================================
# REFRESH TOKEN SERVICE
# =========================================================
async def refresh_token_service(data):
    payload = decode_token(data.refresh_token)

    if not payload or payload.get("type") != "refresh":
        return None

    new_tokens = create_tokens_bundle(
        username=payload["sub"],
        role=payload.get("role", "owner")
    )

    return {
        "success": True,
        "access_token": new_tokens["access_token"],
        "refresh_token": new_tokens["refresh_token"],
        "token_type": "bearer"
    }


# =========================================================
# GET CURRENT USER SERVICE (UPDATED & SECURED)
# =========================================================
async def get_current_user_service(username: str):
    # ✅ FIX: Dibikin fleksibel mencari berdasarkan 'username' ATAU 'email'
    # Langkah ini untuk mencegah token drop/None saat reload halaman di React Frontend
    user = await user_collection.find_one({
        "$or": [
            {"username": username},
            {"email": username}
        ]
    })

    if not user:
        return None

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user.get("email"),
        "role": user.get("role", "owner"),
        "name": user.get("name"),
        "avatar": user.get("avatar")
    }