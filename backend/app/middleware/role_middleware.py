from fastapi import HTTPException

def require_role(roles):

    async def checker(current_user):

        if current_user.get("role") not in roles:
            raise HTTPException(
                status_code=403,
                detail="akses ditolak"
            )

        return current_user

    return checker