import cloudinary.uploader
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
from slugify import slugify
from fastapi import APIRouter, Form, HTTPException, Request, Depends
from starlette.datastructures import UploadFile as StarletteUploadFile

from app.database.collections import product_collection
from app.core.security import get_current_user
from app.services.audit_service import create_audit_log
from app.utils.cloudinary_helper import delete_cloudinary_asset

router = APIRouter(
    prefix="/api/admin",
    tags=["Products Admin Hub"]
)

PLACEHOLDER_IMAGE = "https://res.cloudinary.com/ddxplesul/image/upload/v1778695884/placeholder.jpg"


# =========================================================
# 🔧 HELPERS
# =========================================================

def parse_price(price_value: str) -> float:
    try:
        cleaned = str(price_value).replace(",", "").strip()
        return float(cleaned) if cleaned else 0.0
    except Exception:
        raise HTTPException(status_code=400, detail="Format harga tidak valid.")


def parse_discount_flag(value) -> bool:
    if isinstance(value, str):
        return value.lower() == "true"
    return bool(value)


async def generate_unique_slug(name: str, exclude_id: Optional[ObjectId] = None) -> str:
    """
    Buat slug dari nama produk.
    Kalau sudah ada di DB (dan bukan milik produk yang sedang diedit),
    tambahkan suffix timestamp agar tetap unik.
    """
    base_slug = generate_custom_slug(name)
    query = {"slug": base_slug}
    if exclude_id:
        query["_id"] = {"$ne": exclude_id}

    existing = await product_collection.find_one(query)
    if existing:
        return f"{base_slug}-{datetime.now(timezone.utc).strftime('%H%M%S')}"
    return base_slug


async def process_image_uploads(form_data) -> list[str]:
    """
    Proses semua gambar dari form: bisa dari key image0/image1/...,
    key 'images' (multiple files), atau key 'existing_urls' (URL lama).
    Mengembalikan list URL final yang sudah bersih.
    """
    image_urls = []

    # Proses key image0, image1, image2, ...
    index = 0
    while f"image{index}" in form_data:
        file_asset = form_data[f"image{index}"]
        if isinstance(file_asset, StarletteUploadFile) and file_asset.filename:
            try:
                file_bytes = await file_asset.read()
                upload_result = cloudinary.uploader.upload(file_bytes, folder="kalren_products")
                image_urls.append(upload_result.get("secure_url"))
            except Exception as ce:
                raise HTTPException(status_code=500, detail=f"Cloudinary upload error: {str(ce)}")
        elif isinstance(file_asset, str) and file_asset.strip() and not file_asset.startswith("[object"):
            image_urls.append(file_asset.strip())
        index += 1

    # Proses key 'images' (multiple files)
    if "images" in form_data:
        for file_asset in form_data.getlist("images"):
            if isinstance(file_asset, StarletteUploadFile) and file_asset.filename:
                try:
                    file_bytes = await file_asset.read()
                    upload_result = cloudinary.uploader.upload(file_bytes, folder="kalren_products")
                    image_urls.append(upload_result.get("secure_url"))
                except Exception as ce:
                    raise HTTPException(status_code=500, detail=f"Cloudinary upload error: {str(ce)}")
            elif isinstance(file_asset, str) and file_asset.strip() and not file_asset.startswith("[object"):
                image_urls.append(file_asset.strip())

    # Proses key 'existing_urls' (URL lama yang dipertahankan dari frontend)
    if "existing_urls" in form_data:
        for url in form_data.getlist("existing_urls"):
            if isinstance(url, str) and url.strip() and url.strip() not in image_urls:
                image_urls.append(url.strip())

    return image_urls


def normalize_product(product: dict) -> dict:
    """
    Normalisasi dokumen produk dari MongoDB agar selalu konsisten
    dengan skema terbaru. Kompatibel dengan data lama (title/category/images).
    """
    product["_id"] = str(product["_id"])

    # Fallback field lama → field baru
    product["name"] = product.get("name") or product.get("title", "")
    product.setdefault("slug", "")
    product["series"] = product.get("series") or product.get("category", "")
    product.setdefault("color", "black")
    product.setdefault("compare_price", None)
    product.setdefault("is_discount", False)
    product.setdefault("available_sizes", [])
    product.setdefault("is_active", True)

    if not product.get("links"):
        product["links"] = {"shopee": "", "tiktok": ""}

    if not product.get("image_urls"):
        product["image_urls"] = product.get("images", [])

    return product


def generate_custom_slug(value: str) -> str:
    return slugify(
        value.strip(),
        lowercase=True,
        separator="-"
    )[:80]


# =========================================================
# 🔍 1. GET ALL PRODUCTS (ADMIN — termasuk draft)
# =========================================================

