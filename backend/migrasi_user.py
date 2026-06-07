import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Setup hashing context penyeimbang core/security.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def migrasi_struktur_user():
    # 1. FIX KONEKSI: Langsung tembak URL Atlas asli lu biar anti salah baca variabel .env Bal
    mongo_uri = "mongodb+srv://admin_kalren:Kalren2026@masashimura.ynvltcv.mongodb.net/kalren_db?retryWrites=true&w=majority&appName=masashimura"
    
    print("Connecting directly to MongoDB Atlas Cluster...")
    client = AsyncIOMotorClient(mongo_uri)
    
    # 2. FIX DATABASE NAME: Sesuai target database cluster lu, yaitu kalren_db
    db = client.kalren_db 
    
    # Simpan string hash password asli lu biar login lama lu gak rusak
    secure_hash_password = "$2b$12$YuSzAr.tmfpYioreYVuFCerPhvgwIh53LVyYgCzphFLEBwDwcCbu2"
    
    # FIX TIMEZONE: Menggunakan datetime UTC standar Python 3.14 terbaru (Bebas Warning)
    waktu_sekarang = datetime.now(timezone.utc)
    
    # Blueprint struktur database baru 100% sesuai spesifikasi pesanan lu, Bal!
    user_baru_document = {
        "username": "muhammad Iqbal",             # Murni custom username pendek
        "email": "Muhammadiqbal31@gmail.com",       # Alamat email mandiri
        "password": secure_hash_password,           # Hash password aman terenkripsi
        "role": "owner",
        "name": "Muhammad Iqbal",                   # Field nama lengkap buat sapaan dinamis dashboard
        "created_at": waktu_sekarang,
        "edited_at": waktu_sekarang
    }
    
    try:
        print("Clearing old records in 'users' collection...")
        # Bersihkan sisa collection users lama biar kagak bentrok data ganda
        await db.users.delete_many({})
        
        print("Injecting new premium user structure into Atlas...")
        # Suntik dokumen baru berstruktur premium
        result = await db.users.insert_one(user_baru_document)
        
        print("\n================================================================")
        print("✅ MIGRASI STRUKTUR DATABASE USER KALREN SUKSES BESAR, BAL!")
        print(f"Target Database : {db.name}")
        print(f"Inserted ID     : {result.inserted_id}")
        print("================================================================")
        print("Sekarang username & email terpisah, lengkap dengan created_at/edited_at!")
        
    except Exception as e:
        print(f"\n❌ Gagal eksekusi migrasi, cek internet atau status cluster Atlas lu. Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(migrasi_struktur_user())