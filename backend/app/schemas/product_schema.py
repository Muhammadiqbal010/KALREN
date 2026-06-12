from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class ProductResponse(BaseModel):
# =========================================================
# MONGODB
# =========================================================
id: str = Field(..., alias="_id")

```
# =========================================================
# BASIC INFO
# =========================================================
name: str
slug: str
series: str

description: Optional[str] = ""
color: Optional[str] = "black"

# =========================================================
# PRICING
# =========================================================
price: float
compare_price: Optional[float] = None
is_discount: bool = False

# =========================================================
# PRODUCT DETAILS
# =========================================================
material: Optional[str] = ""
fit: str = "Regular Fit"

available_sizes: List[str] = Field(default_factory=list)

# =========================================================
# MEDIA
# =========================================================
image_urls: List[str] = Field(
    default_factory=list,
    alias="image_urls"
)

# =========================================================
# MARKETPLACE LINKS
# =========================================================
links: Dict[str, str] = Field(
    default_factory=lambda: {
        "shopee": "",
        "tiktok": ""
    }
)

# =========================================================
# STATUS SYSTEM
# =========================================================
status: str = "draft"

is_active: bool = True
is_deleted: bool = False

# =========================================================
# TIMESTAMPS
# =========================================================
created_at: Optional[datetime] = None
updated_at: Optional[datetime] = None
deleted_at: Optional[datetime] = None

class Config:
    populate_by_name = True
    from_attributes = True
```
