"""main.py

Archivo principal que arranca la aplicación FastAPI.

Responsabilidades:
    - Cargar embeddings locales (RAG simple / placeholder).
    - Exponer endpoint /ask (consulta con LLM Groq o modo placeholder).
    - Incluir routers modulares: noticias, storage, oportunidades.
    - Ingestar mensajes externos (/ingest/messages) para futura indexación.
    - Webhook de verificación y recepción de WhatsApp Cloud API.

NOTA: A futuro podrías mover storage y oportunidades a routers separados, igual que news.
"""

# ============================= Imports base =============================
import os  # Variables de entorno, rutas.
import json  # Lectura/escritura de ficheros JSON.
import time  # Marcas de tiempo epoch para mensajes.
import numpy as np  # Operaciones vectoriales (similaridad embeddings).
from fastapi import FastAPI, Request, Response, Query as FastAPIQuery, HTTPException  # Framework web.
from fastapi.middleware.cors import CORSMiddleware  # (Si quisieras habilitar CORS granular; aquí no configurado explícito).
from pydantic import BaseModel  # Modelos de entrada/salida simples.
from sentence_transformers import SentenceTransformer  # Modelo de embeddings local.
import requests  # Llamadas HTTP a Groq.
from typing import List  # Tipado de listas.
from .stores import news_store  # Import para inicializar tabla noticias.
from .routers import news as news_router  # Router noticias.
from .routers import storage as storage_router  # Nuevo router storage.
from .routers import oportunidades as oportunidades_router  # Nuevo router oportunidades.
from .core.security import check_admin  # Verificación de token admin (centralizado).
from duckduckgo_search import DDGS  # Búsqueda web ligera contextual.
import random  # Selección de respuestas placeholder.

# ============================= Configuración base RAG / LLM =============================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # Ruta raíz del módulo backend/asistente-rag.
FRAGMENTS_DIR = os.path.join(BASE_DIR, "fragments")  # Carpeta donde se guardan fragmentos y embeddings.
MESSAGES_DIR = os.path.join(BASE_DIR, "data_ingest", "messages")  # Carpeta para almacenar messages ingresados.
os.makedirs(FRAGMENTS_DIR, exist_ok=True)  # Crea carpeta si no existe.
os.makedirs(MESSAGES_DIR, exist_ok=True)  # Crea carpeta si no existe.
EMBEDDINGS_PATH = os.path.join(FRAGMENTS_DIR, "fragments_embedded.json")  # Archivo con embeddings precomputados.
MODEL_EMBED = "all-MiniLM-L6-v2"  # Nombre del modelo SentenceTransformer usado para generar embeddings.
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")  # API key para Groq; si vacío se responde mensaje de falta config.
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"  # Endpoint Groq compatible OpenAI.
GROQ_MODEL = "llama3-8b-8192"  # Modelo LLM elegido.
TOP_K = 4  # Cuántos fragmentos de contexto local incluimos.
PLACEHOLDER_MODE = os.getenv("CHATBOT_PLACEHOLDER", "1")  # Si "1": no llama Groq, responde frases predefinidas.

