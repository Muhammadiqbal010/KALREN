from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FinanceTransaction(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

    id: Optional[str] = Field(
        default=None,
        alias="_id"
    )

    business_unit: str = "KALREN"

    flow: str

    kategori: str

    sub_kategori: Optional[str] = "-"

    gross_amount: float

    potongan: float = 0

    net_amount: float

    keterangan: str

    metode: str

    status: str = "paid"

    tanggal: datetime

    month_year: str

    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )