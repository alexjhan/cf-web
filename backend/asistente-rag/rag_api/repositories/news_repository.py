"""Repositorio de noticias: capa intermedia entre rutas y almacenamiento.
Permite más adelante cambiar SQLite -> Postgres sin tocar routers.
"""
from __future__ import annotations
from typing import Optional, List
from .. import news_store
from ..models.news import NewsIn, NewsOut, NewsSearchResult

def list_all() -> List[NewsOut]:
    return [NewsOut(**n) for n in news_store.list_news()]

def search(q: str | None = None, categoria: str | None = None, destacada: bool | None = None,
           page: int = 1, page_size: int = 10) -> NewsSearchResult:
    data = news_store.search_news(q=q, categoria=categoria, destacada=destacada, page=page, page_size=page_size)
    return NewsSearchResult(
        items=[NewsOut(**n) for n in data["items"]],
        total=data["total"],
        page=data["page"],
        page_size=data["page_size"],
    )

def get_one(nid: str) -> Optional[NewsOut]:
    n = news_store.get_news(nid)
    return NewsOut(**n) if n else None

def increment_views(nid: str) -> Optional[NewsOut]:
    n = news_store.increment_views(nid)
    return NewsOut(**n) if n else None

def upsert(item: NewsIn) -> NewsOut:
    stored = news_store.upsert_news(item.dict())
    return NewsOut(**stored)

def delete(nid: str) -> bool:
    return news_store.delete_news(nid)
