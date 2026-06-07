import asyncio
from passlib.context import CryptContext
from app.database.collections import user_collection

# Setup Hash (Samakan dengan konfigurasi auth_service lu)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def update_user_fields():
    print("=== KALREN ENGINE: USER DATA UPDATER UTILITY ===")
    
    # 1. Cari user target berdasarkan username (email) saat ini
    current_username = input("🔍 Masukkan email user yang mau DIUBAH: ").strip()
    
    existing_user = await user_collection.find_one({"username": current_username})
    if not existing_user:
        print(f"❌ Eror: User dengan email '{current_username}' tidak ditemukan di database!")
        return

    print(f"\n✅ User Ditemukan! (Role: {existing_user.get('role', 'N/A')})")
    print("Silakan isi data baru di bawah (Kosongkan/pencet Enter jika tidak ingin diubah):")
    
    # 2. Input data perubahan
    new_username = input("✉️ Masukkan EMAIL BARU (atau Enter untuk skip): ").strip()
    new_password = input("🔑 Masukkan PASSWORD BARU (atau Enter untuk skip): ").strip()
    
    # 3. Validasi dan penyusunan payload update
    update_data = {}
    
    if new_username:
        # Cek apakah email baru sudah dipakai user lain biar ga bentrok
        conflict_user = await user_collection.find_one({"username": new_username})
        if conflict_user and new_username != current_username:
            print(f"❌ Gagal: Email '{new_username}' sudah terdaftar untuk user lain!")
            return
        update_data["username"] = new_username
        
    if new_password:
        # Hashing password baru biar aman
        update_data["password"] = pwd_context.hash(new_password)
        
    # 4. Eksekusi ke MongoDB
    if not update_data:
        print("\nℹ️ Tidak ada data yang diubah (Semua input diskip).")
        return

    await user_collection.update_one(
        {"username": current_username},
        {"$set": update_data}
    )
    
    print("\n🎉 DATA BERHASIL DIPERBARUI!")
    if "username" in update_data:
        print(f"  ▪️ Email Baru: {update_data['username']}")
    if "password" in update_data:
        print("  ▪️ Password Baru: [BERHASIL DI-HASH]")

if __name__ == "__main__":
    asyncio.run(update_user_fields())