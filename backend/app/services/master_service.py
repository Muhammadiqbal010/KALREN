from app.database.collections import master_collection

async def get_master():
    data = await db.master.find_one({"_id": "config"})
    return data if data else {"kategoriData": {}, "satuan": []}

async def save_master(data: dict):
    # Menggunakan upsert agar selalu update config yang sama
    await db.master.replace_one({"_id": "config"}, data, upsert=True)
    return {"message": "Data saved"}