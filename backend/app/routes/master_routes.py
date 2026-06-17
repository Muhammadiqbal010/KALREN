from fastapi import APIRouter
from app.services.master_service import get_master, save_master

router = APIRouter(prefix="/api/master", tags=["Master"])

@router.get("/")
async def read_master():
    return await get_master()

@router.post("/")
async def update_master(data: dict):
    return await save_master(data)