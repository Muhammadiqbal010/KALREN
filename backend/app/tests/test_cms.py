from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_get_cms():

    response = client.get("/api/cms")

    assert response.status_code == 200

def test_get_about_cms():

    response = client.get("/api/cms/about")

    assert response.status_code == 200