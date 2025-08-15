import json
import os
import threading
from datetime import datetime
from typing import List, Dict, Any, Optional

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, 'news.json')
_lock = threading.Lock()

import os
import json
import sqlite3
from datetime import datetime
from typing import List, Dict, Any, Optional
from contextlib import contextmanager
import threading

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.environ.get("NEWS_DB_PATH", os.path.join(BASE_DIR, "news.db"))
_lock = threading.Lock()

SEED_NEWS: List[Dict[str, Any]] = [
    {
        "id": "2025-07-31-nuevo-laboratorio-metalurgico-inaugurado-0",
        "fecha": "2025-07-31",
        "titulo": "Nuevo Laboratorio Metalúrgico Inaugurado",
        "descripcionCorta": "Inauguración de laboratorio con equipos de última generación.",
        "descripcionLarga": "Se inauguró el nuevo laboratorio con equipos de última generación para prácticas y proyectos de investigación.",
        "autor": "Admin",
        "categoria": ["Evento"],
        "imagen": "",
        "destacada": False,
        "vistas": 0,
    }
]

@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS news (
              id TEXT PRIMARY KEY,
              fecha TEXT NOT NULL,
              titulo TEXT NOT NULL,
              descripcionCorta TEXT NOT NULL,
              descripcionLarga TEXT NOT NULL,
              autor TEXT NOT NULL,
              categoria TEXT NOT NULL, -- JSON array
              imagen TEXT,
              destacada INTEGER DEFAULT 0,
              vistas INTEGER DEFAULT 0,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
            """
        )
        # Índices auxiliares para búsquedas / orden (id ya es PK)
        cur.execute("CREATE INDEX IF NOT EXISTS idx_news_fecha ON news(fecha)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_news_destacada ON news(destacada)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_news_autor ON news(autor)")
        # Texto: SQLite sin FTS aquí; se hará LIKE sobre titulo/descripcionCorta
        # Seed si está vacío
        cur.execute("SELECT COUNT(*) FROM news")
        if cur.fetchone()[0] == 0:
            for n in SEED_NEWS:
                now = datetime.utcnow().isoformat()
                cur.execute(
                    """INSERT INTO news (id, fecha, titulo, descripcionCorta, descripcionLarga, autor, categoria, imagen, destacada, vistas, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        n["id"], n["fecha"], n["titulo"], n["descripcionCorta"], n["descripcionLarga"], n["autor"], json.dumps(n["categoria"], ensure_ascii=False),
                        n.get("imagen", ""), 1 if n.get("destacada") else 0, n.get("vistas", 0), now, now
                    )
                )
        conn.commit()

def slug(text: str) -> str:
    import unicodedata, re
    t = unicodedata.normalize('NFD', text.lower())
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    t = re.sub(r'[^a-z0-9\s-]', '', t)
    t = re.sub(r'\s+', '-', t).strip('-')
    return t[:60]

def _row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "fecha": row["fecha"],
        "titulo": row["titulo"],
        "descripcionCorta": row["descripcionCorta"],
        "descripcionLarga": row["descripcionLarga"],
        "autor": row["autor"],
        "categoria": json.loads(row["categoria"]) if row["categoria"] else [],
        "imagen": row["imagen"],
        "destacada": bool(row["destacada"]),
        "vistas": row["vistas"],
    }

def list_news() -> List[Dict[str, Any]]:
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM news ORDER BY fecha DESC, created_at DESC")
        return [_row_to_dict(r) for r in cur.fetchall()]

def search_news(q: Optional[str] = None, categoria: Optional[str] = None, destacada: Optional[bool] = None,
                page: int = 1, page_size: int = 10) -> Dict[str, Any]:
    """Búsqueda simple con filtros y paginación.
    Retorna dict con items, total, page, page_size."""
    if page < 1: page = 1
    if page_size < 1: page_size = 10
    if page_size > 100: page_size = 100
    where = []
    params: list[Any] = []
    if q:
        like = f"%{q.lower()}%"
        where.append("(lower(titulo) LIKE ? OR lower(descripcionCorta) LIKE ? OR lower(descripcionLarga) LIKE ?)")
        params.extend([like, like, like])
    if categoria:
        # categoria almacenada como JSON array string -> LIKE simple
        where.append("categoria LIKE ?")
        params.append(f"%{categoria}%")
    if destacada is not None:
        where.append("destacada = ?")
        params.append(1 if destacada else 0)
    clause = (" WHERE " + " AND ".join(where)) if where else ""
    offset = (page - 1) * page_size
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM news{clause}", params)
        total = cur.fetchone()[0]
        cur.execute(f"SELECT * FROM news{clause} ORDER BY fecha DESC, created_at DESC LIMIT ? OFFSET ?", params + [page_size, offset])
        items = [_row_to_dict(r) for r in cur.fetchall()]
    return {"items": items, "total": total, "page": page, "page_size": page_size}

def get_news(nid: str) -> Optional[Dict[str, Any]]:
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM news WHERE id = ?", (nid,))
        row = cur.fetchone()
        return _row_to_dict(row) if row else None

def increment_views(nid: str, amount: int = 1) -> Optional[Dict[str, Any]]:
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE news SET vistas = vistas + ?, updated_at = ? WHERE id = ?", (amount, datetime.utcnow().isoformat(), nid))
        if cur.rowcount == 0:
            return None
        conn.commit()
    return get_news(nid)

def upsert_news(item: Dict[str, Any]) -> Dict[str, Any]:
    required = ["titulo", "fecha", "descripcionCorta", "descripcionLarga", "autor", "categoria"]
    for r in required:
        if r not in item:
            raise ValueError(f"Campo requerido faltante: {r}")
    if not item.get("id"):
        base_slug = slug(item["titulo"])
        item["id"] = f"{item['fecha']}-{base_slug}-{int(datetime.utcnow().timestamp())}"
    now = datetime.utcnow().isoformat()
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM news WHERE id = ?", (item["id"],))
        exists = cur.fetchone() is not None
        if exists:
            cur.execute(
                """UPDATE news SET fecha=?, titulo=?, descripcionCorta=?, descripcionLarga=?, autor=?, categoria=?, imagen=?, destacada=?, vistas=?, updated_at=? WHERE id=?""",
                (
                    item["fecha"], item["titulo"], item["descripcionCorta"], item["descripcionLarga"], item["autor"], json.dumps(item["categoria"], ensure_ascii=False),
                    item.get("imagen", ""), 1 if item.get("destacada") else 0, item.get("vistas", 0), now, item["id"]
                )
            )
        else:
            cur.execute(
                """INSERT INTO news (id, fecha, titulo, descripcionCorta, descripcionLarga, autor, categoria, imagen, destacada, vistas, created_at, updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    item["id"], item["fecha"], item["titulo"], item["descripcionCorta"], item["descripcionLarga"], item["autor"], json.dumps(item["categoria"], ensure_ascii=False),
                    item.get("imagen", ""), 1 if item.get("destacada") else 0, item.get("vistas", 0), now, now
                )
            )
        conn.commit()
    return get_news(item["id"])  # type: ignore

def delete_news(nid: str) -> bool:
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM news WHERE id = ?", (nid,))
        deleted = cur.rowcount > 0
        conn.commit()
    return deleted

# Inicializar al importar
init_db()
