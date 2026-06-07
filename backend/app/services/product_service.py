import cloudinary.uploader
from slugify import slugify
from fastapi import HTTPException
from app.database.collections import product_collection
from app.models.product_model import product_model
from app.utils.validators import validate_compare_price

async def add_new_product(data: dict, images: list):
    """
    Membuat produk baru dengan upload gambar ke Cloudinary + auto slug (Sinkron DB Atlas)
    """
    # 1. Pastikan nama produk ada untuk generate matriks data Bal
    # Kita cek 'name' dulu, kalau ga ada ambil sisa properti 'title' dari frontend
    product_name = data.get("name") or data.get("title")
    if not product_name:
        raise HTTPException(status_code=400, detail="Name atau Title wajib diisi untuk kompilasi arsip")

    # 2. Validasi harga coret secara aman
    if data.get("compare_price") and str(data.get("compare_price")).strip() != "":
        validate_compare_price(float(data["price"]), float(data["compare_price"]))

    # 3. Auto generate slug dari nama artikel produk KALREN
    base_slug = slugify(product_name)
    data["slug"] = base_slug

    # 4. Upload images biner ke Cloudinary ddxplesul lo Bal (Berurutan sesuai drag drop)
    cloudinary_urls = []
    for img in images:
        try:
            # Baca file biner dari multipart form-data lo Bal
            file_bytes = await img.read()
            upload_result = cloudinary.uploader.upload(
                file_bytes,
                folder="kalren_products",
                transformation=[{"width": 1200, "crop": "limit"}], # Batasi ukuran biar cloud Atlas ga bengkak
                use_filename=True,
                unique_filename=True
            )
            # Ambil link secure_url aslinya dari Cloudinary lo Bal
            cloudinary_urls.append(upload_result.get("secure_url"))
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Gagal mengunggah asset gambar ke Cloudinary: {str(e)}"
            )

    # 5. MASUKKAN LINK ASLI KEDALAM KEY REPOSITORY YANG PAS BAL
    data["image_urls"] = cloudinary_urls

    # 6. Validasi & struktur data dengan model pembersih cache biner kita
    try:
        final_document = product_model(data)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Kompilasi struktur data model tidak valid Bal: {str(e)}")

    # 7. Simpan dokumen premium KALREN lo langsung ke MongoDB Atlas
    try:
        result = await product_collection.insert_one(final_document)
        return str(result.inserted_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyuntikkan data produk ke DB Atlas: {str(e)}")