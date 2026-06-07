import os
from datetime import datetime
from typing import Optional
from bson import ObjectId
from slugify import slugify
from fastapi import APIRouter, Form, File, UploadFile, HTTPException, status, Request, Depends
from starlette.datastructures import UploadFile as StarletteUploadFile

from app.database.collections import product_collection
from app.core.security import get_current_user
from app.services.audit_service import create_audit_log  # 🚀 Global Audit Log Pipeline
# 🎯 IMPORT UTALITAS HELPER SAKRAL BARU LU BAL!
from app.utils.cloudinary_helper import delete_cloudinary_asset

router = APIRouter(
    prefix="/api/admin",
    tags=["Products Admin Hub"]
)

def parse_price(price_value: str) -> float:
    try:
        cleaned = str(price_value).replace(",", "").strip()
        return float(cleaned) if cleaned else 0.0
    except Exception:
        raise HTTPException(status_code=400, detail="Format harga tidak valid, Bal!")

# =========================================================
# 🔍 1. GET ALL PRODUCTS (FIX SAFE FROM ROUTING COLLISION)
# =========================================================
@router.get("/list") 
async def get_all_products_admin():
    try:
        # Cukup tarik dokumen yang valid (mengabaikan dokumen sampah/kosong di Atlas)
        cursor = product_collection.find({
            "$or": [
                {"name": {"$exists": True}}, 
                {"title": {"$exists": True}}
            ]
        }) 
        products = await cursor.to_list(length=100)
        
        cleaned_products = []
        for product in products:
            try:
                product["_id"] = str(product["_id"])
                
                # Normalisasi struktur dictionary agar frontend gak eror pembacaan key
                if "links" not in product or not product["links"]:
                    product["links"] = {"shopee": "", "tiktok": ""}
                if "image_urls" not in product:
                    product["image_urls"] = product.get("images", [])
                    
                cleaned_products.append(product)
            except Exception as item_err:
                print(f"Warning: Skip dokumen produk bermasalah: {item_err}")
                continue
                
        return cleaned_products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database pipeline crash, Bal: {str(e)}")

