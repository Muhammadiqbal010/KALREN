from pydantic import BaseModel
from typing import Optional

class UserModel(BaseModel):
    username: str
    password: str
    role: str = "admin"
    avatar: Optional[str] = None