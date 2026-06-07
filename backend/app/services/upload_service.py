import cloudinary.uploader

async def upload_image_to_cloudinary(
    file_path,
    folder="kalren_products"
):

    result = cloudinary.uploader.upload(
        file_path,
        folder=folder,
        use_filename=True,
        unique_filename=True,
        resource_type="auto"
    )

    return result.get("secure_url")