"""Store de oportunidades.

Encargado de CRUD para 'oportunidades' (becas, prácticas, concursos, etc.) en SQLite o Postgres.
No maneja HTTP ni Pydantic; devuelve/recibe dicts.
"""
from __future__ import annotations  # Soporte de anotaciones futuras.
import threading  # Lock para operaciones en SQLite.
from datetime import datetime  # Timestamps ISO.
from typing import Any, Dict, List, Optional  # Tipos.
from contextlib import contextmanager  # Context manager para conexión.
from ..core import db  # Abstracción de conexión DB.
from .news_store import slug  # Reutilizamos función para generar IDs legibles.

_lock = threading.Lock()  # Evita condiciones de carrera en SQLite.

VALID_TIPOS = {"beca", "practica", "concurso", "otro"}  # Enumeración simple de tipos aceptados.
VALID_ESTADOS = {"abierta", "cerrada", "archivada"}  # Estados de una oportunidad.

@contextmanager  # Uso: with get_conn() as conn:
def get_conn():
    with db.get_connection() as conn:  # type: ignore
        yield conn  # Entregamos la conexión.

def init_db() -> None:  # Crea tabla e índices si no existen.
    with get_conn() as conn:
        cur = conn.cursor()
        if db.is_postgres():
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS oportunidades (
                  id TEXT PRIMARY KEY,
                  titulo TEXT NOT NULL,
                  descripcion TEXT NOT NULL,
                  tipo TEXT NOT NULL,
                  fecha_publicacion DATE NOT NULL,
                  fecha_cierre DATE,
                  fuente TEXT,
                  enlace TEXT,
                  estado TEXT NOT NULL DEFAULT 'abierta',
                  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
                )
                """
            )
            cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_fecha_pub ON oportunidades(fecha_publicacion)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_fecha_cierre ON oportunidades(fecha_cierre)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_tipo ON oportunidades(tipo)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_oportunidades_estado ON oportunidades(estado)")
        else:
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

def _row_to_dict(r: Any) -> Dict[str, Any]:  # Convierte fila DB -> dict estándar.
    return {
        "id": r["id"],
        "titulo": r["titulo"],
        "descripcion": r["descripcion"],
        "tipo": r["tipo"],
        "fecha_publicacion": str(r["fecha_publicacion"]),
        "fecha_cierre": r["fecha_cierre"],
        "fuente": r["fuente"],
        "enlace": r["enlace"],
        "estado": r["estado"],
    }

def list_all() -> List[Dict[str, Any]]:  # Lista completa (sin filtros) ordenada.
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM oportunidades ORDER BY fecha_publicacion DESC, created_at DESC")
        return [_row_to_dict(r) for r in cur.fetchall()]

def search(q: Optional[str] = None, tipo: Optional[str] = None, estado: Optional[str] = None,
           abierta: Optional[bool] = None, page: int = 1, page_size: int = 10) -> Dict[str, Any]:  # Filtros + paginación.
    if page < 1: page = 1
    if page_size < 1: page_size = 10
    if page_size > 100: page_size = 100
    where: List[str] = []
    params: List[Any] = []
    placeholder = "%s" if db.is_postgres() else "?"
    if q:
        like = f"%{q.lower()}%"
        where.append(f"(lower(titulo) LIKE {placeholder} OR lower(descripcion) LIKE {placeholder})")
        params.extend([like, like])
    if tipo:
        where.append(f"tipo = {placeholder}")
        params.append(tipo)
    if estado:
        where.append(f"estado = {placeholder}")
        params.append(estado)
    if abierta is not None:
        today = datetime.utcnow().date().isoformat()
        if abierta:
            where.append(f"estado = 'abierta' AND (fecha_cierre IS NULL OR fecha_cierre >= {placeholder})")
        else:
            where.append(f"(estado != 'abierta' OR (fecha_cierre IS NOT NULL AND fecha_cierre < {placeholder}))")
        params.append(today)
    clause = (" WHERE " + " AND ".join(where)) if where else ""
    offset = (page - 1) * page_size
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        if db.is_postgres():
            cur.execute(f"SELECT COUNT(*) FROM oportunidades{clause}", params)
            total = cur.fetchone()[0]
            cur.execute(
                f"SELECT * FROM oportunidades{clause} ORDER BY fecha_publicacion DESC, created_at DESC LIMIT %s OFFSET %s",
                params + [page_size, offset],
            )
        else:
            cur.execute(f"SELECT COUNT(*) FROM oportunidades{clause}", params)
            total = cur.fetchone()[0]
            cur.execute(
                f"SELECT * FROM oportunidades{clause} ORDER BY fecha_publicacion DESC, created_at DESC LIMIT ? OFFSET ?",
                params + [page_size, offset],
            )
        items = [_row_to_dict(r) for r in cur.fetchall()]
    return {"items": items, "total": total, "page": page, "page_size": page_size}

def get_one(oid: str) -> Optional[Dict[str, Any]]:  # Obtiene una oportunidad por ID.
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        if db.is_postgres():
            cur.execute("SELECT * FROM oportunidades WHERE id=%s", (oid,))
        else:
            cur.execute("SELECT * FROM oportunidades WHERE id=?", (oid,))
        row = cur.fetchone()
        return _row_to_dict(row) if row else None

def upsert(data: Dict[str, Any]) -> Dict[str, Any]:  # Inserta o actualiza según existencia.
    required = ["titulo", "descripcion", "tipo", "fecha_publicacion"]
    for r in required:
        if r not in data:
            raise ValueError(f"Campo requerido faltante: {r}")
    if data["tipo"] not in VALID_TIPOS:
        raise ValueError("tipo inválido")
    if data.get("estado") and data["estado"] not in VALID_ESTADOS:
        raise ValueError("estado inválido")
    if not data.get("id"):
        base_slug = slug(data["titulo"])
        data["id"] = f"{data['fecha_publicacion']}-{base_slug}-{int(datetime.utcnow().timestamp())}"
    now = datetime.utcnow().isoformat()
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        if db.is_postgres():
            cur.execute("SELECT 1 FROM oportunidades WHERE id=%s", (data["id"],))
            exists = cur.fetchone() is not None
            if exists:
                cur.execute(
                    """UPDATE oportunidades SET titulo=%s, descripcion=%s, tipo=%s, fecha_publicacion=%s, fecha_cierre=%s, fuente=%s, enlace=%s, estado=%s, updated_at=now() WHERE id=%s""",
                    (
                        data["titulo"], data["descripcion"], data["tipo"], data["fecha_publicacion"], data.get("fecha_cierre"),
                        data.get("fuente"), data.get("enlace"), data.get("estado", "abierta"), data["id"],
                    ),
                )
            else:
                cur.execute(
                    """INSERT INTO oportunidades (id, titulo, descripcion, tipo, fecha_publicacion, fecha_cierre, fuente, enlace, estado, created_at, updated_at)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s, now(), now())""",
                    (
                        data["id"], data["titulo"], data["descripcion"], data["tipo"], data["fecha_publicacion"], data.get("fecha_cierre"),
                        data.get("fuente"), data.get("enlace"), data.get("estado", "abierta"),
                    ),
                )
        else:
            cur.execute("SELECT 1 FROM oportunidades WHERE id=?", (data["id"],))
            exists = cur.fetchone() is not None
            if exists:
                cur.execute(
                    """UPDATE oportunidades SET titulo=?, descripcion=?, tipo=?, fecha_publicacion=?, fecha_cierre=?, fuente=?, enlace=?, estado=?, updated_at=? WHERE id=?""",
                    (
                        data["titulo"], data["descripcion"], data["tipo"], data["fecha_publicacion"], data.get("fecha_cierre"),
                        data.get("fuente"), data.get("enlace"), data.get("estado", "abierta"), now, data["id"],
                    ),
                )
            else:
                cur.execute(
                    """INSERT INTO oportunidades (id, titulo, descripcion, tipo, fecha_publicacion, fecha_cierre, fuente, enlace, estado, created_at, updated_at)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                    (
                        data["id"], data["titulo"], data["descripcion"], data["tipo"], data["fecha_publicacion"], data.get("fecha_cierre"),
                        data.get("fuente"), data.get("enlace"), data.get("estado", "abierta"), now, now,
                    ),
                )
        conn.commit()
    return get_one(data["id"])  # type: ignore

def delete(oid: str) -> bool:  # Elimina por ID.
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        if db.is_postgres():
            cur.execute("DELETE FROM oportunidades WHERE id=%s", (oid,))
        else:
            cur.execute("DELETE FROM oportunidades WHERE id=?", (oid,))
        deleted = cur.rowcount > 0
        conn.commit()
    return deleted

init_db()
