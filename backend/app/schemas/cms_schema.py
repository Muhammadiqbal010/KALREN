# app/schemas/cms_schema.py
from pydantic import BaseModel
from typing import List, Optional

class CMSUpdateSchema(BaseModel):
    hero_title: Optional[str] = ""
    hero_title_gradient: Optional[str] = ""
    hero_subtitle: Optional[str] = ""
    hero_cta_text: Optional[str] = ""
    running_text: Optional[str] = ""
    manifesto_title: Optional[str] = ""
    manifesto_title_italic: Optional[str] = ""
    manifesto_description: Optional[str] = ""
    missions: List[str] = []
    cta_title: Optional[str] = ""
    cta_title_gradient: Optional[str] = ""
    cta_button_text: Optional[str] = ""
    shopee_url: Optional[str] = ""
    tiktok_url: Optional[str] = ""