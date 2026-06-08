from fastapi import APIRouter, Form, File, UploadFile, HTTPException, status, Depends
from typing import Optional
from bson import ObjectId

from app.core.security import get_current_user
from app.services.audit_service import create_audit_log  # 🚀 Global Audit Log Pipeline
from app.services.lookbook_service import (
    get_lookbooks, 
    create_lookbook_item, 
    update_lookbook_item, 
    delete_lookbook_item
)

router = APIRouter(
    prefix="/api",
    tags=["Lookbook"]
)

# =========================================================
# 🔍 1. GET ALL: Memuat list data lookbook (Publik)
# =========================================================
@router.get("/lookbook")
async def fetch_book():
    try:
        return await get_lookbooks()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal memetakan data lookbook publik: {str(e)}"
        )

# =========================================================
# 🚀 2. POST CREATE: Publikasi campaign baru (OTOMATIS AUDIT LOG)
# =========================================================
@router.post("/admin/lookbook")
async def add_lookbook(
    title: str = Form(...),
    sort_order: int = Form(0),
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not title.strip():
        raise HTTPException(status_code=400, detail="Judul campaign lookbook wajib diisi, Bal!")

    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Asset wajib berformat file gambar (JPG/PNG/WEBP)!")
        
    try:
        item_id = await create_lookbook_item(title, sort_order, image)
        
        # 🚀 AUDIT LOG PIPELINE SYSTEM
        await create_audit_log(
            current_user=current_user,
            action="ADD LOOKBOOK",
            target=title.strip().toUpperCase(),
            detail="Berhasil menerbitkan campaign lookbook terbaru ke halaman galeri publik KALREN."
        )
        
        return {"success": True, "id": item_id, "message": "Campaign lookbook created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================================
# 📝 3. PUT UPDATE: Memperbarui isi konten (OTOMATIS AUDIT LOG)
# =========================================================
@router.put("/admin/lookbook/{id}")
async def modify_lookbook(
    id: str,
    title: str = Form(...),
    sort_order: int = Form(...),
    is_active: bool = Form(True),
    image: Optional[UploadFile] = File(None), # Pastikan ini File(None)
    current_user: dict = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID tidak valid")
    
    try:
        await update_lookbook_item(id, title, sort_order, image)
        return {"success": True, "message": "Updated"}
    except Exception as e:
        # PENTING: Print ke log biar tahu kenapa error 500
        print(f"ERROR DI ROUTE: {str(e)}") 
        raise HTTPException(status_code=500, detail=str(e))

# =========================================================
# 🗑️ 4. DELETE: Menghapus item records (OTOMATIS AUDIT LOG)
# =========================================================
@router.delete("/admin/lookbook/{id}")
async def remove_lookbook(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID Campaign lookbook tidak valid!")
        
    try:
        # Eksekusi penghapusan database + auto destroy biner via helper terpusat
        await delete_lookbook_item(id)
        
        # 🚀 AUDIT LOG PIPELINE SYSTEM
        await create_audit_log(
            current_user=current_user,
            action="DELETE LOOKBOOK",
            target=f"ID: {id}",
            detail="Berhasil menghapus permanen berkas arsip campaign lookbook dari database dan storage Cloudinary."
        )
        
        return {"success": True, "message": "Campaign lookbook deleted successfully from cluster and cloud storage"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))