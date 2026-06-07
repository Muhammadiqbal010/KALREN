from datetime import datetime
from app.database.collections import analytics_collection

async def track_product_click(product_id: str, platform: str):
    allowed_platforms = ["shopee", "tiktok", "instagram", "website"]

    if platform not in allowed_platforms:
        return

    await analytics_collection.update_one(
        {"product_id": product_id},
        {
            "$inc": {
                f"clicks.{platform}": 1
            }
        },
        upsert=True
    )

async def log_admin_activity(username: str, action: str, details: str):
    try:
        log_payload = {
            "type": "activity_log",
            "username": username,  
            "action": action,
            "details": details,
            "timestamp": datetime.utcnow()
        }
        await analytics_collection.insert_one(log_payload)
    except Exception as e:
        print(f"Gagal mencatat log aktivitas master hub: {e}")