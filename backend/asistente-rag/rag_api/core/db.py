from __future__ import annotations  # Soporta anotaciones de tipos adelantadas.
import os, contextlib, sqlite3  # os: variables de entorno y rutas; contextlib: contextmanager; sqlite3: DB local.
from typing import Iterator, Any  # Tipos para anotar funciones.

# Leemos la URL de la base desde variable de entorno. Si existe y empieza con 'postgres' usamos Postgres, si no SQLite.
DATABASE_URL = os.getenv("DATABASE_URL")  # Ejemplo: postgres://usuario:pass@host:5432/db
IS_POSTGRES = DATABASE_URL is not None and DATABASE_URL.startswith("postgres")  # True si debemos conectar a Postgres.

if IS_POSTGRES:  # Solo importamos psycopg si realmente se usará (evita fallo si no está instalado).
    import psycopg  # Cliente moderno para Postgres (psycopg 3).
    import psycopg.rows  # Para configurar cómo se devuelven filas (dict_row).

@contextlib.contextmanager  # Decorador que permite usar 'with get_connection() as conn:'
def get_connection() -> Iterator[Any]:  # Devuelve un iterador que produce una conexión (Postgres o SQLite).
    if IS_POSTGRES:  # Rama Postgres
        url = DATABASE_URL.replace("+psycopg", "")  # Limpia sufijo opcional "+psycopg" si viene en la URL.
        # psycopg.connect abre la conexión. row_factory hace que cada fila sea un dict (clave=nombre de columna).
        with psycopg.connect(url, row_factory=psycopg.rows.dict_row) as conn:  # type: ignore
            yield conn  # Entregamos la conexión al bloque 'with'. Se cierra automáticamente al salir.
    else:  # Rama SQLite (archivo local en disco)
        base_dir = os.path.dirname(__file__)  # Ruta del directorio actual (core/)
        root = os.path.dirname(base_dir)  # Subimos a rag_api/
        path = os.environ.get("NEWS_DB_PATH", os.path.join(root, "news.db"))  # Archivo de la BD (configurable)
        conn = sqlite3.connect(path)  # Abrimos conexión a SQLite.
        conn.row_factory = sqlite3.Row  # Las filas se comportan como diccionario-clave.
        try:
            yield conn  # Devolvemos la conexión al bloque 'with'.
        finally:
            conn.close()  # Aseguramos cierre para evitar fugas.

def is_postgres() -> bool:  # Función helper: otras capas preguntan si estamos en Postgres.
    return IS_POSTGRES
