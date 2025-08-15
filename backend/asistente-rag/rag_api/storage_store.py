"""Almacenamiento genérico de datos estructurados (clave/valor tipado).

Permite guardar distintos tipos de entidades ligeras sin crear tablas nuevas
por cada caso de uso. Útil para prototipos (ej. oportunidades, documentos,
configuraciones, FAQs, etc.). Para casos de alto volumen conviene luego
normalizar o migrar a Postgres.
"""
from __future__ import annotations
import os, sqlite3, json, threading, uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from contextlib import contextmanager

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.environ.get("GENERIC_DB_PATH", os.path.join(BASE_DIR, "storage.db"))
_lock = threading.Lock()

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
            CREATE TABLE IF NOT EXISTS data_items (
              id TEXT PRIMARY KEY,
              tipo TEXT NOT NULL,
              data TEXT NOT NULL, -- JSON serializado
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
            """
        )
        cur.execute("CREATE INDEX IF NOT EXISTS idx_data_items_tipo ON data_items(tipo)")
        conn.commit()

def _row_to_dict(r: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": r["id"],
        "tipo": r["tipo"],
        "data": json.loads(r["data"]),
        "created_at": r["created_at"],
        "updated_at": r["updated_at"],
    }

def create_item(tipo: str, data: Dict[str, Any], item_id: Optional[str] = None) -> Dict[str, Any]:
    if not tipo:
        raise ValueError("'tipo' es requerido")
    item_id = item_id or str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO data_items (id, tipo, data, created_at, updated_at) VALUES (?,?,?,?,?)",
            (item_id, tipo, json.dumps(data, ensure_ascii=False), now, now)
        )
        conn.commit()
    return get_item(item_id)  # type: ignore

def get_item(item_id: str) -> Optional[Dict[str, Any]]:
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM data_items WHERE id=?", (item_id,))
        row = cur.fetchone()
        return _row_to_dict(row) if row else None

def update_item(item_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    now = datetime.utcnow().isoformat()
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE data_items SET data=?, updated_at=? WHERE id=?",
            (json.dumps(data, ensure_ascii=False), now, item_id)
        )
        if cur.rowcount == 0:
            return None
        conn.commit()
    return get_item(item_id)

def delete_item(item_id: str) -> bool:
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM data_items WHERE id=?", (item_id,))
        deleted = cur.rowcount > 0
        conn.commit()
    return deleted

def search_items(tipo: Optional[str] = None, q: Optional[str] = None, page: int = 1, page_size: int = 20) -> Dict[str, Any]:
    if page < 1: page = 1
    if page_size < 1: page_size = 20
    if page_size > 200: page_size = 200
    where = []
    params: List[Any] = []
    if tipo:
        where.append("tipo = ?")
        params.append(tipo)
    if q:
        like = f"%{q.lower()}%"
        where.append("lower(data) LIKE ?")
        params.append(like)
    clause = (" WHERE " + " AND ".join(where)) if where else ""
    offset = (page - 1) * page_size
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM data_items{clause}", params)
        total = cur.fetchone()[0]
        cur.execute(f"SELECT * FROM data_items{clause} ORDER BY created_at DESC LIMIT ? OFFSET ?", params + [page_size, offset])
        items = [_row_to_dict(r) for r in cur.fetchall()]
    return {"items": items, "total": total, "page": page, "page_size": page_size}

# Inicializar
init_db()
