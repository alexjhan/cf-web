"""Gestión de oportunidades (becas, prácticas, concursos, etc.) sobre la misma BD que noticias.

Campos:
  id (pk) -> generado a partir de fecha_publicacion + slug + timestamp si no se entrega
  titulo
  descripcion
  tipo (beca|practica|concurso|otro)
  fecha_publicacion (YYYY-MM-DD)
  fecha_cierre (opcional)
  fuente (cadena breve)
  enlace (URL opcional)
  estado (abierta|cerrada|archivada)
  created_at, updated_at
"""
from __future__ import annotations
import sqlite3
from datetime import datetime
from typing import Any, Dict, List, Optional
from . import news_store  # reutilizamos DB_PATH, _lock y get_conn

DB_PATH = news_store.DB_PATH
_lock = news_store._lock
get_conn = news_store.get_conn  # type: ignore
slug = news_store.slug

VALID_TIPOS = {"beca", "practica", "concurso", "otro"}
VALID_ESTADOS = {"abierta", "cerrada", "archivada"}

def init_db():
    with get_conn() as conn:  # type: ignore
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS oportunidades (
              id TEXT PRIMARY KEY,
              titulo TEXT NOT NULL,
              descripcion TEXT NOT NULL,
              tipo TEXT NOT NULL,
              fecha_publicacion TEXT NOT NULL,
              fecha_cierre TEXT,
              fuente TEXT,
              enlace TEXT,
              estado TEXT NOT NULL DEFAULT 'abierta',
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
            """
        )
        cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_fecha_pub ON oportunidades(fecha_publicacion)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_fecha_cierre ON oportunidades(fecha_cierre)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_tipo ON oportunidades(tipo)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_estado ON oportunidades(estado)")
        conn.commit()

def _row_to_dict(r: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": r["id"],
        "titulo": r["titulo"],
        "descripcion": r["descripcion"],
        "tipo": r["tipo"],
        "fecha_publicacion": r["fecha_publicacion"],
        "fecha_cierre": r["fecha_cierre"],
        "fuente": r["fuente"],
        "enlace": r["enlace"],
        "estado": r["estado"],
    }

def list_all() -> List[Dict[str, Any]]:
    with _lock, get_conn() as conn:  # type: ignore
        cur = conn.cursor()
        cur.execute("SELECT * FROM oportunidades ORDER BY fecha_publicacion DESC, created_at DESC")
        return [_row_to_dict(r) for r in cur.fetchall()]

def search(q: Optional[str] = None, tipo: Optional[str] = None, estado: Optional[str] = None,
           abierta: Optional[bool] = None, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
    if page < 1: page = 1
    if page_size < 1: page_size = 10
    if page_size > 100: page_size = 100
    where = []
    params: List[Any] = []
    if q:
        like = f"%{q.lower()}%"
        where.append("(lower(titulo) LIKE ? OR lower(descripcion) LIKE ?)")
        params.extend([like, like])
    if tipo:
        where.append("tipo = ?")
        params.append(tipo)
    if estado:
        where.append("estado = ?")
        params.append(estado)
    if abierta is not None:
        today = datetime.utcnow().date().isoformat()
        if abierta:
            where.append("estado = 'abierta' AND (fecha_cierre IS NULL OR fecha_cierre >= ?)")
            params.append(today)
        else:
            where.append("(estado != 'abierta' OR (fecha_cierre IS NOT NULL AND fecha_cierre < ?))")
            params.append(today)
    clause = (" WHERE " + " AND ".join(where)) if where else ""
    offset = (page - 1) * page_size
    with _lock, get_conn() as conn:  # type: ignore
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM oportunidades{clause}", params)
        total = cur.fetchone()[0]
        cur.execute(f"SELECT * FROM oportunidades{clause} ORDER BY fecha_publicacion DESC, created_at DESC LIMIT ? OFFSET ?", params + [page_size, offset])
        items = [_row_to_dict(r) for r in cur.fetchall()]
    return {"items": items, "total": total, "page": page, "page_size": page_size}

def get_one(oid: str) -> Optional[Dict[str, Any]]:
    with _lock, get_conn() as conn:  # type: ignore
        cur = conn.cursor()
        cur.execute("SELECT * FROM oportunidades WHERE id=?", (oid,))
        row = cur.fetchone()
        return _row_to_dict(row) if row else None

def upsert(data: Dict[str, Any]) -> Dict[str, Any]:
    required = ["titulo", "descripcion", "tipo", "fecha_publicacion"]
    for r in required:
        if r not in data:
            raise ValueError(f"Campo requerido faltante: {r}")
    if data["tipo"] not in VALID_TIPOS:
        raise ValueError("tipo inválido")
    if data.get("estado") and data["estado"] not in VALID_ESTADOS:
        raise ValueError("estado inválido")
    if not data.get("id"):
        base_slug = slug(data["titulo"])  # type: ignore
        data["id"] = f"{data['fecha_publicacion']}-{base_slug}-{int(datetime.utcnow().timestamp())}"
    now = datetime.utcnow().isoformat()
    with _lock, get_conn() as conn:  # type: ignore
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM oportunidades WHERE id=?", (data["id"],))
        exists = cur.fetchone() is not None
        if exists:
            cur.execute(
                """UPDATE oportunidades SET titulo=?, descripcion=?, tipo=?, fecha_publicacion=?, fecha_cierre=?, fuente=?, enlace=?, estado=?, updated_at=? WHERE id=?""",
                (
                    data["titulo"], data["descripcion"], data["tipo"], data["fecha_publicacion"], data.get("fecha_cierre"),
                    data.get("fuente"), data.get("enlace"), data.get("estado", "abierta"), now, data["id"]
                )
            )
        else:
            cur.execute(
                """INSERT INTO oportunidades (id, titulo, descripcion, tipo, fecha_publicacion, fecha_cierre, fuente, enlace, estado, created_at, updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    data["id"], data["titulo"], data["descripcion"], data["tipo"], data["fecha_publicacion"], data.get("fecha_cierre"),
                    data.get("fuente"), data.get("enlace"), data.get("estado", "abierta"), now, now
                )
            )
        conn.commit()
    return get_one(data["id"])  # type: ignore

def delete(oid: str) -> bool:
    with _lock, get_conn() as conn:  # type: ignore
        cur = conn.cursor()
        cur.execute("DELETE FROM oportunidades WHERE id=?", (oid,))
        deleted = cur.rowcount > 0
        conn.commit()
    return deleted

init_db()
