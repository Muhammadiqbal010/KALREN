from pydantic import BaseModel
from typing import Optional

class LookbookResponse(BaseModel):
    id: str
    title: str
    image_url: str
    sort_order: Optional[int] = 0

    class Config:
        from_attributes = True