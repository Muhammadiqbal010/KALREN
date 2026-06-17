from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.database.mongodb import database as db

from app.schemas.finance_schema import (
    TransaksiCreate,
    TransaksiUpdate
)

from app.services import finance_service

from app.services.report_service import (
    generate_report_data
)

from app.services.excel_service import (
    generate_excel_report
)

from app.services.pdf_service import (
    generate_pdf_report
)

router = APIRouter(
    prefix="/finance",
    tags=["Finance"]
)

# =====================================================
# CREATE
# =====================================================

@router.post("/transaksi")
async def tambah(data: TransaksiCreate):

    result = await finance_service.create_transaksi(
        db,
        data
    )

    result["id"] = str(
        result.pop("_id")
    )

    return {
        "success": True,
        "data": result
    }


# =====================================================
# LIST
# =====================================================

@router.get("/transaksi")
async def list_transaksi(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    tanggal: str | None = None,
    bulan: int | None = None,
    tahun: int | None = None,
):
    return await finance_service.get_transaksi(
        db,
        page=page,
        limit=limit,
        search=search,
        tanggal=tanggal,
        bulan=bulan,
        tahun=tahun
    )

# =====================================================
# TRANSAKSI SUMMARY (Income/Expense/Profit total, sesuai filter)
# =====================================================

@router.get("/transaksi/summary")
async def transaksi_summary(
    search: str | None = None,
    tanggal: str | None = None,
    bulan: int | None = None,
    tahun: int | None = None,
):
    data = await finance_service.get_transaksi_summary(
        db,
        search=search,
        tanggal=tanggal,
        bulan=bulan,
        tahun=tahun
    )

    return {
        "success": True,
        "data": data
    }

# =====================================================
# UPDATE
# =====================================================

@router.patch("/transaksi/{tid}")
async def update(
    tid: str,
    data: TransaksiUpdate
):

    success = await finance_service.update_transaksi(
        db,
        tid,
        data
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Data tidak ditemukan"
        )

    return {
        "success": True
    }


# =====================================================
# DELETE
# =====================================================

@router.delete("/transaksi/{tid}")
async def hapus(tid: str):

    deleted = await finance_service.delete_transaksi(
        db,
        tid
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Data tidak ditemukan"
        )

    return {
        "success": True,
        "message": "Berhasil dihapus"
    }


# =====================================================
# SUMMARY BULANAN
# =====================================================

@router.get("/summary")
async def summary(
    month: str,
    year: str
):

    month_year = f"{year}-{month.zfill(2)}"

    cursor = db.transaksi.find({
        "month_year": month_year
    })

    data = await cursor.to_list(
        length=10000
    )

    report = generate_report_data(
        data
    )

    return {
        "success": True,
        "data": {
            "income":
            report["dashboard"]["income"],

            "expense":
            report["dashboard"]["expense"],

            "profit":
            report["dashboard"]["profit"],

            "profit_margin":
            report["dashboard"]["profit_margin"],

            "total_transaksi":
            len(data)
        }
    }


# =====================================================
# DASHBOARD
# =====================================================

@router.get("/dashboard")
async def dashboard():

    cursor = db.transaksi.find({})

    data = await cursor.to_list(
        length=10000
    )

    report = generate_report_data(
        data
    )

    return {
        "success": True,
        "data":
        report["dashboard"]
    }


# =====================================================
# CASHFLOW
# =====================================================

@router.get("/cashflow")
async def cashflow():

    cursor = db.transaksi.find({})

    data = await cursor.to_list(
        length=10000
    )

    report = generate_report_data(
        data
    )

    return {
        "success": True,
        "data":
        report["cashflow"]
    }


# =====================================================
# PROFIT LOSS
# =====================================================

@router.get("/profit-loss")
async def profit_loss():

    cursor = db.transaksi.find({})

    data = await cursor.to_list(
        length=10000
    )

    report = generate_report_data(
        data
    )

    return {
        "success": True,
        "data":
        report["profit_loss"]
    }


# =====================================================
# BALANCE SHEET
# =====================================================

@router.get("/balance-sheet")
async def balance_sheet():

    cursor = db.transaksi.find({})

    data = await cursor.to_list(
        length=10000
    )

    report = generate_report_data(
        data
    )

    return {
        "success": True,
        "data":
        report["balance_sheet"]
    }


# =====================================================
# EXPORT EXCEL
# =====================================================

@router.get("/export/excel")
async def export_excel(
    month: str,
    year: str
):

    month_year = f"{year}-{month.zfill(2)}"

    cursor = db.transaksi.find({
        "month_year": month_year
    })

    data = await cursor.to_list(
        length=10000
    )

    if not data:

        raise HTTPException(
            status_code=404,
            detail="Data kosong"
        )

    output = generate_excel_report(
        data,
        month,
        year
    )

    return StreamingResponse(
        output,
        media_type=(
            "application/"
            "vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition":
            f"attachment; filename=KALREN_{month}_{year}.xlsx"
        }
    )


# =====================================================
# EXPORT PDF
# =====================================================

@router.get("/export/pdf")
async def export_pdf(
    month: str,
    year: str
):

    month_year = f"{year}-{month.zfill(2)}"

    cursor = db.transaksi.find({
        "month_year": month_year
    })

    data = await cursor.to_list(
        length=10000
    )

    if not data:

        raise HTTPException(
            status_code=404,
            detail="Data kosong"
        )

    output = generate_pdf_report(
        data,
        month,
        year
    )

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f"attachment; filename=KALREN_{month}_{year}.pdf"
        }
    )