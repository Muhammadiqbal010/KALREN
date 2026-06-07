from fastapi import HTTPException

from app.core.constants import (
    MAX_FILE_SIZE,
    ALLOWED_IMAGE_TYPES
)

async def validate_image(file):

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="format gambar tidak didukung"
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="ukuran gambar terlalu besar"
        )

    await file.seek(0)

def validate_compare_price(
    price: int,
    compare_price: int | None
):

    if (
        compare_price
        and compare_price < price
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "compare_price harus "
                "lebih besar dari price"
            )
        )