from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field

class NewsBase(BaseModel):
    fecha: str = Field(..., description="Fecha ISO YYYY-MM-DD")
    titulo: str
    descripcionCorta: str
    descripcionLarga: str
    autor: str
    categoria: List[str]
    imagen: Optional[str] = None
    destacada: bool | None = False
    vistas: int | None = 0

class NewsIn(NewsBase):
    id: str | None = None

class NewsOut(NewsBase):
    id: str

class NewsSearchResult(BaseModel):
    items: list[NewsOut]
    total: int
    page: int
    page_size: int
