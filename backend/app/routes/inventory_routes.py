from fastapi import APIRouter, HTTPException, status

from app.schemas.inventory_schema import (
    InventoryCreateSchema,
    InventoryUpdateSchema,
    AdjustStokSchema,
    InventoryResponseSchema,
)
from app.services.inventory_service import (
    get_all_items,
    get_item_by_id,
    create_item,
    adjust_stok,
    update_item,
    delete_item,
)

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])


# ── GET semua item ────────────────────────────────────────────────────────────

@router.get("/", response_model=list[InventoryResponseSchema])
async def list_items():
    return await get_all_items()


# ── GET satu item ─────────────────────────────────────────────────────────────

@router.get("/{id}", response_model=InventoryResponseSchema)
async def get_item(id: str):
    item = await get_item_by_id(id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item tidak ditemukan")
    return item


# ── POST buat item baru ───────────────────────────────────────────────────────

@router.post("/", response_model=InventoryResponseSchema, status_code=status.HTTP_201_CREATED)
async def create(body: InventoryCreateSchema):
    return await create_item(body)


# ── PATCH adjust stok (+/-) ───────────────────────────────────────────────────

@router.patch("/{id}/adjust", response_model=InventoryResponseSchema)
async def adjust(id: str, body: AdjustStokSchema):
    try:
        return await adjust_stok(id, body.delta)
    except LookupError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# ── PATCH update field lain ───────────────────────────────────────────────────

@router.patch("/{id}", response_model=InventoryResponseSchema)
async def update(id: str, body: InventoryUpdateSchema):
    try:
        return await update_item(id, body)
    except LookupError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ── DELETE ────────────────────────────────────────────────────────────────────

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(id: str):
    try:
        await delete_item(id)
    except LookupError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))