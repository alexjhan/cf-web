# Despliegue Backend FastAPI (Noticias + RAG)

## 1. Requisitos locales
Python 3.11+

Instalar dependencias:
```
cd backend/asistente-rag
pip install -r requirements.txt
uvicorn rag_api.main:app --reload --port 8000
```
Visita: http://localhost:8000/news

## 2. Variables opcionales
- `GROQ_API_KEY` (si usas el endpoint /ask)
- `NEWS_DB_PATH` (ruta alternativa para `news.db`)

## 3. Despliegue en Render (GUI rápida)
1. Crea nuevo servicio Web -> Repositorio GitHub.
2. Runtime: Python. 
3. Runtime: Python 3.11.
4. Build Command:
  ```
  pip install -r requirements.txt
  ```
  (Render ya está dentro de `backend/asistente-rag` al usar Root Directory)
5. Start Command:
  ```
  uvicorn rag_api.main:app --host 0.0.0.0 --port 8000
  ```
6. Add Disk (Persistence) → Size 1GB (o más) → Mount Path: `/app/data`.
7. Env Vars (Settings > Environment):
  - `NEWS_DB_PATH=/app/data/news.db`
  - `ADMIN_TOKEN=elige-un-token-seguro` (min 16 chars)
  - `FRONTEND_ORIGINS=https://TU_FRONTEND.netlify.app` (puedes añadir varias separadas por coma)
  - (Opcional) `GROQ_API_KEY=...`
8. Deploy. Anota la URL pública (ej: `https://cf-backend.onrender.com`).
9. Verifica `GET https://cf-backend.onrender.com/health`.

### Render con Docker (opcional)
Selecciona Deploy an existing Dockerfile y usa el Dockerfile añadido. Root Directory: `backend/asistente-rag`.

## 4. Despliegue en Railway
1. railway init: Conectar repo.
2. Añade servicio Nuevo -> Selecciona el repo.
3. Variables (Settings > Variables): agrega `PORT=8000` (Railway la inyecta a veces, pero forzar). Comando start se autodetecta; si no, define:
```
uvicorn rag_api.main:app --host 0.0.0.0 --port $PORT
```

## 5. Fly.io (alternativa)
```
fly launch --no-deploy
# Editar fly.toml para poner internal_port = 8000
fly deploy
```

## 6. Verifica endpoints
```
GET /health
GET /news
POST /news (JSON noticia)
PUT /news/{id}
DELETE /news/{id}
GET /news/{id}  (incrementa vistas)
POST /news/{id}/views
```

## 7. Configurar frontend (Netlify)
Netlify > Site Settings > Environment variables:
```
VITE_API_URL = https://TU_BACKEND_DOMINIO (sin slash final)
VITE_ADMIN_TOKEN = (igual a ADMIN_TOKEN para que el panel admin lo envíe)
```
Redeploy (Clear cache & deploy) para que el build inyecte las variables.

## 8. Prueba en producción
1. Abre `https://tu-frontend.netlify.app/admin-noticias`.
2. DevTools > Network filtra `news` y confirma peticiones a tu dominio backend.
3. Crea noticia -> debe aparecer en `/news` (GET) y en la página pública después de máximo 30s (poll) o al recargar.

## 9. Backup y migración
El archivo SQLite (`news.db`) se crea en el contenedor. Para persistencia en Render añade un Disk (Add Disk) y mapea `/app` o un subdirectorio dedicado como `/app/data` y exporta `NEWS_DB_PATH=/app/data/news.db`.

## 10. Hardening rápido
- CORS ya dinámico: ajustar `FRONTEND_ORIGINS` (separar dominios por coma). Evita usar `*` en producción.
- Token admin obligatorio: define `ADMIN_TOKEN`. El frontend admin lo envía en `X-Admin-Token` (o `Authorization: Bearer ...`).
- Rotación de token: cambia `ADMIN_TOKEN`, redeploy; revoca sesiones antiguas borrando `localStorage.adminAuth` en navegadores.
- Logs: usa Render Logs para monitorear errores 5xx.
- Rate-limit vistas: si se abusa, reemplaza el incremento automático por colas o un endpoint con protección básica (pendiente).

## 11. Ejemplo cURL
```
curl -X POST "$VITE_API_URL/news" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: $VITE_ADMIN_TOKEN" \
  -d '{
  "fecha":"2025-08-14",
  "titulo":"Noticia Demo",
  "descripcionCorta":"Resumen",
  "descripcionLarga":"Contenido largo...",
  "autor":"Admin",
  "categoria":["Evento"],
  "imagen":"",
  "destacada":false
}'
```

Listar:
```
curl $VITE_API_URL/news
```

## 12. Errores comunes
- 404 /news: root directory mal configurado en plataforma.
- Model download lento: primera llamada al endpoint /ask descarga embeddings; las noticias funcionan igual aunque tarde.
- Cambios no visibles: `VITE_API_URL` mal seteada o build sin variables -> hacer redeploy limpio.

---
Listo: tras seguir estos pasos el flujo CRUD es compartido para todos y protegido por token.
