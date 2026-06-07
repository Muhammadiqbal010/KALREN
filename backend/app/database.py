import os
import motor.motor_asyncio
from dotenv import load_dotenv

# Paksa load .env jika ada (hanya untuk lokal)
load_dotenv()

# AMBIL DARI ENV, TAPI BERIKAN DEFAULT KOSONG
MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("ERROR: MONGODB_URL tidak terbaca! Pastikan sudah di-set di Environment Variables Vercel.")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
database = client.kalren_db

# ==========================================
# INISIALISASI KOLEKSI (TABEL) - FIXED Version
# ==========================================
product_collection = database.products
analytics_collection = database.click_analytics
user_collection = database.users
lookbook_collection = database.lookbook

# Perbaikan: Variabel dipisah agar tidak saling tertimpa
site_settings_collection = database.site_settings
cms_collection = database.cms_settings

# Catatan: Baris 'db["cms"]' sebelumnya dihapus karena variabel 'db' tidak ada,
# dan sudah digantikan dengan struktur 'database.cms_settings' di atas.