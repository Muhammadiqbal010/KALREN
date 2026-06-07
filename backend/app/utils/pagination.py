def pagination_response(
    data,
    total,
    page,
    limit
):

    return {
        "data": data,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (
                total + limit - 1
            ) // limit
        }
    }