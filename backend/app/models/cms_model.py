from pydantic import BaseModel
from typing import List

class MainCMSModel(BaseModel):
    running_text: str
    hero_title: str

class AboutCMSModel(BaseModel):
    hero_title: str
    philosophy: str
    missions: List[str]

class ContactCMSModel(BaseModel):
    hero_title: str
    brand_message: str
    shopee_url: str
    tiktok_url: str