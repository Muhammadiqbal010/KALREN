from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_get_products():

    response = client.get("/api/products")

    assert response.status_code == 200

def test_track_click():

    response = client.post(
        "/api/analytics/track",
        params={
            "product_id": "test123",
            "platform": "shopee"
        }
    )

    assert response.status_code == 200