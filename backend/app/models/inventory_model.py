from datetime import datetime, timezone
from bson import ObjectId


def inventory_model(doc: dict) -> dict:
    return {
        "id":         str(doc["_id"]),
        "nama_bahan": doc["nama_bahan"],
        "kategori":   doc["kategori"],
        "stok":       doc["stok"],
        "satuan":     doc["satuan"],
        "min_stok":   doc.get("min_stok", 5),
        "ukuran":     doc.get("ukuran"),
        "warna":      doc.get("warna"),
        "keterangan": doc.get("keterangan"),
        "created_at": doc.get("created_at", "").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at", ""),
        "updated_at": doc.get("updated_at", "").isoformat() if isinstance(doc.get("updated_at"), datetime) else doc.get("updated_at", ""),
    }


def inventory_list_model(docs: list) -> list:
    """Wrapper untuk mapping list dokumen."""
    return [inventory_model(doc) for doc in docs]