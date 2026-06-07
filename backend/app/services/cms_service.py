import cloudinary.uploader
from fastapi import HTTPException
from app.database.collections import cms_collection


# Note: Pastikan lo definisikan cms_collection mengarah ke nama collection khusus CMS di DB Atlas lo Bal!
from app.database.collections import user_collection
# Sebagai amunisi aman, kita asumsikan cms_collection diimport dari file collections lo:
from app.database.collections import cms_collection 

async def get_cms_master_config() -> dict:
    # Cari dokumen master tunggal
    config = await cms_collection.find_one({"cms_type": "master_configuration"})
    if config:
        config["_id"] = str(config["_id"])
        return config
    
    # Fallback return object kosong jika cluster Mongo lo baru/cold-start Bal
    return {
        "hero_title": "", "hero_title_gradient": "", "hero_subtitle": "",
        "hero_cta_text": "", "running_text": "", "manifesto_title": "",
        "manifesto_title_italic": "", "manifesto_description": "",
        "missions": [], "cta_title": "", "cta_title_gradient": "",
        "cta_button_text": "", "shopee_url": "", "tiktok_url": ""
    }

async def update_cms_master_config(data: dict) -> bool:
    # 🚀 STRATEGI UPSERT: Pakai find_one_and_update agar otomatis create / replace data tunggal Bal
    await cms_collection.find_one_and_update(
        {"cms_type": "master_configuration"},
        {"$set": data},
        upsert=True
    )
    return True