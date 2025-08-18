"""Router de oportunidades (Opción A: directo al store, sin repository ni modelos separados)."""
from __future__ import annotations
from fastapi import APIRouter, HTTPException, Request
from ..stores import oportunidades_store
from ..core.security import check_admin
from pydantic import BaseModel

router = APIRouter(prefix="/oportunidades", tags=["oportunidades"])

class OportunidadIn(BaseModel):
    id: str | None = None
    titulo: str
    descripcion: str
    tipo: str  # beca|practica|concurso|otro
    fecha_publicacion: str
    fecha_cierre: str | None = None
    fuente: str | None = None
    enlace: str | None = None
    estado: str | None = None

@router.get("")
def list_oportunidades(q: str | None = None, tipo: str | None = None, estado: str | None = None,
                       abierta: bool | None = None, page: int = 1, page_size: int = 10):
    if any([q, tipo, estado, abierta is not None, page != 1, page_size != 10]):
        return oportunidades_store.search(q=q, tipo=tipo, estado=estado, abierta=abierta, page=page, page_size=page_size)
    return oportunidades_store.list_all()

@router.get("/{oid}")
def get_oportunidad(oid: str):
    item = oportunidades_store.get_one(oid)
    if not item:
        raise HTTPException(status_code=404, detail='Oportunidad no encontrada')
    return item

@router.post("")
def create_oportunidad(item: OportunidadIn, request: Request):
    check_admin(request)
    try:
        return oportunidades_store.upsert(item.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{oid}")
def update_oportunidad(oid: str, item: OportunidadIn, request: Request):
    check_admin(request)
    data = item.dict()
    if not data.get('id'):
        data['id'] = oid
    existing = oportunidades_store.get_one(data['id'])
    if not existing:
        raise HTTPException(status_code=404, detail='Oportunidad no encontrada')
    return oportunidades_store.upsert(data)

@router.delete("/{oid}")
def delete_oportunidad(oid: str, request: Request):
    check_admin(request)
    ok = oportunidades_store.delete(oid)
    if not ok:
        raise HTTPException(status_code=404, detail='Oportunidad no encontrada')
    return {"status": "deleted", "id": oid}
