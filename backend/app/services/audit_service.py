from datetime import datetime
from app.database.mongodb import database as db # Sesuaikan dengan instansiasi DB lu

async def create_audit_log(current_user: dict, action: str, target: str, detail: str):
    """
    Fungsi global untuk mencatat riwayat aktivitas secara dinamis.
    Semua data user ditarik langsung dari database (Single Source of Truth).
    """
    try:
        # Menarik field 'name' (Muhammad Iqbal) atau fallback ke 'username' sesuai database
        admin_name = current_user.get("name") or current_user.get("username") or "Unknown Admin"
        admin_role = current_user.get("role", "admin")

        log_document = {
            "username": admin_name,                  # Murni dari DB
            "role": admin_role,                      # Murni dari DB (owner/admin)
            "action": action.upper().strip(),        # ADD PRODUCT, EDIT CMS, dll.
            "target": target.upper().strip(),        # Nama produk / nama halaman CMS
            "detail": detail.strip(),
            "time": datetime.now().strftime("%H:%M"),
            "date": datetime.now().strftime("%Y-%m-%d"),
            "timestamp": datetime.now()
        }
        
        # Simpan langsung ke collection logs di Atlas
        await db.logs.insert_one(log_document)
    except Exception as e:
        # Kita print ke terminal jika log gagal biar gak nge-block proses utama aplikasi
        print(f"⚠️ Gagal mencatat global audit log: {str(e)}")