"""Conexión condicional a Postgres (Supabase) o fallback SQLite.
Uso:
  from .db import get_connection, is_postgres
  with get_connection() as conn:
      ... (psycopg connection si Postgres, o sqlite3 connection)

Esto permite migración gradual: si DATABASE_URL presente -> Postgres.
"""
from __future__ import annotations
import os, contextlib, sqlite3
from typing import Iterator, Any

DATABASE_URL = os.getenv("DATABASE_URL")  # Formato postgresql+psycopg://...
IS_POSTGRES = DATABASE_URL is not None and DATABASE_URL.startswith("postgres")

if IS_POSTGRES:
    import psycopg

@contextlib.contextmanager
def get_connection() -> Iterator[Any]:
    if IS_POSTGRES:
        # Quitar prefijo sqlalchemy si viene así
        url = DATABASE_URL.replace("+psycopg", "")  # psycopg acepta postgresql://
        with psycopg.connect(url) as conn:  # type: ignore
            yield conn
    else:
        # Fallback: single SQLite file (configurable)
        base_dir = os.path.dirname(__file__)
        path = os.environ.get("NEWS_DB_PATH", os.path.join(base_dir, "news.db"))
        conn = sqlite3.connect(path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

def is_postgres() -> bool:
    return IS_POSTGRES
