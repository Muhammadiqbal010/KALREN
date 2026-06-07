import os
from dotenv import load_dotenv

load_dotenv()

# =========================================
# APP
# =========================================
SECRET_KEY = os.getenv("SECRET_KEY")

# =========================================
# DATABASE
# =========================================
MONGODB_URL = os.getenv("MONGODB_URL")

# =========================================
# CLOUDINARY
# =========================================
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")