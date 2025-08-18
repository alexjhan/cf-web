"""Router de storage genérico (data_items) Opción A (usa store directo)."""
from __future__ import annotations
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from ..stores import storage_store
from ..core.security import check_admin

router = APIRouter(prefix="/storage", tags=["storage"])

class GenericItemIn(BaseModel):
    tipo: str
    data: dict
    id: str | None = None

@router.post("")
def create_generic(item: GenericItemIn, request: Request):
    check_admin(request)
    created = storage_store.create_item(item.tipo, item.data, item.id)
    return created

@router.get("/{item_id}")
def get_generic(item_id: str):
    obj = storage_store.get_item(item_id)
    if not obj:
        raise HTTPException(status_code=404, detail='Item no encontrado')
    return obj

@router.put("/{item_id}")
def update_generic(item_id: str, item: GenericItemIn, request: Request):
    check_admin(request)
    upd = storage_store.update_item(item_id, item.data)
    if not upd:
        raise HTTPException(status_code=404, detail='Item no encontrado')
    return upd

@router.delete("/{item_id}")
def delete_generic(item_id: str, request: Request):
    check_admin(request)
    ok = storage_store.delete_item(item_id)
    if not ok:
        raise HTTPException(status_code=404, detail='Item no encontrado')
    return {"status": "deleted", "id": item_id}

@router.get("")
def search_generic(tipo: str | None = None, q: str | None = None, page: int = 1, page_size: int = 20):
    return storage_store.search_items(tipo=tipo, q=q, page=page, page_size=page_size)
