from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.core.config import SECRET_KEY
from app.database.collections import user_collection

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/admin/login"
)

async def get_current_admin(
    token: str = Depends(oauth2_scheme)
):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        username = payload.get("sub")

        user = await user_collection.find_one({
            "username": username
        })

        if not user:
            raise HTTPException(
                status_code=401,
                detail="user tidak ditemukan"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="token invalid"
        )