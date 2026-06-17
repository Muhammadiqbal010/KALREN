from datetime import datetime, timezone
from bson import ObjectId

from app.database.collections import inventory_collection
from app.models.inventory_model import inventory_model, inventory_list_model
from app.schemas.inventory_schema import InventoryCreateSchema, InventoryUpdateSchema


# ── Read ──────────────────────────────────────────────────────────────────────

async def get_all_items() -> list:
    docs = await inventory_collection.find().sort("created_at", -1).to_list(200)
    return inventory_list_model(docs)


async def get_item_by_id(id: str) -> dict | None:
    doc = await inventory_collection.find_one({"_id": ObjectId(id)})
    return inventory_model(doc) if doc else None


# ── Create ────────────────────────────────────────────────────────────────────

async def create_item(data: InventoryCreateSchema) -> dict:
    now = datetime.now(timezone.utc)
    payload = {
        **data.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    result = await inventory_collection.insert_one(payload)
    created = await inventory_collection.find_one({"_id": result.inserted_id})
    return inventory_model(created)


# ── Adjust stok ───────────────────────────────────────────────────────────────

async def adjust_stok(id: str, delta: int) -> dict:
    """
    Menambah atau mengurangi stok secara atomic.
    Raises ValueError jika stok akan menjadi minus.
    Raises LookupError jika item tidak ditemukan.
    """
    doc = await inventory_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise LookupError("Item tidak ditemukan")

    new_stok = doc["stok"] + delta
    if new_stok < 0:
        raise ValueError(f"Stok tidak mencukupi. Stok saat ini: {doc['stok']}")

    await inventory_collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "stok":       new_stok,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    updated = await inventory_collection.find_one({"_id": ObjectId(id)})
    return inventory_model(updated)


# ── Update ────────────────────────────────────────────────────────────────────

async def update_item(id: str, data: InventoryUpdateSchema) -> dict:
    doc = await inventory_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise LookupError("Item tidak ditemukan")

    changes = {k: v for k, v in data.model_dump().items() if v is not None}
    if not changes:
        return inventory_model(doc)

    changes["updated_at"] = datetime.now(timezone.utc)
    await inventory_collection.update_one({"_id": ObjectId(id)}, {"$set": changes})
    updated = await inventory_collection.find_one({"_id": ObjectId(id)})
    return inventory_model(updated)


# ── Delete ────────────────────────────────────────────────────────────────────

async def delete_item(id: str) -> bool:
    result = await inventory_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise LookupError("Item tidak ditemukan")
    return True