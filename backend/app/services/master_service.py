# app/services/master_service.py
from app.database.collections import master_collection

async def get_master():
    data = await master_collection.find_one({"_id": "config"})
    if data:
        data.pop("_id", None) # Hapus _id biar frontend gak bingung
        return data
    return {"kategoriData": {}, "satuan": []}

async def save_master(data: dict):
    # Logging untuk memastikan backend menerima data
    print("Menerima data untuk disimpan:", data) 
    
    # Gunakan upsert dengan filter yang pasti
    result = await master_collection.replace_one(
        {"_id": "config"}, 
        data, 
        upsert=True
    )
    print("Hasil simpan ke DB:", result.modified_count, result.upserted_id)
    return {"message": "Data saved"}