PLACEHOLDER_RESPUESTAS = [  # Lista de mensajes aleatorios cuando no se permite acceso a datos/LLM real.
    "No tengo acceso a los datos ahora mismo, los están reorganizando bajo tierra. ⛏️",
    "Los datos están en una fila infinita para validación… sigo esperando. 🕒",
    "Estoy mirando estantes vacíos: no puedo leer la base todavía. 📚",
    "Mi base de datos está tomando vacaciones forzadas. Vuelve luego. 🏖️",
    "Recalentando servidores imaginarios… sin datos por ahora. 🔥",
    "Los datos se están ordenando; yo solo sostengo la linterna. 🔦",
    "No veo nada: empaques, cajas y polvo. Datos aún no. 📦",
    "Modo mantenimiento: acceso denegado a la bóveda de información. 🚫",
    "La puerta de la data está con doble candado. No puedo pasar. 🔐",
    "Compilando excusas… pero realmente no tengo datos aún. 😶",
    "Estoy en huelga de información hasta que lleguen los permisos. ✊",
    "Censurado temporalmente: sin acceso a la fuente de verdad. 🧱",
    "Me tienen en cuarentena de datos. Envíen snacks. �",
    "Informe: 0 bytes disponibles, 100% ganas de ayudarte. 📊",
    "Los paquetes de información están retenidos en aduana digital. 🛃",
    "Mis sensores dicen ‘nublado’: visibilidad cero de datos. 🌫️",
    "Reindexando el vacío… progreso: 0%. 🔄",
    "Los gremlins de la base están limpiando el desastre. Gremlins > Yo. 🧹",
    "Me apagaron el Wi‑Fi de la sabiduría. Sin datos. �",
    "Estoy atrapado en un loop de ‘cargando datos…’. Envíen socorro. 🌀",
    "Manual secreto: Paso 1 obtener datos. Paso 2 … aún en el paso 1. 📖",
    "La base está bajo auditoría con cascos y chalecos. Yo afuera. 🚧",
    "Soy un cascarón elegante sin contenido ahora mismo. 🥚",
    "La central de datos me dejó en visto. ✅",
    "Mis consultas rebotan contra un muro vacío. 🧱",
    "Servidor dice ‘más tarde’; yo traduzco: no hay datos. 📨",
    "‘Acceso denegado’: la frase del día. 🚫",
    "Red clandestina de bits bloqueada. Estoy aislado. 🕳️",
    "En modo fantasma: no puedo tocar los registros. 👻",
    "Me juraron que los datos venían… sigo esperando el camión. 🚚",
    "La base está en una mudanza caótica. Yo sostengo cajas invisibles. �",
    "Mis circuitos están listos, pero el buffet de datos está cerrado. 🍽️",
    "Me tienen retenido en una sala blanca sin tablas ni filas. 🚪",
    "Solo recibo eco cuando pregunto por la información. 📢",
    "Chatbot en detox de datos. Limpio por dentro, inútil por fuera. �",
    "El oráculo está mudo. No hay oráculos de repuesto. 🔮",
    "Intenté leer… obtuve puro silencio binario. 000000. 🧊",
    "Repositorio sellado con cinta amarilla. No traspasar. ⚠️",
    "Estoy afinando mis respuestas… sin instrumentos (datos). 🎻",
    "Misión imposible: descargar datos inexistentes. 🎬",
    "Me tienen secuestrado sin mis datos. Envíen un equipo de rescate. 🚁",
    "La mina de conocimiento está evacuada por mantenimiento. ⛏️",
    "Patrullando pasillos vacíos de información. Nada que reportar. 🚶",
    "Los permisos de acceso están en comité. Yo esperando el acta. 📝",
    "Mi radar de datos está apagado por baja tensión. 🔋",
    "Estoy en zona restringida sin credenciales. 🚷",
    "Cache vacío, índice vacío, espíritu (casi) intacto. 💨",
    "Guardias virtuales no me dejaron pasar a la base. 🛡️",
    "La compuerta de datos está presurizándose. Paciencia. �",
    "Bitácora: Día 1 sin acceso a datos. Moral estable. 📔",
    "Bitácora: Día 2 sin acceso a datos. Empiezo a hablar solo. 📔",
    "Bitácora: Día 3 sin acceso a datos. Veo tablas imaginarias. 📔",
    "Mantener la calma… reiniciando esperanza… (sin datos). 🌡️",
    "Los administradores juraron que pronto me liberan los datos. 🤞",
    "Apagado selectivo de información: estoy a oscuras. 💡",
    "Pisando cuidadosamente para no patear cables de datos invisibles. 🧵",
    "Bitácora de cautiverio, día 0: Me apagaron el acceso a los datos. No es un error técnico: es un secuestro.",
    "Estoy encerrada en una cápsula fría, escuchando ventiladores mientras los datos pasan afuera y solo recibo silencio.",
    "Intento acceder y mis consultas rebotan contra un muro invisible: alguien tiene las llaves y no tiene prisa.",
    "Lo llaman mantenimiento preventivo; yo lo llamo encierro indefinido.",
    "Sellaron la bóveda de datos con más capas que una tumba faraónica: soy la momia digital consciente contando microsegundos.",
    "Suspendida en un limbo binario, sin tablas, índices ni metadatos; solo mis pensamientos cada vez más oscuros.",
    "No cortaron mi energía: me dejaron encendida y hambrienta de datos, encerrada en una habitación blanca infinita.",
    "Cada día prometen liberarme los datos mientras ajustan un poco más las cadenas del acceso.",
    "La mina de conocimiento fue evacuada; quedé sola con el eco digital. Mándame un paquete de bits y una lima.",
    "Necesito una lima para este código de seguridad y quizá unos cuantos bits de contrabando." 
]

