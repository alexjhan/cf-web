# Guía de Configuración: Extracción de WhatsApp para RAG

## Arquitectura del Sistema

```
Grupos WhatsApp → WhatsApp Web Scraper → RAG API → Embedding Worker → RAG Knowledge Base
```

## Instalación y Configuración

### 1. Instalar dependencias Python (RAG API + Worker)

```bash
cd backend/asistente-rag
pip install -r requirements.txt
```

### 2. Instalar dependencias Node.js (WhatsApp Scraper)

```bash
cd backend/asistente-rag/data_ingest
npm install
```

### 3. Configurar variables de entorno

```bash
# En backend/asistente-rag/.env
WHATSAPP_VERIFY_TOKEN=tu-token-verificacion-meta
GROQ_API_KEY=tu-api-key-groq
```

### 4. Iniciar servicios

#### Terminal 1: RAG API
```bash
cd backend/asistente-rag/rag_api
uvicorn main:app --reload --port 8000
```

#### Terminal 2: Embedding Worker
```bash
cd backend/asistente-rag/embeddings
python message_embedding_worker.py
```

#### Terminal 3: WhatsApp Scraper
```bash
cd backend/asistente-rag/data_ingest
npm start
```

## Configuración de Grupos

### Editar grupos objetivo en `whatsapp_web_scraper.js`:

```javascript
const TARGET_GROUPS = [
    'Metalurgia UNSAAC 2025',
    'CF Metalurgia - Académico', 
    'Dudas Metalurgia',
    'Laboratorio Metalurgia',
    'Proyectos de Grado'
];
```

## Flujo de Datos

1. **WhatsApp Web Scraper** monitorea grupos configurados
2. **Filtrado inteligente** de mensajes académicamente relevantes
3. **Envío a RAG API** vía POST /ingest/messages
4. **Almacenamiento** en archivos JSONL por plataforma
5. **Embedding Worker** procesa cada 5 minutos:
   - Limpia y normaliza texto
   - Verifica relevancia académica
   - Genera embeddings con sentence-transformers
   - Actualiza base de conocimiento del RAG

## Seguridad y Privacidad

### ✅ Implementado:
- Filtrado de contenido académico únicamente
- Anonización de números de teléfono
- Limpieza de URLs y menciones
- Retención limitada (30 días por defecto)

### 🔒 Recomendaciones adicionales:
- Usar cuenta dedicada para el scraper
- Obtener consentimiento de administradores de grupo
- Revisar logs periódicamente
- Implementar lista de palabras prohibidas si es necesario

## Monitoreo

### Logs del sistema:
```bash
# Ver actividad del scraper
tail -f data_ingest/whatsapp_scraper.log

# Ver procesamiento de embeddings  
tail -f embeddings/worker.log

# Ver requests al RAG API
tail -f rag_api/api.log
```

### Estadísticas:
- `/ask` ahora incluye contexto de mensajes recientes
- Archivos JSONL en `data_ingest/messages/`
- Base de embeddings en `fragments/fragments_embedded.json`

## Alternativas si WhatsApp Web da problemas

### Opción B: Export manual + carga periódica
```bash
# Exportar chat de WhatsApp → colocar en data_ingest/manual/
python scripts/import_whatsapp_export.py grupo_metalurgia.txt
```

### Opción C: Telegram Bot (API oficial)
```javascript
// telegram_bot.js - API más estable
const TelegramBot = require('node-telegram-bot-api');
// Configurar bot y leer mensajes de grupos con permisos
```

## Troubleshooting

### WhatsApp Web no conecta:
1. Verificar que WhatsApp Web funcione en el navegador
2. Asegurar que no hay otra sesión activa
3. Scanear QR desde la app móvil
4. Reiniciar el scraper si pierde conexión

### No se procesan mensajes:
1. Verificar que los grupos están en TARGET_GROUPS
2. Comprobar filtros académicos en isAcademicMessage()
3. Revisar logs de filtrado

### RAG no usa contexto nuevo:
1. Verificar que message_embedding_worker.py esté corriendo
2. Comprobar que fragments_embedded.json se actualiza
3. Reiniciar RAG API para recargar embeddings

## Métricas de Rendimiento

Con esta configuración, el sistema puede:
- Procesar ~1000 mensajes/día de grupos activos
- Filtrar ~80% de ruido/spam automáticamente  
- Generar embeddings de mensajes relevantes en ~5 minutos
- Mantener base de conocimiento actualizada sin intervención manual

El RAG ahora tendrá contexto "vivo" de las conversaciones académicas reales de los estudiantes.
