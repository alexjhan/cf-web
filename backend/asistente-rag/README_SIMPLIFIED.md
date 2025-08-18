# Backend Simplificado (Opción A)

Esta versión elimina la capa `repositories` y los endpoints viven en routers que llaman directamente a los `stores`.

## Estructura
```
rag_api/
  core/            # db (nuevo), security
  models/          # Solo news (Pydantic) por ahora
  stores/          # news_store, oportunidades_store, storage_store
  routers/         # news, oportunidades, storage
  main.py          # /ask, /ingest/messages, webhook, incluye routers
```
Eliminado: repositories, archivos legacy duplicados.

## Endpoints principales
- /news
- /oportunidades
- /storage
- /ask
- /ingest/messages
- /webhooks/whatsapp

## Seguridad
Enviar token admin en uno de:
- Header `X-Admin-Token: <token>`
- Header `Authorization: Bearer <token>`

Variable: `ADMIN_TOKEN` en entorno.

## Tests mínimos
Ubicados en `tests/` (pytest + fastapi TestClient). Para correr:
```bash
pip install -r requirements.txt  # Asegúrate de incluir fastapi uvicorn pytest httpx sentence-transformers duckduckgo-search
pytest -q backend/asistente-rag/tests
```

## Próximos pasos sugeridos
1. Añadir más validaciones (Pydantic) para oportunidades y storage si se estabilizan.
2. Separar lógica /ask a un servicio si crece.
3. Añadir logging estructurado.
4. Migrar a Postgres/pgvector cuando se integren embeddings reales.

## Nota
Mantén esta opción mientras iteras rápido; cuando necesites más desac acoplamiento puedes introducir de nuevo una capa intermedia.
