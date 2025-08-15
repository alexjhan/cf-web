from __future__ import annotations
from fastapi import APIRouter, HTTPException, Request
from ..models.news import NewsIn, NewsOut, NewsSearchResult
from ..repositories import news_repository as repo
from ..main import _check_admin  # reuse admin check

router = APIRouter(prefix="/news", tags=["news"])

@router.get("", response_model=list[NewsOut] | NewsSearchResult)
def list_news(q: str | None = None, categoria: str | None = None, destacada: bool | None = None,
              page: int = 1, page_size: int = 10):
    if any([q, categoria, destacada is not None, page != 1, page_size != 10]):
        return repo.search(q=q, categoria=categoria, destacada=destacada, page=page, page_size=page_size)
    return repo.list_all()

@router.get("/{nid}", response_model=NewsOut)
def get_one(nid: str):
    n = repo.increment_views(nid)
    if not n:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return n

@router.post("", response_model=NewsOut)
def create(item: NewsIn, request: Request):
    _check_admin(request)
    try:
        return repo.upsert(item)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{nid}", response_model=NewsOut)
def update(nid: str, item: NewsIn, request: Request):
    _check_admin(request)
    data = item.copy(update={"id": item.id or nid})
    existing = repo.get_one(data.id)  # type: ignore
    if not existing:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return repo.upsert(data)  # type: ignore

@router.delete("/{nid}")
def delete(nid: str, request: Request):
    _check_admin(request)
    ok = repo.delete(nid)
    if not ok:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return {"status": "deleted", "id": nid}
