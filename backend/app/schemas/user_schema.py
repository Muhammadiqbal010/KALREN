from pydantic import BaseModel

class UserResponse(BaseModel):
    username: str
    role: str
    avatar: str | None = None