@router.get("/list")
async def get_all_products_admin():
    try:
        cursor = product_collection.find({"is_deleted": {"$ne": True}})
        products = await cursor.to_list(length=100)
        return [normalize_product(p) for p in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# =========================================================
# 🌐 2. GET ALL PRODUCTS (PUBLIK — hanya status 'live' & is_active)
# =========================================================

@router.get("/public/list")
async def get_public_products():
    try:
        cursor = product_collection.find({
            "is_deleted": {"$ne": True},
            "is_active": True,
            "status": "live"
        })
        products = await cursor.to_list(length=100)
        return [normalize_product(p) for p in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# =========================================================
# 🔍 3. GET PRODUCT DETAIL BY ID
# =========================================================

@router.get("/detail/{product_id}")
async def get_product_detail(product_id: str):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID tidak valid.")

        product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")

        return normalize_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# 🔍 4. GET PRODUCT DETAIL BY SLUG (untuk halaman publik)
# =========================================================

@router.get("/detail-by-slug/{slug}")
async def get_product_by_slug(slug: str):
    try:
        product = await product_collection.find_one({"slug": slug})
        if not product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")

        return normalize_product(product)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# 🚀 5. CREATE / ADD NEW PRODUCT
# =========================================================

@router.post("/add-product")
async def create_product(
    request: Request,
    name: str = Form(...),
    slug: Optional[str] = Form(None),
    series: str = Form("KALREN"),
    description: Optional[str] = Form(""),
    color: Optional[str] = Form("black"),
    material: Optional[str] = Form(""),
    fit: Optional[str] = Form("Regular Fit"),
    available_sizes: Optional[str] = Form(""),
    price_actual: str = Form(...),
    price_strike: Optional[str] = Form(None),
    shopee_link: Optional[str] = Form(""),
    tiktok_link: Optional[str] = Form(""),
    is_discount: Optional[str] = Form("false"),
    status: Optional[str] = Form("draft"),
    current_user: dict = Depends(get_current_user)
):
    try:
        if not name.strip():
            raise HTTPException(status_code=400, detail="Nama produk wajib diisi.")

        real_price = parse_price(price_actual)
        discount_enabled = parse_discount_flag(is_discount)

        strike_price = None
        if discount_enabled and price_strike and price_strike.strip():
            strike_price = parse_price(price_strike)
            if strike_price <= real_price:
                raise HTTPException(
                    status_code=400,
                    detail="Harga coret harus lebih besar dari harga jual."
                )

        # Slug unik — fallback ke timestamp jika nama sudah dipakai
        if slug and slug.strip():
            final_slug = generate_custom_slug(slug)
            existing = await product_collection.find_one({"slug": final_slug})
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Slug sudah digunakan produk lain."
                )
        else:
            final_slug = await generate_unique_slug(name)

        form_data = await request.form()
        image_urls = await process_image_uploads(form_data)
        sizes = [s.strip() for s in available_sizes.split(",") if s.strip()] if available_sizes else []

        payload = {
            "name": name.strip(),
            "slug": final_slug,
            "series": series,
            "description": description.strip() if description else "",
            "status": status,
            "color": color.strip() if color else "black",
            "price": real_price,
            "compare_price": strike_price,
            "is_discount": discount_enabled,
            "material": material.strip() if material else "",
            "fit": fit,
            "available_sizes": sizes,
            "links": {
                "shopee": shopee_link.strip() if shopee_link else "",
                "tiktok": tiktok_link.strip() if tiktok_link else ""
            },
            "image_urls": image_urls or [PLACEHOLDER_IMAGE],
            "is_active": True,
            "is_deleted": False,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

        await product_collection.insert_one(payload)

        await create_audit_log(
            current_user=current_user,
            action="ADD PRODUCT",
            target=name,
            detail=f"Menambahkan produk seri {series} baru ke katalog. Status: {status}."
        )

        return {"success": True, "message": "Product created successfully."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses produk: {str(e)}")


# =========================================================
# 📝 6. UPDATE / EDIT PRODUCT
# =========================================================

@router.put("/edit-product/{product_id}")
async def update_product_admin(
    product_id: str,
    request: Request,
    name: str = Form(...),
    slug: Optional[str] = Form(None),
    series: Optional[str] = Form("KALREN"),
    description: Optional[str] = Form(""),
    color: Optional[str] = Form("black"),
    material: Optional[str] = Form(""),
    fit: Optional[str] = Form("Regular Fit"),
    available_sizes: Optional[str] = Form(""),
    price_actual: str = Form(...),
    price_strike: Optional[str] = Form(None),
    shopee_link: Optional[str] = Form(""),
    tiktok_link: Optional[str] = Form(""),
    is_discount: Optional[str] = Form("false"),
    status: Optional[str] = Form("draft"),
    current_user: dict = Depends(get_current_user)
):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID produk tidak valid.")

        old_product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not old_product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")

        real_price = parse_price(price_actual)
        discount_enabled = parse_discount_flag(is_discount)

        strike_price = None
        if discount_enabled and price_strike and price_strike.strip():
            strike_price = parse_price(price_strike)
            if strike_price <= real_price:
                raise HTTPException(
                    status_code=400,
                    detail="Harga coret harus lebih besar dari harga jual."
                )

        # Slug unik — kecualikan dokumen diri sendiri saat cek duplikat
        if slug and slug.strip():
            final_slug = generate_custom_slug(slug)
            existing = await product_collection.find_one({
                "slug": final_slug,
                "_id": {"$ne": ObjectId(product_id)}
            })
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Slug sudah digunakan produk lain."
                )
        else:
            final_slug = await generate_unique_slug(
                name,
                exclude_id=ObjectId(product_id)
            )

        form_data = await request.form()
        image_urls = await process_image_uploads(form_data)
        sizes = [s.strip() for s in available_sizes.split(",") if s.strip()] if available_sizes else []

        # Hapus gambar lama dari Cloudinary yang tidak dipakai lagi
        old_image_urls = old_product.get("image_urls", [])
        deleted_images = [url for url in old_image_urls if url not in image_urls]
        for url in deleted_images:
            delete_cloudinary_asset(url)

        # Two-stage MongoDB update: bersihkan dulu, lalu isi baru
        await product_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"image_urls": []}}
        )

        update_payload = {
            "name": name.strip(),
            "slug": final_slug,
            "series": series,
            "description": description.strip() if description else "",
            "color": color.strip() if color else "black",
            "price": real_price,
            "compare_price": strike_price,
            "is_discount": discount_enabled,
            "material": material.strip() if material else "",
            "fit": fit,
            "available_sizes": sizes,
            "links": {
                "shopee": shopee_link.strip() if shopee_link else "",
                "tiktok": tiktok_link.strip() if tiktok_link else ""
            },
            "image_urls": image_urls,
            "status": status,
            "updated_at": datetime.now(timezone.utc)
        }

        await product_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_payload}
        )

        await create_audit_log(
            current_user=current_user,
            action="EDIT PRODUCT",
            target=name,
            detail=(
                f"Memperbarui produk '{name}'. "
                f"Menghapus {len(deleted_images)} foto lama dari Cloudinary."
            )
        )

        return {"success": True, "message": "Product updated successfully."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# 🗑️ 7. ARCHIVE PRODUCT (soft delete)
# =========================================================

@router.delete("/delete-product/{product_id}")
async def delete_product_admin(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID tidak valid.")

        product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")

        await product_collection.update_one(
            {"_id": ObjectId(product_id)},
            {
                "$set": {
                    "is_deleted": True,
                    "status": "archived",
                    "deleted_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )

        await create_audit_log(
            current_user=current_user,
            action="ARCHIVE PRODUCT",
            target=product.get("name", "Unknown"),
            detail="Produk dipindahkan ke arsip."
        )

        return {"success": True, "message": "Produk berhasil diarsipkan."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# ♻️ 8. RESTORE PRODUCT
# =========================================================

@router.put("/restore-product/{product_id}")
async def restore_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID tidak valid.")

        product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")

        await product_collection.update_one(
            {"_id": ObjectId(product_id)},
            {
                "$set": {
                    "is_deleted": False,
                    "status": "draft",  # draft dulu, bukan langsung live
                    "updated_at": datetime.now(timezone.utc)
                },
                "$unset": {
                    "deleted_at": ""
                }
            }
        )

        await create_audit_log(
            current_user=current_user,
            action="RESTORE PRODUCT",
            target=product.get("name", "Unknown"),
            detail="Produk dipulihkan dari arsip."
        )

        return {"success": True, "message": "Produk berhasil dipulihkan."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# 📦 9. GET ARCHIVED PRODUCTS
# =========================================================

@router.get("/archived-products")
async def get_archived_products():
    try:
        cursor = product_collection.find({"is_deleted": True}).sort("deleted_at", -1)
        products = await cursor.to_list(length=100)
        return [normalize_product(p) for p in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# ☠️ 10. PERMANENT DELETE PRODUCT
# =========================================================

@router.delete("/permanent-delete/{product_id}")
async def permanent_delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID tidak valid.")

        product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")

        image_urls = product.get("image_urls", [])
        deleted_images = 0
        for url in image_urls:
            try:
                delete_cloudinary_asset(url)
                deleted_images += 1
            except Exception as err:
                print("Cloudinary delete error:", err)

        await product_collection.delete_one({"_id": ObjectId(product_id)})

        await create_audit_log(
            current_user=current_user,
            action="PERMANENT DELETE PRODUCT",
            target=product.get("name", "Unknown"),
            detail=f"{deleted_images} gambar Cloudinary ikut dihapus."
        )

        return {"success": True, "message": "Produk berhasil dihapus permanen."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))