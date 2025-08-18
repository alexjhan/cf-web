"""Paquete rag_api

Contiene la implementación del backend (FastAPI) organizado en capas:
	core/        -> utilidades transversales (db, security)
	models/      -> esquemas Pydantic
	stores/      -> acceso directo a la base de datos (CRUD SQL)
	repositories/-> adaptación stores <-> modelos
	routers/     -> endpoints FastAPI por dominio
	main.py      -> arranque y endpoints legacy / RAG / webhook

Los comentarios extensivos dentro de cada módulo explican línea a línea.
"""

# Exponer versión simple del paquete (opcional; puedes actualizar manualmente).
__version__ = "0.1.0"
