"""storage_store.py

Almacenamiento genérico (key/value tipado) sobre una tabla SQLite llamada `data_items`.
Objetivo: permitir guardar pequeñas entidades variadas sin crear una tabla dedicada
para cada una mientras prototipamos. Posteriormente se pueden extraer modelos propios
o migrar a Postgres.
"""

from __future__ import annotations  # Facilita anotaciones de tipos hacia adelante.
import os, sqlite3, json, threading, uuid  # Módulos estándar: persistencia, serialización y sincronización.
from datetime import datetime  # Para timestamps ISO.
from typing import Any, Dict, List, Optional  # Tipado estático.
from contextlib import contextmanager  # Crear context managers simples con yield.

BASE_DIR = os.path.dirname(__file__)  # Directorio de este archivo.
DB_PATH = os.environ.get("GENERIC_DB_PATH", os.path.join(BASE_DIR, "storage.db"))  # Ruta de la base de datos.
_lock = threading.Lock()  # Evita condiciones de carrera en escrituras concurrentes (SQLite = file-locking coarse).

@contextmanager  # Permite usar: with get_conn() as conn:
def get_conn():  # Crea y cierra una conexión SQLite cada vez (suficiente para cargas moderadas).
    conn = sqlite3.connect(DB_PATH)  # Abre archivo de base de datos.
    conn.row_factory = sqlite3.Row  # Acceso a columnas por nombre.
    try:
        yield conn  # Devuelve conexión activa al bloque.
    finally:
        conn.close()  # Garantiza cierre incluso ante excepciones.

def init_db():  # Crea la tabla si no existe e índices mínimos.
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute(  # Tabla con JSON serializado en columna TEXT.
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
        cur.execute("CREATE INDEX IF NOT EXISTS idx_data_items_tipo ON data_items(tipo)")  # Búsquedas por tipo.
        conn.commit()  # Persistimos cambios.

def _row_to_dict(r: sqlite3.Row) -> Dict[str, Any]:  # Convierte fila SQLite -> dict Python.
    return {
        "id": r["id"],  # Identificador único (UUID u otro definido por el usuario).
        "tipo": r["tipo"],  # Categoría lógica del item.
        "data": json.loads(r["data"]),  # Carga JSON serializado.
        "created_at": r["created_at"],  # Fecha de creación (ISO).
        "updated_at": r["updated_at"],  # Última modificación (ISO).
    }

def create_item(tipo: str, data: Dict[str, Any], item_id: Optional[str] = None) -> Dict[str, Any]:  # Inserta nuevo item.
    if not tipo:  # Validación mínima: tipo obligatorio.
        raise ValueError("'tipo' es requerido")
    item_id = item_id or str(uuid.uuid4())  # Si no se pasa ID, generamos UUID.
    now = datetime.utcnow().isoformat()  # Timestamp actual.
    with _lock, get_conn() as conn:  # Bloqueamos durante la escritura.
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO data_items (id, tipo, data, created_at, updated_at) VALUES (?,?,?,?,?)",
            (item_id, tipo, json.dumps(data, ensure_ascii=False), now, now)
        )
        conn.commit()  # Confirmamos la transacción.
    return get_item(item_id)  # type: ignore  # Retornamos el registro recién creado.

def get_item(item_id: str) -> Optional[Dict[str, Any]]:  # Recupera un item por ID.
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM data_items WHERE id=?", (item_id,))  # Consulta preparada.
        row = cur.fetchone()  # Una sola fila.
        return _row_to_dict(row) if row else None  # Dict o None.

def update_item(item_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:  # Actualiza campo data.
    now = datetime.utcnow().isoformat()
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE data_items SET data=?, updated_at=? WHERE id=?",
            (json.dumps(data, ensure_ascii=False), now, item_id)
        )
        if cur.rowcount == 0:  # No existía.
            return None
        conn.commit()
    return get_item(item_id)  # Devolvemos versión actualizada.

def delete_item(item_id: str) -> bool:  # Borra un item, devuelve True si existía.
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM data_items WHERE id=?", (item_id,))
        deleted = cur.rowcount > 0  # rowcount indica filas afectadas.
        conn.commit()
    return deleted

def search_items(tipo: Optional[str] = None, q: Optional[str] = None, page: int = 1, page_size: int = 20) -> Dict[str, Any]:  # Listado filtrado + paginación.
    if page < 1: page = 1  # Normalizamos límites.
    if page_size < 1: page_size = 20
    if page_size > 200: page_size = 200  # Límite superior para evitar abusos.
    where = []  # Lista de condiciones WHERE.
    params: List[Any] = []  # Valores para placeholders.
    if tipo:  # Filtro por tipo exacto.
        where.append("tipo = ?")
        params.append(tipo)
    if q:  # Búsqueda textual básica sobre el JSON serializado (case-insensitive).
        like = f"%{q.lower()}%"
        where.append("lower(data) LIKE ?")
        params.append(like)
    clause = (" WHERE " + " AND ".join(where)) if where else ""  # Composición final del WHERE.
    offset = (page - 1) * page_size  # Cálculo desplazamiento.
    with _lock, get_conn() as conn:
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM data_items{clause}", params)  # Total para paginación.
        total = cur.fetchone()[0]
        cur.execute(
            f"SELECT * FROM data_items{clause} ORDER BY created_at DESC LIMIT ? OFFSET ?",
            params + [page_size, offset]
        )
        items = [_row_to_dict(r) for r in cur.fetchall()]  # Convertimos filas.
    return {"items": items, "total": total, "page": page, "page_size": page_size}  # Envelope estándar.

# Inicialización automática de la tabla al importar el módulo.
init_db()
