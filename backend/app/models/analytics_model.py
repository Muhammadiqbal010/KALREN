from pydantic import BaseModel
from typing import Dict

class AnalyticsModel(BaseModel):
    product_id: str
    clicks: Dict[str, int]