"""Store de noticias.

Responsabilidad: hablar con la base de datos (SQLite o Postgres) para CRUD de la tabla `news`.
No conoce nada de HTTP ni de Pydantic: solo datos primitivos (dicts, listas).
"""
from __future__ import annotations  # Soporte de anotaciones de tipos adelantadas.
import json, os, threading, sqlite3  # json para serializar listas; threading.Lock para concurrencia en SQLite.
from datetime import datetime  # Timestamps ISO.
from typing import List, Dict, Any, Optional  # Tipos genéricos.
from contextlib import contextmanager  # Para crear context manager de conexión.
from ..core import db  # Módulo que abstrae conexión (Postgres o SQLite).

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # Carpeta base (rag_api/)
_lock = threading.Lock()  # Asegura que operaciones en SQLite no se pisen simultáneamente (no necesario estricto en Postgres pero seguro).

SEED_NEWS: List[Dict[str, Any]] = [  # Datos de ejemplo insertados solo si la tabla está vacía.
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

@contextmanager  # Permite usar: with get_conn() as conn:
def get_conn():
	with db.get_connection() as conn:  # type: ignore  # Delegamos a core.db
		yield conn  # Entregamos la conexión y luego se cierra automáticamente.

def init_db():  # Crea tabla + índices si no existen; inserta seeds si está vacía.
	with get_conn() as conn:
		cur = conn.cursor()
		if db.is_postgres():
			cur.execute(
				"""
				CREATE TABLE IF NOT EXISTS news (
				  id TEXT PRIMARY KEY,
				  fecha DATE NOT NULL,
				  titulo TEXT NOT NULL,
				  descripcionCorta TEXT NOT NULL,
				  descripcionLarga TEXT NOT NULL,
				  autor TEXT NOT NULL,
				  categoria JSONB NOT NULL DEFAULT '[]'::jsonb,
				  imagen TEXT,
				  destacada BOOLEAN DEFAULT FALSE,
				  vistas INTEGER DEFAULT 0,
				  created_at TIMESTAMPTZ DEFAULT now(),
				  updated_at TIMESTAMPTZ DEFAULT now()
				)
				"""
			)
			cur.execute("CREATE INDEX IF NOT EXISTS idx_news_fecha ON news(fecha)")
			cur.execute("CREATE INDEX IF NOT EXISTS idx_news_destacada ON news(destacada)")
			cur.execute("CREATE INDEX IF NOT EXISTS idx_news_autor ON news(autor)")
			cur.execute("SELECT COUNT(*) FROM news")
			if cur.fetchone()[0] == 0:
				for n in SEED_NEWS:
					cur.execute(
						"""INSERT INTO news (id, fecha, titulo, descripcionCorta, descripcionLarga, autor, categoria, imagen, destacada, vistas, created_at, updated_at)
						VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, now(), now())""",
						(
							n["id"], n["fecha"], n["titulo"], n["descripcionCorta"], n["descripcionLarga"], n["autor"], json.dumps(n["categoria"], ensure_ascii=False),
							n.get("imagen", ""), n.get("destacada", False), n.get("vistas", 0)
						)
					)
		else:
			cur.execute(
				"""
				CREATE TABLE IF NOT EXISTS news (
				  id TEXT PRIMARY KEY,
				  fecha TEXT NOT NULL,
				  titulo TEXT NOT NULL,
				  descripcionCorta TEXT NOT NULL,
				  descripcionLarga TEXT NOT NULL,
				  autor TEXT NOT NULL,
				  categoria TEXT NOT NULL,
				  imagen TEXT,
				  destacada INTEGER DEFAULT 0,
				  vistas INTEGER DEFAULT 0,
				  created_at TEXT NOT NULL,
				  updated_at TEXT NOT NULL
				)
				"""
			)
			cur.execute("CREATE INDEX IF NOT EXISTS idx_news_fecha ON news(fecha)")
			cur.execute("CREATE INDEX IF NOT EXISTS idx_news_destacada ON news(destacada)")
			cur.execute("CREATE INDEX IF NOT EXISTS idx_news_autor ON news(autor)")
			cur.execute("SELECT COUNT(*) FROM news")
			if cur.fetchone()[0] == 0:
				for n in SEED_NEWS:
					now = datetime.utcnow().isoformat()
					cur.execute(
						"""INSERT INTO news (id, fecha, titulo, descripcionCorta, descripcionLarga, autor, categoria, imagen, destacada, vistas, created_at, updated_at)
						VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
						(
							n["id"], n["fecha"], n["titulo"], n["descripcionCorta"], n["descripcionLarga"], n["autor"], json.dumps(n["categoria"], ensure_ascii=False),
							n.get("imagen", ""), 1 if n.get("destacada") else 0, n.get("vistas", 0), now, now
						)
					)
		conn.commit()

def slug(text: str) -> str:  # Genera identificador URL-friendly limitado a 60 chars.
	import unicodedata, re
	t = unicodedata.normalize('NFD', text.lower())  # Normaliza y pasa a minúsculas.
	t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')  # Quita acentos.
	t = re.sub(r'[^a-z0-9\s-]', '', t)  # Elimina caracteres no permitidos.
	t = re.sub(r'\s+', '-', t).strip('-')  # Reemplaza espacios por guiones y recorta extremos.
	return t[:60]  # Limita tamaño.

def _row_to_dict(row: Any) -> Dict[str, Any]:  # Convierte fila DB a dict Python homogéneo.
	categoria_raw = row["categoria"]
	if db.is_postgres():
		if isinstance(categoria_raw, str):
			try:
				categoria_val = json.loads(categoria_raw)
			except Exception:
				categoria_val = []
		else:
			categoria_val = categoria_raw or []
	else:
		categoria_val = json.loads(categoria_raw) if categoria_raw else []
	imagen_val = row["imagen"] if isinstance(row, (dict,)) or hasattr(row, "__getitem__") else None
	return {
		"id": row["id"],
		"fecha": str(row["fecha"]),
		"titulo": row["titulo"],
		"descripcionCorta": row["descripcionCorta"],
		"descripcionLarga": row["descripcionLarga"],
		"autor": row["autor"],
		"categoria": categoria_val,
		"imagen": imagen_val,
		"destacada": bool(row["destacada"]),
		"vistas": row["vistas"],
	}

def list_news() -> List[Dict[str, Any]]:  # Devuelve todas las noticias ordenadas (para listados simples).
	with _lock, get_conn() as conn:
		cur = conn.cursor()
		cur.execute("SELECT * FROM news ORDER BY fecha DESC, created_at DESC")
		return [_row_to_dict(r) for r in cur.fetchall()]

def search_news(q: Optional[str] = None, categoria: Optional[str] = None, destacada: Optional[bool] = None,
				page: int = 1, page_size: int = 10) -> Dict[str, Any]:  # Filtro + paginación.
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
		where.append("categoria LIKE ?")
		params.append(f"%{categoria}%")
	if destacada is not None:
		where.append("destacada = ?")
		params.append(1 if destacada else 0)
	clause = (" WHERE " + " AND ".join(where)) if where else ""
	offset = (page - 1) * page_size
	with _lock, get_conn() as conn:
		cur = conn.cursor()
		if db.is_postgres():
			# Adapt placeholders
			clause_pg = clause.replace("?", "%s")
			cur.execute(f"SELECT COUNT(*) FROM news{clause_pg}", params)
			total = cur.fetchone()[0]
			cur.execute(f"SELECT * FROM news{clause_pg} ORDER BY fecha DESC, created_at DESC LIMIT %s OFFSET %s", params + [page_size, offset])
		else:
			cur.execute(f"SELECT COUNT(*) FROM news{clause}", params)
			total = cur.fetchone()[0]
			cur.execute(f"SELECT * FROM news{clause} ORDER BY fecha DESC, created_at DESC LIMIT ? OFFSET ?", params + [page_size, offset])
		items = [_row_to_dict(r) for r in cur.fetchall()]
	return {"items": items, "total": total, "page": page, "page_size": page_size}

def get_news(nid: str) -> Optional[Dict[str, Any]]:  # Obtiene una noticia por ID.
	with _lock, get_conn() as conn:
		cur = conn.cursor()
		if db.is_postgres():
			cur.execute("SELECT * FROM news WHERE id = %s", (nid,))
		else:
			cur.execute("SELECT * FROM news WHERE id = ?", (nid,))
		row = cur.fetchone()
		return _row_to_dict(row) if row else None

def increment_views(nid: str, amount: int = 1) -> Optional[Dict[str, Any]]:  # Incrementa contador vistas.
	with _lock, get_conn() as conn:
		cur = conn.cursor()
		if db.is_postgres():
			cur.execute("UPDATE news SET vistas = vistas + %s, updated_at = now() WHERE id = %s", (amount, nid))
		else:
			cur.execute("UPDATE news SET vistas = vistas + ?, updated_at = ? WHERE id = ?", (amount, datetime.utcnow().isoformat(), nid))
		if cur.rowcount == 0:
			return None
		conn.commit()
	return get_news(nid)

def upsert_news(item: Dict[str, Any]) -> Dict[str, Any]:  # Inserta o actualiza según exista el ID.
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
		if db.is_postgres():
			cur.execute("SELECT 1 FROM news WHERE id = %s", (item["id"],))
			exists = cur.fetchone() is not None
			if exists:
				cur.execute(
					"""UPDATE news SET fecha=%s, titulo=%s, descripcionCorta=%s, descripcionLarga=%s, autor=%s, categoria=%s, imagen=%s, destacada=%s, vistas=%s, updated_at=now() WHERE id=%s""",
					(
						item["fecha"], item["titulo"], item["descripcionCorta"], item["descripcionLarga"], item["autor"], json.dumps(item["categoria"], ensure_ascii=False),
						item.get("imagen", ""), item.get("destacada", False), item.get("vistas", 0), item["id"]
					)
				)
			else:
				cur.execute(
					"""INSERT INTO news (id, fecha, titulo, descripcionCorta, descripcionLarga, autor, categoria, imagen, destacada, vistas, created_at, updated_at)
					VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, now(), now())""",
					(
						item["id"], item["fecha"], item["titulo"], item["descripcionCorta"], item["descripcionLarga"], item["autor"], json.dumps(item["categoria"], ensure_ascii=False),
						item.get("imagen", ""), item.get("destacada", False), item.get("vistas", 0)
					)
				)
		else:
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

def delete_news(nid: str) -> bool:  # Elimina por ID. True si borró fila.
	with _lock, get_conn() as conn:
		cur = conn.cursor()
		if db.is_postgres():
			cur.execute("DELETE FROM news WHERE id = %s", (nid,))
		else:
			cur.execute("DELETE FROM news WHERE id = ?", (nid,))
		deleted = cur.rowcount > 0
		conn.commit()
	return deleted

init_db()