# =========================================================
# 🚀 2. CREATE / ADD NEW PRODUCT (OTOMATIS AUDIT LOG)
# =========================================================
@router.post("/add-product")
async def create_product(
    request: Request,
    name: str = Form(...),
    fit: Optional[str] = Form("Regular Fit"),
    series: Optional[str] = Form("KALREN"),
    price_actual: str = Form(...),
    price_strike: Optional[str] = Form(None),
    material: Optional[str] = Form(""),
    description: Optional[str] = Form(""),
    available_sizes: Optional[str] = Form(""),
    shopee_link: Optional[str] = Form(""),
    tiktok_link: Optional[str] = Form(""),
    is_discount: Optional[str] = Form("false"),
    current_user: dict = Depends(get_current_user)
):
    try:
        real_price = parse_price(price_actual)
        discount_enabled = is_discount.lower() == "true" if is_discount else False
        strike_price = None

        if discount_enabled and price_strike and price_strike.strip():
            strike_price = parse_price(price_strike)
            if strike_price <= real_price:
                raise HTTPException(status_code=400, detail="Harga coret harus lebih besar dari harga jual!")

        if not name.strip():
            raise HTTPException(status_code=400, detail="Nama produk wajib diisi!")

        form_data = await request.form()
        image_urls = []
        
        index = 0
        while f"image{index}" in form_data:
            file_asset = form_data[f"image{index}"]
            if isinstance(file_asset, StarletteUploadFile) and file_asset.filename:
                import cloudinary.uploader
                try:
                    file_bytes = await file_asset.read()
                    upload_result = cloudinary.uploader.upload(file_bytes, folder="kalren_products")
                    image_urls.append(upload_result.get("secure_url"))
                except Exception as ce:
                    raise HTTPException(status_code=500, detail=f"Cloudinary Error: {str(ce)}")
            elif isinstance(file_asset, str) and file_asset.strip() and not file_asset.startswith("[object"):
                image_urls.append(file_asset)
            index += 1

        if "images" in form_data:
            assets = form_data.getlist("images")
            for file_asset in assets:
                if isinstance(file_asset, StarletteUploadFile) and file_asset.filename:
                    import cloudinary.uploader
                    file_bytes = await file_asset.read()
                    upload_result = cloudinary.uploader.upload(file_bytes, folder="kalren_products")
                    image_urls.append(upload_result.get("secure_url"))

        sizes = [s.strip() for s in available_sizes.split(",") if s.strip()] if available_sizes else []

        payload = {
            "name": name.strip(),
            "slug": slugify(name),
            "series": series,
            "fit": fit,
            "color": "black",
            "price": real_price,
            "compare_price": strike_price,
            "is_discount": discount_enabled,
            "material": material.strip() if material else "",
            "description": description.strip() if description else "",
            "available_sizes": sizes,
            "links": {
                "shopee": shopee_link.strip() if shopee_link else "",
                "tiktok": tiktok_link.strip() if tiktok_link else ""
            },
            "image_urls": image_urls or ["https://res.cloudinary.com/ddxplesul/image/upload/v1778695884/placeholder.jpg"],
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await product_collection.insert_one(payload)
        
        await create_audit_log(
            current_user=current_user,
            action="ADD PRODUCT",
            target=name,
            detail=f"Berhasil mengarsipkan pakaian seri {series} baru ke dalam database katalog utama."
        )

        return {"success": True, "message": "Product created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses produk Bal: {str(e)}")

# =========================================================
# 📝 3. UPDATE / EDIT PRODUCT (TWO-STAGE MONGO RE-CLEAN ENGINE)
# =========================================================
@router.put("/edit-product/{product_id}")
async def update_product_admin(
    product_id: str,
    request: Request,
    name: str = Form(...),
    fit: Optional[str] = Form("Regular Fit"),
    series: Optional[str] = Form("KALREN"),
    price_actual: str = Form(...),
    price_strike: Optional[str] = Form(None),
    material: Optional[str] = Form(""),
    description: Optional[str] = Form(""),
    available_sizes: Optional[str] = Form(""),
    shopee_link: Optional[str] = Form(""),
    tiktok_link: Optional[str] = Form(""),
    is_discount: Optional[str] = Form("false"),
    current_user: dict = Depends(get_current_user)
):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID produk tidak valid")
            
        real_price = parse_price(price_actual)
        discount_enabled = is_discount.lower() == "true" if is_discount else False
        strike_price = None

        if discount_enabled and price_strike and price_strike.strip():
            strike_price = parse_price(price_strike)
            if strike_price <= real_price:
                raise HTTPException(status_code=400, detail="Harga coret harus lebih besar dari harga jual!")

        # STEP 1: TARIK DATA PRODUK LAMA DARI ATLAS
        old_product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not old_product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
        
        old_image_urls = old_product.get("image_urls", [])

        form_data = await request.form()
        image_urls = []
        
        # Deteksi form biner & string array sequence hasil drag-drop di frontend
        index = 0
        while f"image{index}" in form_data:
            file_asset = form_data[f"image{index}"]
            if isinstance(file_asset, StarletteUploadFile) and file_asset.filename:
                import cloudinary.uploader
                try:
                    file_bytes = await file_asset.read()
                    upload_result = cloudinary.uploader.upload(file_bytes, folder="kalren_products")
                    image_urls.append(upload_result.get("secure_url"))
                except Exception as ce:
                    raise HTTPException(status_code=500, detail=f"Cloudinary Error: {str(ce)}")
            elif isinstance(file_asset, str) and file_asset.strip() and not file_asset.startswith("[object"):
                image_urls.append(file_asset)
            index += 1

        if "images" in form_data:
            assets = form_data.getlist("images")
            for file_asset in assets:
                if isinstance(file_asset, StarletteUploadFile) and file_asset.filename:
                    import cloudinary.uploader
                    file_bytes = await file_asset.read()
                    upload_result = cloudinary.uploader.upload(file_bytes, folder="kalren_products")
                    image_urls.append(upload_result.get("secure_url"))
                elif isinstance(file_asset, str) and file_asset.strip() and not file_asset.startswith("[object"):
                    image_urls.append(file_asset)

        # 🎯 JIKA FRONTEND MENGIRIM VIA KEY TERPISAH 'existing_urls'
        if "existing_urls" in form_data:
            existing_list = form_data.getlist("existing_urls")
            for url_path in existing_list:
                if isinstance(url_path, str) and url_path.strip() and url_path not in image_urls:
                    image_urls.append(url_path)

        sizes = [s.strip() for s in available_sizes.split(",") if s.strip()] if available_sizes else []

        # STEP 2: KOMPARASI DATA FOTO LAMA VS BARU & BANTAI DI SERVER CLOUDINARY
        deleted_images = [url for url in old_image_urls if url not in image_urls]

        for url in deleted_images:
            # PANGGIL HELPER BARU LU, BAL! JALUR PIPELINENYA LEBIH STERIL & AKURAT
            delete_cloudinary_asset(url)

        # 🚀 STEP 3: MONGODB RE-CLEAN PIPELINE (Hapus array, lalu tiban baru)
        # 1. Bersihkan field array lama menjadi [] kosong agar memori Mongo Atlas bersih total
        await product_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"image_urls": []}}
        )

        # 2. Suntik payload data spesifikasi final artikel yang steril bebas duplikasi link hantu
        update_payload = {
            "name": name.strip(),
            "slug": slugify(name),
            "series": series,
            "fit": fit,
            "price": real_price,
            "compare_price": strike_price,
            "is_discount": discount_enabled,
            "material": material.strip() if material else "",
            "description": description.strip() if description else "",
            "available_sizes": sizes,
            "image_urls": image_urls,
            "links": {
                "shopee": shopee_link.strip() if shopee_link else "",
                "tiktok": tiktok_link.strip() if tiktok_link else ""
            },
            "updated_at": datetime.utcnow()
        }

        await product_collection.update_one(
            {"_id": ObjectId(product_id)}, 
            {"$set": update_payload}
        )

        await create_audit_log(
            current_user=current_user,
            action="EDIT PRODUCT",
            target=name,
            detail=f"Berhasil memperbarui data artikel {name} sekaligus membersihkan {len(deleted_images)} file foto lama dari Cloudinary."
        )

        return {"success": True, "message": "Product updated successfully and trash images cleaned"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================================
# 🔍 4. GET PRODUCT DETAIL BY ID (PATH DIUBAH AGAR GAK BENTROK SAMA /LIST)
# =========================================================
@router.get("/detail/{product_id}")
async def get_product_detail(product_id: str):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID tidak valid, Bal!")
            
        product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
            
        product["_id"] = str(product["_id"])
        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================================
# 🗑️ 5. DELETE PRODUCT TOTAL (REAL CLOUD WIPEOUT)
# =========================================================
@router.delete("/delete-product/{product_id}")
async def delete_product_admin(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID tidak valid")
            
        product = await product_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
            
        image_urls = product.get("image_urls", [])
        for url in image_urls:
            # PANGGIL HELPER BARU LU PAS APES DIHAPUS TOTAL UTUH OLEH OWNER Bal!
            delete_cloudinary_asset(url)

        await product_collection.delete_one({"_id": ObjectId(product_id)})
        
        await create_audit_log(
            current_user=current_user,
            action="DELETE PRODUCT",
            target=product.get('name', 'Unknown'),
            detail="Berhasil menghapus produk total dari katalog beserta membersihkan asset gambarnya dari Cloudinary."
        )
        
        return {"success": True, "message": "Produk berhasil dihapus total!"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal eksekusi hapus total: {str(e)}")