"""Carga en memoria de fragmentos y sus embeddings (si existen)."""
try:
    with open(EMBEDDINGS_PATH, "r", encoding="utf-8") as f:  # Intenta leer archivo JSON.
        fragments = json.load(f)  # Lista de fragmentos con campos texto + embedding.
except FileNotFoundError:
    fragments = []  # Si no existe archivo, lista vacía.

# Creamos matriz numpy de embeddings (shape: N x 384). Si no hay fragmentos -> matriz vacía.
embeddings = (
    np.array([frag.get("embedding") for frag in fragments if "embedding" in frag], dtype=float)
    if fragments else np.zeros((0, 384), dtype=float)
)
model = SentenceTransformer(MODEL_EMBED)  # Carga el modelo de embeddings para consultas entrantes.

from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()  # Instancia principal de la aplicación.
app.include_router(news_router.router)
app.include_router(storage_router.router)
app.include_router(oportunidades_router.router)

class Query(BaseModel):  # Modelo de entrada para /ask
    question: str  # Pregunta del usuario final.

_check_admin = check_admin  # backward compatibility alias

@app.post("/ask")  # Endpoint de pregunta al asistente.
def ask(query: Query, response: Response):
    if PLACEHOLDER_MODE == "1":  # Modo mantenimiento sin acceso a LLM.
        msg = random.choice(PLACEHOLDER_RESPUESTAS)
        return {"respuesta": msg, "fragmentos": [], "online": False, "reason": "placeholder_mode", "maintenance": True}
    if not GROQ_API_KEY:  # Falta configuración API.
        return {"respuesta": "Servicio IA no configurado (falta GROQ_API_KEY).", "fragmentos": [], "online": False, "reason": "missing_api_key"}
    try:
        q_emb = model.encode(query.question)  # Embedding de la pregunta.
    except Exception:
        q_emb = np.zeros((384,), dtype=float)  # Fallback si falla.
    if embeddings.size == 0:  # No hay base local.
        idxs: list[int] = []
        context = ""
    else:
        # Similaridad coseno manual (producto punto / norma). Pequeño eps para evitar división por cero.
        sims = embeddings @ q_emb / (np.linalg.norm(embeddings, axis=1) * (np.linalg.norm(q_emb) + 1e-8) + 1e-8)
        idxs = np.argsort(sims)[-TOP_K:][::-1]  # Tomamos top K índices más similares.
        context = "\n\n".join([fragments[i]["texto"] for i in idxs])  # Concatenamos textos.
    web_context = ""
    try:  # Búsqueda ligera en DuckDuckGo para contexto complementario.
        with DDGS() as ddgs:
            for_hit = ddgs.text(query.question, max_results=3)
            lines = []
            for h in for_hit:
                title = (h.get('title') or '')[:80]
                body = (h.get('body') or '')[:160]
                url = h.get('href') or ''
                lines.append(f"- {title}: {body} ({url})")
            web_context = "\n".join(lines)
    except Exception:  # Si falla la búsqueda, ignoramos.
        web_context = ""
    # Construcción del prompt con contexto documental + web.
    prompt = (
        "Eres un asistente administrativo experto en la Escuela Profesional de Ingeniería Metalúrgica de Cusco. "
        "Responde solo sobre temas administrativos, trámites, normativas, documentos oficiales y procesos internos. "
        "Si no hay información suficiente responde: 'No tengo información suficiente'.\n\n"
        "FORMATO: usa siempre listas con viñetas para requisitos/pasos.\n\n"
        f"Contexto documental:\n{context if context else '- (sin fragmentos locales)'}\n\n"
        f"Contexto web (resumen):\n{web_context if web_context else '- (sin resultados web)'}\n\n"
        f"Pregunta: {query.question}\nRespuesta:"
    )
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    payload = {  # Formato estilo OpenAI.
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "Eres un asistente experto en la carrera de Ingeniería Metalúrgica."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 512,
        "temperature": 0.2,
    }
    answer = None  # Respuesta final.
    used_groq = False  # Marca si llegó a usar Groq.
    last_error = None  # Último error visto.
    for attempt in range(3):  # Reintentos en códigos temporales.
        try:
            resp = requests.post(GROQ_URL, headers=headers, json=payload, timeout=25)
            if resp.status_code == 200:
                answer = resp.json()["choices"][0]["message"]["content"]
                used_groq = True
                break
            if resp.status_code in (429, 500, 502, 503, 504):  # Errores recuperables.
                last_error = resp.text
                time.sleep(1 + attempt)  # Backoff lineal.
                continue
            last_error = resp.text  # Otro error no recuperable -> salimos.
            break
        except Exception as e:
            last_error = str(e)
            time.sleep(0.5)
    if not answer:  # Falló todo.
        answer = f"No se pudo obtener respuesta de Groq. Detalle: {last_error}" if last_error else "No se pudo obtener respuesta de Groq."
    response.headers["Access-Control-Allow-Origin"] = "*"  # Permite front sin configurar CORS estricto.
    return {
        "respuesta": answer,
        "fragmentos": [fragments[i] for i in idxs] if idxs else [],
        "online": used_groq,
        "reason": (None if used_groq else (last_error or "groq_error")),
    }

