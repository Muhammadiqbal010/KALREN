# app/services/master_service.py
from app.database.collections import master_collection

async def get_master():
    # Gunakan master_collection yang sudah di-import
    data = await master_collection.find_one({"_id": "config"})
    # Buang _id dari respons agar tidak error di frontend
    if data:
        data.pop("_id", None)
        return data
    return {"kategoriData": {}, "satuan": []}

async def save_master(data: dict):
    # Gunakan master_collection untuk update
    await master_collection.replace_one(
        {"_id": "config"}, 
        data, 
        upsert=True
    )
    return {"message": "Data saved"}