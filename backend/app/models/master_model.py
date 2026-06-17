from pydantic import BaseModel, Field
from typing import List, Dict

class MasterData(BaseModel):
    kategoriData: Dict[str, List[str]]
    satuan: List[str]