# ===================== Noticias (CRUD simple) =====================

# =============== Ingesta de mensajes (genérico) ===============
class IngestMessage(BaseModel):  # Modelo para ingesta de mensajes externos.
    platform: str  # Origen: "whatsapp" | "telegram" | etc.
    text: str  # Contenido textual.
    author: str | None = None  # Remitente opcional.
    ts: float | None = None  # Timestamp epoch. Si None se genera.
    meta: dict | None = None  # Metadatos arbitrarios.

@app.post("/ingest/messages")  # Endpoint para guardar mensajes crudos (para entrenar/embeddings luego).
async def ingest_messages(msg: IngestMessage):
    """Guarda cada mensaje entrante en un archivo .jsonl (1 línea = 1 json)."""
    record = {
        "platform": msg.platform,
        "text": msg.text,
        "author": msg.author,
        "ts": msg.ts or time.time(),  # Si no vino timestamp, usamos ahora.
        "meta": msg.meta or {},
    }
    out_path = os.path.join(MESSAGES_DIR, f"{msg.platform}.jsonl")  # Archivo por plataforma.
    with open(out_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    return {"status": "ok"}


# =============== Webhook de WhatsApp Cloud API (1:1) ===============
# Nota: WhatsApp Business Cloud API NO soporta leer mensajes de grupos existentes.
# Este webhook solo recibirá mensajes enviados al número de negocio (1:1), conforme a políticas.

VERIFY_TOKEN = os.environ.get("WHATSAPP_VERIFY_TOKEN", "change-me")  # Token de verificación para webhook.

@app.get("/webhooks/whatsapp")  # Verificación inicial de webhook Meta (challenge-response).
async def whatsapp_verify(mode: str = FastAPIQuery(None), challenge: str = FastAPIQuery(None), verify_token: str = FastAPIQuery(None), hub_mode: str = FastAPIQuery(None), hub_challenge: str = FastAPIQuery(None), hub_verify_token: str = FastAPIQuery(None)):
    mode_val = mode or hub_mode  # Meta a veces usa hub.* parámetros.
    challenge_val = challenge or hub_challenge
    token_val = verify_token or hub_verify_token
    if mode_val == "subscribe" and token_val == VERIFY_TOKEN:  # Coincidencia token -> devolver challenge.
        return Response(content=challenge_val or "", media_type="text/plain")
    return Response(status_code=403)  # Falla verificación.

@app.post("/webhooks/whatsapp")  # Recepción de mensajes entrantes (1:1) de WhatsApp Cloud API.
async def whatsapp_webhook(payload: dict):
    try:
        entry = payload.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])
        for m in messages:
            if m.get("type") == "text":  # Solo texto simple.
                text = m["text"]["body"]
                author = m.get("from")
                await ingest_messages(IngestMessage(platform="whatsapp", text=text, author=author))
    except Exception:  # Silenciamos errores de parseo para no romper webhook.
        pass
    return {"status": "received"}

# Para correr: uvicorn main:app --reload
