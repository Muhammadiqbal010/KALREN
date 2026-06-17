import math
from datetime import datetime, timedelta, timezone
from bson import ObjectId


def hitung_net(gross: float, potongan: float) -> float:
    return round(gross - potongan, 0)


async def create_transaksi(db, data):
    doc = data.model_dump()

    doc["sub_kategori"] = doc.get("sub_kategori") or "-"

    doc.update({
        "net_amount": hitung_net(
            data.gross_amount,
            data.potongan
        ),

        "month_year": data.tanggal.strftime("%Y-%m"),

        "tanggal": datetime.combine(
            data.tanggal,
            datetime.min.time()
        ),

        "created_at": datetime.now(timezone.utc)
    })

    result = await db.transaksi.insert_one(doc)

    doc["_id"] = result.inserted_id

    return doc


async def update_transaksi(db, tid: str, data):

    if not ObjectId.is_valid(tid):
        return False

    patch = {
        k: v
        for k, v in data.model_dump().items()
        if v is not None
    }

    if not patch:
        return False

    existing = await db.transaksi.find_one({
        "_id": ObjectId(tid)
    })

    if not existing:
        return False

    if "sub_kategori" in patch:
        patch["sub_kategori"] = patch["sub_kategori"] or "-"

    if (
        "gross_amount" in patch
        or
        "potongan" in patch
    ):

        gross = patch.get(
            "gross_amount",
            existing.get("gross_amount", 0)
        )

        potongan = patch.get(
            "potongan",
            existing.get("potongan", 0)
        )

        patch["net_amount"] = hitung_net(
            gross,
            potongan
        )

    if "tanggal" in patch:

        patch["month_year"] = patch[
            "tanggal"
        ].strftime("%Y-%m")

        patch["tanggal"] = datetime.combine(
            patch["tanggal"],
            datetime.min.time()
        )

    result = await db.transaksi.update_one(
        {"_id": ObjectId(tid)},
        {"$set": patch}
    )

    return result.modified_count > 0


async def delete_transaksi(db, tid: str):

    if not ObjectId.is_valid(tid):
        return False

    result = await db.transaksi.delete_one({
        "_id": ObjectId(tid)
    })

    return result.deleted_count > 0


def build_transaksi_query(search=None, tanggal=None, bulan=None, tahun=None):
    query = {}

    if search:
        query["$or"] = [
            {
                "keterangan": {
                    "$regex": search,
                    "$options": "i"
                }
            },
            {
                "sub_kategori": {
                    "$regex": search,
                    "$options": "i"
                }
            },
            {
                "kategori": {
                    "$regex": search,
                    "$options": "i"
                }
            }
        ]

    if tanggal:
        try:
            tgl = datetime.strptime(tanggal, "%Y-%m-%d")
            start = datetime.combine(tgl.date(), datetime.min.time())
            end = start + timedelta(days=1)

            query["tanggal"] = {"$gte": start, "$lt": end}
        except ValueError:
            pass

    if bulan and tahun:
        query["month_year"] = f"{tahun}-{int(bulan):02d}"
    elif tahun:
        query["month_year"] = {"$regex": f"^{tahun}-"}
    elif bulan:
        query["month_year"] = {"$regex": f"-{int(bulan):02d}$"}

    return query


async def get_transaksi(
    db,
    page=1,
    limit=10,
    search=None,
    tanggal=None,
    bulan=None,
    tahun=None
):
    query = build_transaksi_query(
        search=search,
        tanggal=tanggal,
        bulan=bulan,
        tahun=tahun
    )

    skip = (page - 1) * limit

    total = await db.transaksi.count_documents(query)

    items = await (
        db.transaksi
        .find(query)
        .sort("tanggal", -1)
        .skip(skip)
        .limit(limit)
        .to_list(length=limit)
    )

    for item in items:
        item["id"] = str(item["_id"])
        del item["_id"]

    return {
        "success": True,
        "data": items,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": math.ceil(total / limit) if limit else 0
    }


async def get_transaksi_summary(
    db,
    search=None,
    tanggal=None,
    bulan=None,
    tahun=None
):
    query = build_transaksi_query(
        search=search,
        tanggal=tanggal,
        bulan=bulan,
        tahun=tahun
    )

    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": "$flow",
                "total": {"$sum": "$net_amount"}
            }
        }
    ]

    result = await db.transaksi.aggregate(pipeline).to_list(length=None)

    income = 0
    expense = 0

    for row in result:
        if row["_id"] == "Income":
            income = row["total"]
        elif row["_id"] == "Expense":
            expense = row["total"]

    return {
        "income": income,
        "expense": expense,
        "profit": income - expense
    }