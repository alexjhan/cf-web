"""Repositorio de noticias.

Funciona como adaptador entre:
  - store (dicts crudos)
  - modelos Pydantic (NewsIn/NewsOut)
Así routers trabajan con objetos validados y si mañana cambiamos el store no tocamos routers.
"""
from __future__ import annotations  # Tipos adelantados.
from typing import Optional, List  # Tipos.
from ..stores import news_store  # Acceso a la capa de datos.
from ..models.news import NewsIn, NewsOut, NewsSearchResult  # Modelos de entrada/salida.

def list_all() -> List[NewsOut]:  # Devuelve todas las noticias como objetos Pydantic.
    return [NewsOut(**n) for n in news_store.list_news()]

def search(q: str | None = None, categoria: str | None = None, destacada: bool | None = None,
           page: int = 1, page_size: int = 10) -> NewsSearchResult:  # Búsqueda con filtros.
    data = news_store.search_news(q=q, categoria=categoria, destacada=destacada, page=page, page_size=page_size)
    return NewsSearchResult(
        items=[NewsOut(**n) for n in data["items"]],  # Convertimos cada dict a NewsOut.
        total=data["total"],  # Copiamos metadatos de paginación.
        page=data["page"],
        page_size=data["page_size"],
    )

def get_one(nid: str) -> Optional[NewsOut]:  # Una sola noticia o None si no existe.
    n = news_store.get_news(nid)
    return NewsOut(**n) if n else None

def increment_views(nid: str) -> Optional[NewsOut]:  # Aumenta vistas y devuelve objeto actualizado.
    n = news_store.increment_views(nid)
    return NewsOut(**n) if n else None

def upsert(item: NewsIn) -> NewsOut:  # Crea o actualiza noticia desde modelo de entrada.
    stored = news_store.upsert_news(item.dict())  # dict() -> convierte Pydantic a dict simple.
    return NewsOut(**stored)

def delete(nid: str) -> bool:  # Elimina noticia.
    return news_store.delete_news(nid)
