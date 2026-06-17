from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


class FlowType(str, Enum):
    income = "Income"
    expense = "Expense"


class Kategori(str, Enum):
    produksi = "Produksi"
    pembelian = "Pembelian"
    marketing = "Marketing"
    gaji = "Gaji"
    lain_lain = "Lain-lain"
    income = "Income"


class TransaksiCreate(BaseModel):
    tanggal: date

    flow: FlowType

    kategori: Kategori

    sub_kategori: Optional[str] = None

    keterangan: str = Field(
        ...,
        min_length=1,
        max_length=255
    )

    gross_amount: float = Field(
        ...,
        gt=0
    )

    potongan: float = Field(
        default=0,
        ge=0
    )

    metode: str = Field(
        default="Transfer",
        min_length=1,
        max_length=50
    )


class TransaksiUpdate(BaseModel):
    tanggal: Optional[date] = None

    flow: Optional[FlowType] = None

    kategori: Optional[Kategori] = None

    sub_kategori: Optional[str] = None

    keterangan: Optional[str] = None

    gross_amount: Optional[float] = Field(
        default=None,
        gt=0
    )

    potongan: Optional[float] = Field(
        default=None,
        ge=0
    )

    metode: Optional[str] = None