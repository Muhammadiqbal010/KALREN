import os
import motor.motor_asyncio
from dotenv import load_dotenv

# Load data dari file .env
load_dotenv()

# Ambil URL MongoDB dari .env
MONGODB_URL = os.getenv("MONGODB_URL")

# Inisialisasi Client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)

# Tentukan Database 
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