import asyncio
from slugify import slugify
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Ganti dengan URI Atlas lo
MONGO_URI = "mongodb+srv://admin_kalren:Kalren123456@masashimura.ynvltcv.mongodb.net/kalren_db?retryWrites=true&w=majority&appName=masashimura"
client = AsyncIOMotorClient(MONGO_URI)
db = client["kalren_db"] # Ganti sesuai nama database lo
product_collection = db["products"] 

async def migrate():
    products = await product_collection.find({"slug": {"$exists": False}}).to_list(length=None)
    print(f"Ditemukan {len(products)} produk tanpa slug...")

    for p in products:
        # Generate slug dari nama
        name = p.get("name", "untitled-product")
        new_slug = slugify(name)
        
        # Update ke MongoDB
        await product_collection.update_one(
            {"_id": p["_id"]},
            {"$set": {"slug": new_slug}}
        )
        print(f"Updated: {name} -> {new_slug}")

    print("Migrasi selesai!")

if __name__ == "__main__":
    asyncio.run(migrate())