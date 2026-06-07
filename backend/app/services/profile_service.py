from bson import ObjectId
from datetime import datetime
from app.database.collections import user_collection

async def get_profile(user_id):

    user = await user_collection.find_one({
        "_id": user_id
    })

    if user:
        user["_id"] = str(user["_id"])

        user.pop("password", None)

    return user

async def update_admin_profile_service(user_id: str, name: str, avatar_url: str = None):
    """Service layer untuk update nama dan link avatar Cloudinary ke MongoDB Atlas"""
    try:
        # Siapkan payload update data dasar matrix
        update_data = {
            "name": name,
            "edited_at": datetime.utcnow()
        }
        
        # KUNCI UTAMA: Jika ada foto profil baru yang sukses di-upload ke Cloudinary, masukkan link-nya!
        if avatar_url:
            update_data["avatar"] = avatar_url

        # Eksekusi update langsung ke dokumen ID lo Bal
        result = await user_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            # Ambil data terbaru setelah di-update biar frontend dapet state paling fresh
            updated_user = await user_collection.find_one({"_id": ObjectId(user_id)})
            if updated_user:
                updated_user["_id"] = str(updated_user["_id"])
            return updated_user
            
        return None
    except Exception as e:
        print(f"Error pada update_admin_profile_service: {str(e)}")
        return None