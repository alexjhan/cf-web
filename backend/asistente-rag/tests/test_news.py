import pytest
from fastapi.testclient import TestClient
from rag_api.main import app

client = TestClient(app)

def test_list_news_ok():
    r = client.get('/news')
    assert r.status_code == 200
    data = r.json()
    assert 'items' in data and isinstance(data['items'], list)


def test_create_news_requires_admin():
    payload = {
        "fecha": "2025-08-01",
        "titulo": "Prueba",
        "descripcionCorta": "corta",
        "descripcionLarga": "larga",
        "autor": "yo",
        "categoria": ["Test"]
    }
    r = client.post('/news', json=payload)
    assert r.status_code in (401,403)
