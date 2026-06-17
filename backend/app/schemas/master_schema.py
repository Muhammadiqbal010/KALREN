# app/schemas/master.py
from pydantic import BaseModel
from typing import List, Dict

class MasterDataSchema(BaseModel):
    kategoriData: Dict[str, List[str]]
    satuan: List[str]