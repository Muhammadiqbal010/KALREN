import cloudinary.uploader
from fastapi import HTTPException, UploadFile
from bson import ObjectId
from typing import Optional, List
from datetime import datetime, timezone
from app.database.collections import lookbook_collection # Kunci import collections aman sesuai environment lo Bal

# =========================================================
# ⚙️ HELPER: EKSTRAKSI PUBLIC ID CLOUDINARY SECARA AMAN BAL
# =========================================================
def extract_cloudinary_public_id(url: str) -> Optional[str]:
    try:
        if "upload/" not in url:
            return None
            
        # Pisahkan untuk mengambil bagian setelah /upload/
        parts = url.split("upload/")[1]
        
        # Hapus versi (misal: v1717839201/)
        if parts.startswith("v") and "/" in parts:
            parts = parts.split("/", 1)[1]
            
        # Ambil nama file dan buang ekstensinya
        public_id = parts.rsplit(".", 1)[0]
        return public_id
    except Exception as e:
        print(f"Error ekstraksi ID: {e}")
        return None


# =========================================================
# 🔍 1. GET ALL CAMPAIGNS
# =========================================================
async def get_lookbooks() -> List[dict]:
    try:
        cursor = lookbook_collection.find({}).sort("sort_order", 1)
        items = await cursor.to_list(length=100)
        for item in items:
            item["_id"] = str(item["_id"])
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memuat repositori lookbook: {str(e)}")


# =========================================================
# 🚀 2. CREATE / ADD NEW CAMPAIGN (WITH AUTO-SHIFT PIPELINE)
# =========================================================
async def create_lookbook_item(title: str, sort_order: int, image: UploadFile) -> str:
    try:
        # ⚡ LOGIKA AUTO-SHIFT: Jika ada campaign dengan sort_order >= target baru, geser naik (+1)
        await lookbook_collection.update_many(
            {"sort_order": {"$gte": int(sort_order)}},
            {"$inc": {"sort_order": 1}}
        )

        # Upload file biner asli hasil crop frontend ke folder 'kalren_lookbooks' lo Bal
        file_bytes = await image.read()
        upload_result = cloudinary.uploader.upload(
            file_bytes,
            folder="kalren_lookbooks"
        )
        image_url = upload_result.get("secure_url")
        
        if not image_url:
            raise HTTPException(status_code=500, detail="Gagal mendapatkan secure URL dari Cloudinary")

        payload = {
            "title": title.strip(),
            "sort_order": int(sort_order),
            "image_url": image_url
        }
        
        result = await lookbook_collection.insert_one(payload)
        return str(result.inserted_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mempublikasikan campaign baru Bal: {str(e)}")


# =========================================================
# 📝 3. UPDATE CAMPAIGN (WITH FIX AUTO-CLEAN CLOUDINARY)
# =========================================================
async def update_lookbook_item(id: str, title: str, sort_order: int, image: Optional[UploadFile] = None):
    try:
        # 1. Validasi ID
        obj_id = ObjectId(id)
        existing_item = await lookbook_collection.find_one({"_id": obj_id})
        if not existing_item:
            raise HTTPException(status_code=404, detail="Campaign tidak ditemukan")

        # 2. Logic Shifting (Geser urutan)
        old_order = int(existing_item.get("sort_order", 0))
        new_order = int(sort_order)

        if old_order != new_order:
            if new_order < old_order:
                await lookbook_collection.update_many(
                    {"sort_order": {"$gte": new_order, "$lt": old_order}},
                    {"$inc": {"sort_order": 1}}
                )
            else:
                await lookbook_collection.update_many(
                    {"sort_order": {"$gt": old_order, "$lte": new_order}},
                    {"$inc": {"sort_order": -1}}
                )

        # 3. Payload Dasar
        update_payload = {
            "title": title.strip(),
            "sort_order": new_order,
            "updated_at": datetime.now(timezone.utc)
        }

        # 4. Handle Image (Hanya jika ada file baru)
        # 4. Handle Image (Hanya jika ada file baru)
        if image and hasattr(image, 'filename') and image.filename:
            file_bytes = await image.read()
            upload_result = cloudinary.uploader.upload(file_bytes, folder="kalren_lookbooks")
            new_image_url = upload_result.get("secure_url")
            
            if new_image_url:
                update_payload["image_url"] = new_image_url
                # Hapus yang lama
                old_image_url = existing_item.get("image_url")
                if old_image_url and "cloudinary.com" in old_image_url:
                    public_id = extract_cloudinary_public_id(old_image_url)
                    if public_id:
                        cloudinary.uploader.destroy(public_id, invalidate=True)
        else:
            # Jika tidak ada gambar, lewati bagian ini
            pass

        # 5. Update
        await lookbook_collection.update_one({"_id": obj_id}, {"$set": update_payload})
        return True
        
    except Exception as e:
        # PENTING: Print ini agar muncul di Vercel Logs
        print(f"CRITICAL ERROR IN UPDATE SERVICE: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# 🗑️ 4. PERMANENT DELETE CAMPAIGN (FIX PARAMETER DESTROY)
# =========================================================
async def delete_lookbook_item(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="ID Campaign tidak valid")

        # 1. Cari datanya dulu buat ngamanin link URL gambarnya Bal
        existing_item = await lookbook_collection.find_one({"_id": ObjectId(id)})
        if not existing_item:
            raise HTTPException(status_code=404, detail="Campaign tidak ditemukan di database")

        # 2. Lakukan pemboman hancurkan file asli di server Cloudinary
        image_url = existing_item.get("image_url")
        if image_url and "cloudinary.com" in image_url:
            public_id = extract_cloudinary_public_id(image_url)
            if public_id:
                try:
                    # ✅ FIX MUTLAK: Lempar public_id yang bener, BUKAN image_url mentah!
                    cloudinary.uploader.destroy(public_id, invalidate=True)
                    print(f"🔥 Wipeout: Berhasil menghapus biner asset lookbook dari Cloudinary: {public_id}")
                except Exception as ce:
                    print(f"Warning: Gagal menghapus aset biner lookbook di Cloudinary: {ce}")

        # 3. Terakhir, lenyapkan datanya dari cluster MongoDB Atlas lo sampai bersih total
        await lookbook_collection.delete_one({"_id": ObjectId(id)})
        return True
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengeksekusi hapus permanen lookbook: {str(e)}")