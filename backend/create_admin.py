import asyncio
from passlib.context import CryptContext
from app.database.collections import user_collection
from datetime import datetime

# Setup Hash Engine
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user():
    # 🎯 ATUR DATA STRUKTUR BIAR SINKRON SAMA AKUN LU BAL
    raw_email = "Rendikadwi15@gmail.com"
    clean_username = "Rendika Dwi"
    display_name = "Rendika Dwi Irawan"
    password_polos = "Rendika150804"
    
    # Proses Hashing (Biar aman dan steril di cluster Atlas)
    hashed_password = pwd_context.hash(password_polos)
    
    # Payload utuh penyesuai format database (Anti-Validation Error)
    new_user = {
        "username": clean_username,
        "email": raw_email,
        "password": hashed_password,
        "role": "owner",
        "name": display_name,
        "created_at": datetime.utcnow(),
        "edited_at": datetime.utcnow(),
        "avatar": "https://res.cloudinary.com/ddxplesul/image/upload/v1780154080/kalren_products/default_avatar.png"
    }
    
    # Cek duplikasi berdasarkan email biar aman gak bentrok
    existing_user = await user_collection.find_one({"email": raw_email})
    
    if existing_user:
        # Kalau dokumen email sudah ada, kita ratakan datanya biar update format baru
        await user_collection.update_one(
            {"email": raw_email},
            {
                "$set": {
                    "username": clean_username,
                    "password": hashed_password,
                    "role": "owner",
                    "name": display_name,
                    "edited_at": datetime.utcnow(),
                    "avatar": new_user["avatar"]
                }
            }
        )
        print(f"✅ Akun dengan email {raw_email} sudah ada. FORMAT DATABASE DAN PASSWORD BERHASIL DISINKRONKAN!")
    else:
        # Jika bener-bener gak ada record-nya, langsung inject baru
        await user_collection.insert_one(new_user)
        print(f"✅ Akun {clean_username} ({raw_email}) BARU BERHASIL DICIPTAKAN SESUAI FORMAT SAKRAL!")

if __name__ == "__main__":
    # Eksekusi secara asinkron lewat event loop
    asyncio.run(create_user())