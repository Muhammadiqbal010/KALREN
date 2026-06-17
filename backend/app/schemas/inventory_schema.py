from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal


KATEGORI_VALID = Literal["Kain", "Trims", "Consumables"]
SATUAN_VALID   = Literal["meter", "pcs", "roll", "liter", "cone"]


# ── Request Schemas (input dari client) ───────────────────────────────────────

class InventoryCreateSchema(BaseModel):
    nama_bahan: str       = Field(..., min_length=1, max_length=100)
    kategori:   str       # Ubah dari KATEGORI_VALID menjadi str
    stok:       int
    satuan:     str       # Ubah dari SATUAN_VALID menjadi str
    min_stok:   int       = Field(default=5, ge=0)
    ukuran:     Optional[str] = Field(default=None, max_length=50)
    warna:      Optional[str] = Field(default=None, max_length=50)
    keterangan: Optional[str] = Field(default=None, max_length=300)

    @field_validator("nama_bahan")
    @classmethod
    def nama_tidak_kosong(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nama bahan tidak boleh kosong")
        return v.strip()


class InventoryUpdateSchema(BaseModel):
    nama_bahan: Optional[str]            = Field(None, min_length=1, max_length=100)
    kategori:   Optional[KATEGORI_VALID] = None
    stok:       Optional[int]            = Field(None, ge=0)
    satuan:     Optional[SATUAN_VALID]   = None
    min_stok:   Optional[int]            = Field(None, ge=0)
    ukuran:     Optional[str]            = Field(None, max_length=50)
    warna:      Optional[str]            = Field(None, max_length=50)
    keterangan: Optional[str]            = Field(None, max_length=300)


class AdjustStokSchema(BaseModel):
    delta: int = Field(..., description="Nilai positif = tambah, negatif = kurang")


class InventoryResponseSchema(BaseModel):
    id:         str
    nama_bahan: str
    kategori:   str
    stok:       int
    satuan:     str
    min_stok:   int
    ukuran:     Optional[str] = None
    warna:      Optional[str] = None
    keterangan: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None