"""db.py (LEGACY / BACKWARD COMPAT)

Este módulo era la versión original de la capa de conexión a base de datos
para seleccionar entre Postgres (Supabase / producción) y SQLite (desarrollo local).
Ahora la versión activa y recomendada vive en `core/db.py` y este archivo se
mantiene para compatibilidad retro (por si algún import antiguo en otro lugar).

Sigue ofreciendo dos funciones públicas:
  - get_connection() -> context manager que produce una conexión (psycopg o sqlite3)
  - is_postgres() -> bool que indica si estamos en modo Postgres

Puedes eliminarlo cuando verifiques que ningún import externo lo utiliza.
"""

from __future__ import annotations  # Permite anotaciones hacia adelante (no estrictamente necesario aquí).
import os, contextlib, sqlite3  # os para variables entorno, contextlib para contextmanager, sqlite3 driver local.
from typing import Iterator, Any  # Tipos para claridad.

# DATABASE_URL: variable de entorno que si apunta a un Postgres (empieza con 'postgres') forzará modo Postgres.
DATABASE_URL = os.getenv("DATABASE_URL")  # Ej: postgresql+psycopg://user:pass@host:5432/dbname
# IS_POSTGRES: bandera precomputada para evitar recalcular condiciones cada vez.
IS_POSTGRES = DATABASE_URL is not None and DATABASE_URL.startswith("postgres")

# Importaciones condicionales: solo se cargan librerías de Postgres si realmente se usarán.
if IS_POSTGRES:
    import psycopg  # Driver moderno psycopg3.
    import psycopg.rows  # Para row_factory dict_row.

@contextlib.contextmanager  # Decorador que simplifica crear context managers con yield.
def get_connection() -> Iterator[Any]:  # Devuelve un iterador (context manager) de conexión DB agnóstica.
    if IS_POSTGRES:  # Rama Postgres.
        # Algunas cadenas pueden venir con '+psycopg' (estilo SQLAlchemy); psycopg espera postgresql://.
        url = DATABASE_URL.replace("+psycopg", "")  # Normalizamos la URL.
        # Abrimos conexión con row_factory que devuelve cada fila como dict (clave=nombre columna).
        with psycopg.connect(url, row_factory=psycopg.rows.dict_row) as conn:  # type: ignore
            yield conn  # Al salir del with externo, psycopg cierra la conexión automáticamente.
    else:  # Rama SQLite (fallback dev / local).
        base_dir = os.path.dirname(__file__)  # Directorio actual de este archivo.
        # NEWS_DB_PATH permite redefinir la ruta si se desea; default news.db junto a este módulo.
        path = os.environ.get("NEWS_DB_PATH", os.path.join(base_dir, "news.db"))
        conn = sqlite3.connect(path)  # Abre (o crea) archivo SQLite.
        conn.row_factory = sqlite3.Row  # Filas accesibles por nombre de columna.
        try:
            yield conn  # Entregamos conexión viva.
        finally:
            conn.close()  # Nos aseguramos de cerrarla al final (no hay autoclosed como en psycopg context).

def is_postgres() -> bool:  # Pequeño helper para que código de capas superiores ajuste SQL según motor.
    return IS_POSTGRES  # Simplemente devuelve la bandera calculada al cargar el módulo.
