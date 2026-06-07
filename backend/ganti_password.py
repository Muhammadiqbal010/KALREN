import asyncio
from passlib.context import CryptContext
from app.database.collections import user_collection

# Setup context hash yang sama persis dengan security backend KALREN
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def force_reset():
    print("=== KALREN ENGINE: AMNESIA PASSWORD MANAGER ===")
    target_email = "Muhammadiqbal31@gmail.com"
    
    # 1. Tentukan password baru yang diinginkan
    # Lu bisa ganti string di bawah ini jika ingin password lain
    password_baru_polos = "Muhammadiqbal123" 
    
    # 2. Proses Hashing secara bersih di lokal environment backend
    hashed_password = pwd_context.hash(password_baru_polos)
    
    # 3. Cari user di Atlas berdasarkan field 'email'
    user = await user_collection.find_one({"email": target_email})
    
    if not user:
        print(f"❌ Eror: User dengan email '{target_email}' tidak ditemukan di MongoDB Atlas.")
        return
        
    # 4. Eksekusi Overwrite Password
    await user_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}}
    )
    
    print(f"\n✅ BERHASIL! Password untuk akun '{target_email}' dipaksa reset.")
    print(f"🔑 Kredensial Valid Sekarang:")
    print(f"   ▪️ Email: {target_email}")
    print(f"   ▪️ Password: {password_baru_polos}")
    print(f"   ▪️ New Hash Code: {hashed_password[:30]}...")

if __name__ == "__main__":
    asyncio.run(force_reset())