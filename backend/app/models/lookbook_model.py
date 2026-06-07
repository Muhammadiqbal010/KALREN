from datetime import datetime, timezone

def lookbook_model(data) -> dict:
    return {
        "title": data["title"],
        "image_url": data["image_url"],
        "sort_order": int(data.get("sort_order", 0)),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }