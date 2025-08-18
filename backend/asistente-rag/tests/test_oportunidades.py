import pytest
from fastapi.testclient import TestClient
from rag_api.main import app
import os, time

client = TestClient(app)
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'devtoken')
headers = {"X-Admin-Token": ADMIN_TOKEN}

def test_oportunidades_list():
    r = client.get('/oportunidades')
    assert r.status_code == 200


def test_create_oportunidad_requires_admin():
    payload = {
        "titulo":"Beca X",
        "descripcion":"Desc",
        "tipo":"beca",
        "fecha_publicacion":"2025-08-01"
    }
    r = client.post('/oportunidades', json=payload)  # sin token
    assert r.status_code in (401,403)
