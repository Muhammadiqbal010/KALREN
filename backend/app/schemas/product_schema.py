from pydantic import BaseModel, Field
from typing import List, Optional

class ProductResponse(BaseModel):
    id: str = Field(..., alias="_id") # Mengonversi _id MongoDB ke string id frontend Bal
    name: str                        # ✅ SINKRON DB: Ganti dari 'title'
    slug: str
    description: Optional[str] = ""
    color: Optional[str] = "black"   # ✅ SINKRON DB: Tambah field color bawaan dokumen lo Bal
    price: float
    compare_price: Optional[float] = None
    is_discount: bool = False 
    
    # ✅ SINKRON DB: Ganti dari 'images' ke 'image_urls' (Array urutan foto)
    image_urls: List[str] = Field([], alias="image_urls") 
    
    series: str                      # ✅ SINKRON DB: Ganti dari 'category'
    material: Optional[str] = ""
    fit: str = "Regular Fit"
    available_sizes: List[str] = []
    
    # ✅ SINKRON DB: Menampung link e-commerce lo biar ga pecah di frontend
    links: Optional[dict] = {"shopee": "", "tiktok": ""} 
    
    is_active: bool = True

    class Config:
        populate_by_name = True       # Mengizinkan pembacaan alias _id secara aman Bal
        from_attributes = True