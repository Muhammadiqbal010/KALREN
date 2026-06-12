from datetime import datetime, timezone

def product_model(data):
waktu_sekarang = datetime.now(timezone.utc)

```
# =========================================================
# DISCOUNT PARSER
# =========================================================
raw_discount = data.get("is_discount", False)

if isinstance(raw_discount, str):
    real_discount_status = raw_discount.lower() == "true"
else:
    real_discount_status = bool(raw_discount)

# =========================================================
# COMPARE PRICE PARSER
# =========================================================
raw_compare_price = data.get("compare_price")
final_strike_price = None

if (
    real_discount_status
    and raw_compare_price is not None
    and str(raw_compare_price).strip() != ""
):
    final_strike_price = float(raw_compare_price)

# =========================================================
# PRODUCT DOCUMENT
# =========================================================
return {
    # Basic Info
    "name": data.get("name") or data.get("title"),
    "series": data.get("series") or data.get("category"),
    "slug": data.get("slug", ""),
    "description": data.get("description", ""),

    # Visibility
    "status": data.get("status", "draft"),

    # Product Detail
    "color": data.get("color", "black"),
    "price": float(data["price"]),
    "compare_price": final_strike_price,
    "is_discount": real_discount_status,
    "material": data.get("material", ""),
    "fit": data.get("fit", "Regular Fit"),
    "available_sizes": data.get("available_sizes", []),

    # Marketplace Links
    "links": {
        "shopee": (
            data.get("shopee_url")
            or data.get("shopee_link")
            or ""
        ),
        "tiktok": (
            data.get("tiktok_url")
            or data.get("tiktok_link")
            or ""
        )
    },

    # Images
    "image_urls": (
        data.get("image_urls")
        or data.get("images")
        or []
    ),

    # System Flags
    "is_active": data.get("is_active", True),
    "is_deleted": data.get("is_deleted", False),

    # Timestamps
    "created_at": (
        data.get("created_at")
        or waktu_sekarang
    ),
    "updated_at": waktu_sekarang
}
```
