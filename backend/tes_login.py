import asyncio
from passlib.context import CryptContext
from app.database.collections import user_collection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def test_koneksi_dan_cocok_data():
    print("=== DEBUGGING AUTH DIRECT TO MONGO ===")
    target_email = "Muhammadiqbal31@gmail.com"
    target_password_polos = "Iqbal31"
    
    # 1. Tarik data dari MongoDB Atlas
    user = await user_collection.find_one({"username": target_email})
    
    if not user:
        print(f"❌ GAGAL: Akun dengan username '{target_email}' TIDAK ADA di database!")
        return
        
    print("✅ Data Akun Ditemukan di MongoDB Atlas!")
    print(f"   ▪️ Username/Email di DB: {user.get('username')}")
    print(f"   ▪️ String Password di DB: {user.get('password')[:20]}...") 
    
    # 2. Tes Verifikasi Password
    try:
        is_match = pwd_context.verify(target_password_polos, user["password"])
        if is_match:
            print("🎉 SUKSES: Password polos 'Iqbal31' MATCH dengan hash di database lu!")
            print("👉 Kesimpulan: Backend & DB lu udah bener. Masalahnya ada di payload form Login.jsx frontend lu yang gak sesuai!")
        else:
            print("❌ GAGAL: Data ketemu, tapi password 'Iqbal31' TIDAK MATCH dengan hash di database.")
            print("👉 Kesimpulan: Password di DB lu corrupt atau salah hash.")
    except Exception as e:
        print(f"❌ EROR saat proses verifikasi hash: {str(e)}")
        print("👉 Kesimpulan: Password di DB lu kesimpan berupa teks polos (belum di-hash), makanya fungsi library python menolak.")

if __name__ == "__main__":
    asyncio.run(test_koneksi_dan_cocok_data())