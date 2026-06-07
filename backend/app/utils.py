import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Tambahin baris ini buat ngecek:
print("DEBUG CLOUD NAME:", os.getenv("CLOUDINARY_CLOUD_NAME"))
print("DEBUG API KEY:", os.getenv("CLOUDINARY_API_KEY"))

# Konfigurasi Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image_to_cloudinary(file_path, folder="kalren_products"):
    try:
        # Upload dengan optimasi otomatis
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            use_filename=True,
            unique_filename=True,
            resource_type="auto"
        )
        return result.get("secure_url") # Ini link yang bakal kita simpan di MongoDB
    except Exception as e:
        print(f"Error Cloudinary: {e}")
        return None