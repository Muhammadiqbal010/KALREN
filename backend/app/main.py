from fastapi import FastAPI, Request, Form, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
from datetime import datetime
from pydantic import BaseModel
from typing import List

# Import Routers bawaan lu Bal
from app.routes.auth_routes import router as auth_router
from app.routes.cms_routes import router as cms_router
from app.routes.product_routes import router as product_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.lookbook_routes import router as lookbook_router
from app.routes.profile_routes import router as profile_router
from app.database.mongodb import database as db
from app.core.security import get_current_user

# =========================================
# INIT FASTAPI
# =========================================
app = FastAPI(
    title="KALREN API",
    description="Backend API untuk KALREN E-commerce",
    version="2.0.0"
)

# =========================================
# CORS
# =========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kalren.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# ROLE-BASED ACCESS CONTROL (RBAC) DEPENDENCY
# =========================================
class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: dict = Depends(get_current_user)):
        # Mengambil field 'role' dari dokumen user di MongoDB Atlas
        user_role = current_user.get("role", "user") # default ke admin jika role tidak ada
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="OTORITAS DITOLAK: AKUN ANDA TIDAK MEMILIKI AKSES KE MODUL INI."
            )
        return current_user

# Gatekeeper yang siap lu pasang di router manapun Bal
allow_admin_and_owner = RoleChecker(["admin", "owner"])
allow_only_owner = RoleChecker(["owner"])


# =========================================
# SKEMA PYDANTIC UNTUK LOG AKTIVITAS ADMIN
# =========================================
class LogSchema(BaseModel):
    username: str    # Nama user yang aktif eksekusi
    role: str        # Role user (admin / owner)
    action: str      # Jenis aksi (ADD PRODUCT, EDIT PRODUCT, DELETE, etc.)
    target: str      # Nama barang / ID item yang dimanipulasi
    detail: str      # Deskripsi pesan log tambahan


# =========================================================
# ENDPOINT INTERNAL LOG RIWAYAT AKTIVITAS (ANTI-BOCOOR)
# =========================================================
@app.post("/api/admin/create-log")
async def create_log(log_data: LogSchema, current_user: dict = Depends(get_current_user)):
    try:
        # 1. 🧠 DETEKSI STRUKTUR DATA CURRENT_USER (Aman untuk Objek maupun Dict)
        if hasattr(current_user, "username"):
            # Jika current_user adalah Objek Pydantic / Tortoise / SQLModel
            admin_name = current_user.username
            admin_role = getattr(current_user, "role", "admin")
        elif isinstance(current_user, dict):
            # Jika current_user adalah Dictionary standar
            # Kita cek juga apakah datanya bersarang di dalam key 'user'
            if "user" in current_user and isinstance(current_user["user"], dict):
                admin_name = current_user["user"].get("username")
                admin_role = current_user["user"].get("role", "admin")
            else:
                admin_name = current_user.get("username") or current_user.get("name")
                admin_role = current_user.get("role", "admin")
        else:
            # Fallback terakhir jika tipe data tidak dikenal, kita ambil stringifikasinya
            admin_name = str(current_user)
            admin_role = "admin"

        # Jika setelah dicek ternyata masih kosong, baru fallback ke data form log_data
        if not admin_name or admin_name == "None":
            admin_name = log_data.username or "Admin"
        if not admin_role or admin_role == "None":
            admin_role = log_data.role or "admin"

        # 2. OVERRIDE DOKUMEN: Paksa sinkronisasi data otentik server
        log_document = {
            "username": admin_name,                  # Username asli lu (Bukan Unknown lagi)
            "role": admin_role.lower().strip(),      # Role asli dari DB (owner/admin)
            "action": log_data.action.upper().strip(), 
            "target": log_data.target.upper().strip(), 
            "detail": log_data.detail.strip(),       
            "time": datetime.now().strftime("%H:%M"), 
            "date": datetime.now().strftime("%Y-%m-%d"), 
            "timestamp": datetime.now()
        }
        
        # 3. Simpan arsip langsung ke MongoDB Atlas
        await db.logs.insert_one(log_document)
        return {"success": True, "message": "Matriks riwayat aktivitas berhasil diarsipkan secara otentik"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mencatat audit log: {str(e)}")

# =========================================================
# 📊 ENDPOINT INTERNAL LOG RIWAYAT AKTIVITAS (UPDATED & SECURED)
# =========================================================

@app.get("/api/admin/logs")
async def get_all_logs(current_user: dict = Depends(get_current_user)):
    try:
        # 1. Menarik maksimal 10 log aktivitas paling baru (Limit sesuai request lu, Bal)
        # Menggunakan sort berdasarkan "_id" dengan nilai -1 (Khas BSON MongoDB untuk data terbaru)
        cursor = db.logs.find({}).sort("_id", -1).limit(10)
        logs = await cursor.to_list(length=10)
        
        # 2. Iterasi pembersihan agar ramah data JSON di Frontend React
        for log in logs:
            # Konversi objek _id khas BSON MongoDB menjadi string murni agar ramah JSON Frontend
            log["_id"] = str(log["_id"])
            
            # Bersihkan tipe data BSON datetime 'timestamp' agar tidak merusak parsing Axios di frontend
            if "timestamp" in log:
                del log["timestamp"]
                
        return logs
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Gagal memuat arsip riwayat aktivitas database: {str(e)}"
        )

# =========================================
# GLOBAL EXCEPTION HANDLER
# =========================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unexpected error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Terjadi kesalahan internal server",
            "error": str(exc)
        }
    )

# =========================================
# LOGGING MIDDLEWARE
# =========================================
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logging.info(
        f"{request.method} {request.url.path} - {response.status_code} - {process_time:.2f}s"
    )
    
    return response

# =========================================
# INCLUDE ROUTERS
# =========================================
app.include_router(profile_router)
app.include_router(auth_router)
app.include_router(cms_router)
app.include_router(product_router)
app.include_router(analytics_router)
app.include_router(lookbook_router)


# =========================================
# ROOT & HEALTH
# =========================================
@app.get("/")
async def root():
    return {"status": "online", "message": "KALREN Engine is running 🚀"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/cms")
def get_cms():
    return {"status": "ok"}