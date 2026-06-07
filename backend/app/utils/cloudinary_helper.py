import cloudinary.uploader
from typing import Optional

def extract_cloudinary_public_id(url: str) -> Optional[str]:
    """
    Engine Ekstraktor Khusus untuk memotong URL secure Cloudinary 
    menjadi public_id utuh (termasuk nama foldernya) Bal.
    """
    try:
        if "upload/" not in url:
            return url.split("/")[-1].split(".")[0]

        right_part = url.split("upload/")[1]
        sub_parts = right_part.split("/", 1)

        # Kebal dari string folder versioning otomatis (v1234567/)
        if (
            len(sub_parts) > 1
            and sub_parts[0].startswith("v")
            and sub_parts[0][1:].isdigit()
        ):
            path_with_ext = sub_parts[1]
        else:
            path_with_ext = right_part

        return path_with_ext.rsplit(".", 1)[0]
    except Exception:
        return None

def delete_cloudinary_asset(url: str) -> bool:
    if not url or "cloudinary.com" not in url:
        return False
        
    public_id = extract_cloudinary_public_id(url)
    if public_id:
        try:
            result = cloudinary.uploader.destroy(public_id, invalidate=True)
            res_status = result.get("result")
            
            # ✅ FIX: Anggap 'not found' sebagai sukses, karena file sudah tidak ada (target tercapai)
            if res_status in ["ok", "not found"]:
                print(f"🔥 Cloudinary Clean: [{public_id}] - {res_status}")
                return True
            else:
                print(f"⚠️ Cloudinary Warning: [{public_id}] - {res_status}")
                return False
        except Exception as e:
            print(f"❌ Gagal total menghapus asset Cloudinary [{public_id}]: {str(e)}")
            return False
    return False