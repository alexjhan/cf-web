# Arquitectura Backend (asistente-rag)

Resumen rápido de capas y archivos principales para que puedas orientarte y extender el sistema sin perderte.

## Objetivo General
Backend FastAPI que ofrece:
- Endpoint /ask con un flujo RAG simple (embeddings locales + búsqueda web ligera + Groq LLM opcional).
- CRUD de noticias (router modular /news) con búsqueda, paginación y vistas.
- CRUD de oportunidades y almacenamiento genérico (aún dentro de main.py, listo para extraerse a routers independientes).
- Ingesta de mensajes externos para futura indexación.
- Webhook WhatsApp (verificación + recepción básica).

Preparado para migrar de SQLite a Postgres (y luego pgvector) mediante una capa de abstracción de conexión.

## Capas
1. core/  -> Infraestructura transversal (DB, seguridad).
2. models/ -> Esquemas Pydantic de intercambio (solo noticias por ahora).
3. stores/ -> Acceso directo a la base de datos (CRUD puro, sin Pydantic, sin HTTP).
4. repositories/ -> Adaptadores que convierten datos crudos en modelos (ej: noticias).
5. routers/ -> Endpoints FastAPI agrupados por dominio (solo noticias por ahora).
6. main.py -> Orquestación general, endpoints legacy (oportunidades, storage, ask, ingest, webhook).

## Flujo Noticias
Cliente -> /news (router) -> security.check_admin (si mutación) -> repository.news_repository -> stores.news_store -> DB.

## Cambiar SQLite a Postgres
- Exporta DATABASE_URL=postgresql://usuario:pass@host:puerto/db
- core/db.is_postgres() detectará la URL y usará psycopg2.
- Los stores contienen ramas para SQL adaptado (placeholders %s vs ? y JSONB).

## main.py (resumen de endpoints clave)
- POST /ask: Usa embeddings locales + DuckDuckGo + Groq (si PLACEHOLDER_MODE != 1).
- POST /ingest/messages: Guarda mensajes crudos (JSONL) para futura indexación.
- CRUD /storage: Items genéricos (tabla data_items) con búsqueda paginada.
- CRUD /oportunidades: Oportunidades académicas / laborales.
- GET/POST ... /webhooks/whatsapp: Verificación y recepción básica (texto) de WhatsApp Cloud API.
- Incluye router de noticias (/news) que ya está modularizado.

## Variables de Entorno Relevantes
- ADMIN_TOKEN: Token de administración requerido para mutaciones (headers: X-Admin-Token o Authorization Bearer).
- GROQ_API_KEY: Credencial para llamadas al LLM Groq.
- CHATBOT_PLACEHOLDER=1: Fuerza respuestas dummy (evita usar LLM en desarrollo / mantenimiento).
- DATABASE_URL: Si presente y empieza con postgresql:// activa modo Postgres.
- WHATSAPP_VERIFY_TOKEN: Token de verificación para webhook.

## Próximos Pasos Sugeridos
1. Extraer oportunidades y storage a routers dedicados (routers/oportunidades.py, routers/storage.py) para simetría.
2. Crear modelos Pydantic para oportunidades y generic items (models/oportunidades.py, models/storage.py).
3. Añadir tests (pytest) para stores y routers (básicos: crear, leer, buscar, borrar).
4. Implementar tabla documents + fragments + embeddings (pgvector) para RAG real.
5. Sustituir modo placeholder por feature flag (pydantic Settings) centralizada.
6. Añadir logging estructurado (loguru / stdlib) y métricas (prometheus-client) opcionales.
7. Manejar versionado de esquemas (alembic si Postgres).

## Decisiones de Diseño
- stores: Mantienen SQL explícito para transparencia y facilidad de migración.
- repository: Solo cuando hay modelos Pydantic y lógica de adaptación (por eso noticias sí, oportunidades aún no).
- main.py conserva endpoints legacy para minimizar fricción al usuario hasta que se migren gradualmente.
- Comentarios exhaustivos estilo Feynman para facilitar onboarding rápido.

## Limpieza Realizada
- Eliminados shims legacy (`rag_api/news_store.py`, `rag_api/oportunidades_store.py`). Usar siempre `stores/`.

## Cómo Correr (desarrollo rápido)
```bash
pip install -r requirements.txt  # Asegúrate de incluir fastapi uvicorn numpy sentence-transformers duckduckgo-search requests psycopg2-binary (si Postgres)
uvicorn rag_api.main:app --reload --port 8001
```
(El archivo requirements.txt actual puede necesitar actualización si aún no lista todas las dependencias mencionadas.)

## Nota Final
Si algo parece complejo, revisa primero los comentarios en `core/db.py`, `stores/news_store.py` y `main.py`; esos muestran el patrón general para replicar nuevos dominios.
