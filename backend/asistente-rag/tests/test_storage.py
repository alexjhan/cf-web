import pytest
from fastapi.testclient import TestClient
from rag_api.main import app
import os

client = TestClient(app)

ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'devtoken')

headers = {"X-Admin-Token": ADMIN_TOKEN}

def test_storage_crud_cycle():
    # create
    r = client.post('/storage', json={"tipo":"faq","data":{"q":"hola","a":"mundo"}}, headers=headers)
    if r.status_code == 401:
        pytest.skip('Admin token mismatch for test environment')
    assert r.status_code == 200
    item = r.json()
    iid = item['id']
    # get
    r = client.get(f'/storage/{iid}')
    assert r.status_code == 200
    # update
    r = client.put(f'/storage/{iid}', json={"tipo":"faq","data":{"q":"hola","a":"metal"}}, headers=headers)
    assert r.status_code == 200
    # delete
    r = client.delete(f'/storage/{iid}', headers=headers)
    assert r.status_code == 200
