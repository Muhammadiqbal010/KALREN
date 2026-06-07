import bcrypt
import json
import os

# Nama file simulasi database tempat menyimpan data user
DB_FILE = "users_db.json"

def muat_database():
    """Fungsi untuk membaca data user yang sudah ada"""
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as file:
            return json.load(file)
    return {}

def simpan_database(data):
    """Fungsi untuk menyimpan data ke file JSON"""
    with open(DB_FILE, "w") as file:
        json.dump(data, file, indent=4)

def buat_user_baru():
    print("=== FORM PENDAFTARAN USER BARU ===")
    username = input("Masukkan Username Baru: ").strip()
    password = input("Masukkan Password Baru: ").strip()

    if not username or not password:
        print("❌ Username dan Password tidak boleh kosong!")
        return

    db = muat_database()

    # Cek apakah username sudah terdaftar
    if username in db:
        print("❌ Username sudah terpakai! Silakan coba yang lain.")
        return

    # PROSES HASHING PASSWORD (MENGGUNAKAN BCRYPT)
    # Mengubah password teks biasa menjadi hash aman ($2b$12$...)
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)  # cost factor 12 seperti proyekmu
    hash_password = bcrypt.hashpw(password_bytes, salt)

    # Simpan username dan hash password ke database (convert hash ke string dulu)
    db[username] = hash_password.decode('utf-8')
    simpan_database(db)

    print(f"\n✅ User '{username}' berhasil dibuat!")
    print(f"Hasil Hash Password yang disimpan: {db[username]}")

if __name__ == "__main__":
    buat_user_baru()