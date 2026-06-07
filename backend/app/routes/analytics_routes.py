from fastapi import APIRouter, HTTPException, status, Query, Depends
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Optional

from app.database.collections import product_collection, analytics_collection
from app.core.security import get_current_user

router = APIRouter(
    prefix="/api",
    tags=["Analytics Engine Hub"]
)

# =========================================================
# 📊 POST TRACK-CLICK (UPSERT BERBASIS TANGGAL REALTIME)
# =========================================================
@router.post("/track-click/{target_id}")
async def register_click_metrics(
    target_id: str,
    platform: str = Query(..., description="Platform target click: shopee, tiktok, instagram, tiktok_profile")
):
    try:
        platform_key = platform.strip().lower()
        today_str = datetime.utcnow().strftime("%Y-%m-%d") # Mengunci tanggal hari ini Bal!

        # -------------------------------------------------
        # JALUR A: KLIK LINK GLOBAL SOSMED / TOKO UTAMA
        # -------------------------------------------------
        if target_id == "global_links":
            await analytics_collection.update_one(
                {"type": "daily_cta_clicks", "date": today_str},
                {
                    "$inc": {f"clicks.{platform_key}": 1},
                    "$set": {"updated_at": datetime.utcnow()}
                },
                upsert=True
            )
            return {"success": True, "message": "Global daily click recorded"}

        # -------------------------------------------------
        # JALUR B: KLIK TOMBOL BELI PER ARTIKEL BAJU
        # -------------------------------------------------
        if not ObjectId.is_valid(target_id):
            raise HTTPException(status_code=400, detail="ID artikel tidak valid!")

        product = await product_collection.find_one({"_id": ObjectId(target_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")

        # Inkrementasi counter lokal produk (Untuk Top Products)
        await product_collection.update_one(
            {"_id": ObjectId(target_id)},
            {"$inc": {"views": 1}}
        )

        # Update performa produk spesifik
        await analytics_collection.update_one(
            {"product_id": ObjectId(target_id)},
            {
                "$set": {"type": "product_performance", "updated_at": datetime.utcnow()},
                "$inc": {f"clicks.{platform_key}": 1}
            },
            upsert=True
        )

        # Gabungkan klik produk ke dalam data grafik harian global
        await analytics_collection.update_one(
            {"type": "daily_cta_clicks", "date": today_str},
            {"$inc": {f"clicks.{platform_key}": 1}},
            upsert=True
        )

        return {"success": True, "message": "Product daily click recorded"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# 📈 GET TIMELINE GRAFIK (AMBIL 7 HARI TERAKHIR DINAMIS)
# =========================================================
@router.get("/admin/analytics")
async def get_dashboard_analytics(current_user: dict = Depends(get_current_user)):
    try:
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=6)
        
        date_list = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]
        
        # Tarik data dari Mongo Atlas yang match dengan 7 tanggal ini Bal
        cursor = analytics_collection.find({
            "type": "daily_cta_clicks",
            "date": {"$in": date_list}
        })
        raw_data = await cursor.to_list(length=7)
        
        # Mapping datanya biar urut kronologis
        data_map = {doc["date"]: doc.get("clicks", {}) for doc in raw_data if isinstance(doc, dict)}
        
        timeline_response = []
        for d in date_list:
            clicks = data_map.get(d, {})
            # Jika node clicks isinya bukan dictionary (efek data rongsokan skema lama), paksa jadi dict kosong
            if not isinstance(clicks, dict):
                clicks = {}
                
            formatted_label = datetime.strptime(d, "%Y-%m-%d").strftime("%d %b").upper()
            
            timeline_response.append({
                "date_str": d,
                "label": formatted_label,
                "shopee_clicks": int(clicks.get("shopee", 0)),
                "tiktok_shop_clicks": int(clicks.get("tiktok", 0)),
                "instagram_clicks": int(clicks.get("instagram", 0)),
                "tiktok_profile_clicks": int(clicks.get("tiktok_profile", 0))
            })
            
        return timeline_response
    except Exception as e:
        print(f"⚠️ [BYPASS GRAPH TIMELINE CRASH]: {str(e)}")
        # SEKRING EMERGENSI: Balikin default array kosong biar FastAPI & React lu ga muntah eror 500
        return []