from fastapi import APIRouter, HTTPException, Depends
from app.schemas.cms_schema import CMSUpdateSchema
from app.services.cms_service import get_cms_master_config, update_cms_master_config
from app.core.security import get_current_user
from app.services.audit_service import create_audit_log  # 🚀 Global Audit Log Pipeline

router = APIRouter(
    prefix="/api",
    tags=["CMS Management Core"]
)

@router.get("/cms")
async def fetch_public_cms():
    return await get_cms_master_config()

# =========================================================
# 🖥️ POST/PUT UPDATE CMS (LOG SPESIFIK & DINAMIS)
# =========================================================
@router.post("/admin/cms")
async def save_admin_cms(
    payload: CMSUpdateSchema, 
    current_user: dict = Depends(get_current_user)
):
    try:
        # 1. Ambil data CMS yang ada di database SAAT INI (sebelum diubah)
        current_config = await get_cms_master_config() or {}
        
        # 2. Konversi payload baru dari frontend menjadi dictionary Python
        new_config = payload.dict(exclude_unset=False)
        
        # 3. 🧠 LOGIKA DETEKSI PERUBAHAN: Bandingkan key per key secara otomatis
        changed_fields = []
        
        # Blok pencarian untuk tipe data bersarang (Nested Object seperti hero, about, dll)
        for section, content in new_config.items():
            if isinstance(content, dict) and section in current_config:
                # Cek perubahan di dalam sub-section (Misal: hero -> title, subtitle)
                for key, value in content.items():
                    old_value = current_config[section].get(key)
                    if old_value != value:
                        # Format menjadi format keren: HERO -> HERO_TITLE_PLAIN
                        field_name = f"{section.upper()} -> {key.upper().replace('_', ' ')}"
                        changed_fields.append(field_name)
            else:
                # Cek perubahan untuk field level atas (jika ada string langsung)
                if current_config.get(section) != content:
                    changed_fields.append(section.upper())

        # 4. Tentukan nama target log secara dinamis berdasarkan field yang diganti
        if changed_fields:
            # Jika banyak yang diganti, gabungkan pakai koma. Maksimal tampilkan 2 biar gak kepanjangan
            target_log = ", ".join(changed_fields[:2])
            if len(changed_fields) > 2:
                target_log += f" (+{len(changed_fields) - 2} FIELD LAIN)"
            log_detail = f"Berhasil memperbarui konfigurasi teks/visual pada komponen: {', '.join(changed_fields)}."
        else:
            target_log = "MASTER CONFIG"
            log_detail = "Sinkronisasi ulang master config CMS tanpa ada perubahan data teks."

        # 5. Eksekusi update data baru ke MongoDB Atlas
        await update_cms_master_config(new_config)
        
        # 6. 🚀 TEMBAK KE GLOBAL AUDIT LOG (Otomatis Dinamis Tanpa Hardcode!)
        await create_audit_log(
            current_user=current_user,
            action="UPDATE CMS",
            target=target_log,  # Output spesifik: "HERO -> TITLE PLAIN"
            detail=log_detail
        )
        
        return {"success": True, "message": "CMS configuration synchronized successfully."}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))