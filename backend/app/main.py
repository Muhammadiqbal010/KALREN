from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
from datetime import datetime
from pydantic import BaseModel
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
import json

# Import Routers (Pastikan path-nya sesuai struktur folder baru lo)
from app.routes.auth_routes import router as auth_router
from app.routes.cms_routes import router as cms_router
from app.routes.product_routes import router as product_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.lookbook_routes import router as lookbook_router
from app.routes.profile_routes import router as profile_router
from app.routes.finance_routes import router as finance_router
from app.routes.inventory_routes import router as inventory_router
from app.routes.master_routes import router as master_route

# Gunakan database dari mongodb.py
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
    allow_origins=[
        "http://localhost:3000", 
        "http://192.168.1.10:3000",
        "http://10.121.135.183:3000",
        "http://192.168.1.15:3000",
        "http://10.99.37.183:3000",
        "http://192.168.1.5:3000", 
        "http://10.39.208.183:3000",
        "https://kalren.vercel.app" # domain prod kamu
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        # 1. DETEKSI STRUKTUR DATA CURRENT_USER
        if hasattr(current_user, "username"):
            admin_name = current_user.username
            admin_role = getattr(current_user, "role", "admin")
        elif isinstance(current_user, dict):
            if "user" in current_user and isinstance(current_user["user"], dict):
                admin_name = current_user["user"].get("username")
                admin_role = current_user["user"].get("role", "admin")
            else:
                admin_name = current_user.get("username") or current_user.get("name")
                admin_role = current_user.get("role", "admin")
        else:
            admin_name = str(current_user)
            admin_role = "admin"

        if not admin_name or admin_name == "None":
            admin_name = log_data.username or "Admin"
        if not admin_role or admin_role == "None":
            admin_role = log_data.role or "admin"

        # 2. OVERRIDE DOKUMEN
        log_document = {
            "username": admin_name,                  
            "role": admin_role.lower().strip(),      
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
# ENDPOINT INTERNAL LOG RIWAYAT AKTIVITAS
# =========================================================
@app.get("/api/admin/logs")
async def get_all_logs(current_user: dict = Depends(get_current_user)):
    try:
        cursor = db.logs.find({}).sort("_id", -1).limit(10)
        logs = await cursor.to_list(length=10)
        
        for log in logs:
            log["_id"] = str(log["_id"])
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
app.include_router(finance_router)
app.include_router(inventory_router)
app.include_router(master_route)

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

from app.core.config import MONGODB_URL

@app.get("/debug-uri")
async def debug_uri():
    import os
    uri = os.getenv("MONGODB_URL", "")
    return {
        "starts_with": uri[:20],
        "length": len(uri)
    }