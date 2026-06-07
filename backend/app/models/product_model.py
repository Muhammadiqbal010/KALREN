from datetime import datetime, timezone

def product_model(data):
    waktu_sekarang = datetime.now(timezone.utc)
    
    # 1. HANDLING NILAI BOOLEAN DISKON DARI FRONTEND DENGAN AMAN BAL
    raw_discount = data.get("is_discount", False)
    if isinstance(raw_discount, str):
        real_discount_status = True if raw_discount.lower() == "true" else False
    else:
        real_discount_status = bool(raw_discount)

    # 2. HANDLING HARGA CORET AGAR STRK_PRICE KOSONG TIDAK BIKIN EROR FLOAT BINER
    raw_compare_price = data.get("compare_price")
    final_strike_price = None
    if real_discount_status and raw_compare_price and str(raw_compare_price).strip() != "":
        final_strike_price = float(raw_compare_price)

    # 3. STRUKTUR PAYLOAD SINKRON 1:1 DENGAN TULISAN DATABASE REPOSITORY KALREN LO
    return {
        "name": data.get("name") or data.get("title"), # ✅ SINKRON DB: Gabungan biar support jika frontend kirim name/title
        "series": data.get("series") or data.get("category"), # ✅ SINKRON DB: Gabungan biar support jika frontend kirim series/category
        "slug": data.get("slug", ""),
        "description": data.get("description", ""),
        "color": data.get("color", "black"), # ✅ SINKRON DB: field color bawaan dokumen lo Bal
        "price": float(data["price"]), # ✅ SINKRON DB
        "compare_price": final_strike_price, # ✅ SINKRON DB: field baru harga coret
        "is_discount": real_discount_status, # ✅ SINKRON DB: field baru sakelar diskon
        "material": data.get("material", ""),
        "fit": data.get("fit", "Regular Fit"),
        "available_sizes": data.get("available_sizes", []),
        
        # ✅ SINKRON DB: Links ecommerce dirapikan ke dalam satu objek biner links
        "links": {
            "shopee": data.get("shopee_url") or data.get("shopee_link") or "",
            "tiktok": data.get("tiktok_url") or data.get("tiktok_link") or ""
        },
        
        # ✅ SINKRON DB: Diganti dari 'images' menjadi 'image_urls' (Array urutan foto lo Bal)
        "image_urls": data.get("image_urls") or data.get("images") or [], 
        
        "is_active": data.get("is_active", True), # ✅ SINKRON DB
        "created_at": data.get("created_at") or waktu_sekarang,
        "updated_at": waktu_sekarang
    }