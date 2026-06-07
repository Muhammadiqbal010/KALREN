# ANALYTICS_SCHEMA
from pydantic import BaseModel

class AnalyticsResponse(BaseModel):
    product_id: str
    clicks: dict