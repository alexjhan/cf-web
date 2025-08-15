# API backend para consultas RAG usando Groq Cloud (Llama 3) y embeddings locales
# Requiere: pip install fastapi uvicorn numpy requests sentence-transformers
import os
import json
import time
import numpy as np
from fastapi import FastAPI, Request, Response, Query as FastAPIQuery, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import requests
# from busca_web_duckduckgo import buscar_web_duckduckgo  # Ajusta el import según nueva estructura
from typing import List
from . import news_store, storage_store, oportunidades_store
from .routers import news as news_router
from duckduckgo_search import DDGS
import random

# Configuración
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/asistente-rag
FRAGMENTS_DIR = os.path.join(BASE_DIR, "fragments")
MESSAGES_DIR = os.path.join(BASE_DIR, "data_ingest", "messages")
os.makedirs(FRAGMENTS_DIR, exist_ok=True)
os.makedirs(MESSAGES_DIR, exist_ok=True)
EMBEDDINGS_PATH = os.path.join(FRAGMENTS_DIR, "fragments_embedded.json")
MODEL_EMBED = "all-MiniLM-L6-v2"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")  # Usar variable de entorno
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"
TOP_K = 4  # Número de fragmentos a enviar al LLM
PLACEHOLDER_MODE = os.getenv("CHATBOT_PLACEHOLDER", "1")  # "1" para responder siempre con mensajes fijos

PLACEHOLDER_RESPUESTAS = [
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

"""Carga segura de fragments y embeddings si existen; si no, inicia vacíos"""
try:
    with open(EMBEDDINGS_PATH, "r", encoding="utf-8") as f:
        fragments = json.load(f)
except FileNotFoundError:
    fragments = []

embeddings = np.array([frag.get("embedding") for frag in fragments if "embedding" in frag] , dtype=float) if fragments else np.zeros((0,384), dtype=float)
model = SentenceTransformer(MODEL_EMBED)

from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()
app.include_router(news_router.router)

class Query(BaseModel):
    question: str

# Admin token check (reinserted after refactor)
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
def _check_admin(request: Request):
    if not ADMIN_TOKEN:
        return
    token = request.headers.get("x-admin-token") or request.headers.get("X-Admin-Token")
    if not token:
        auth = request.headers.get("authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(None,1)[1]
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Token admin inválido")

@app.post("/ask")
def ask(query: Query, response: Response):
    if PLACEHOLDER_MODE == "1":
        msg = random.choice(PLACEHOLDER_RESPUESTAS)
        return {"respuesta": msg, "fragmentos": [], "online": False, "reason": "placeholder_mode", "maintenance": True}
    if not GROQ_API_KEY:
        return {"respuesta": "Servicio IA no configurado (falta GROQ_API_KEY).", "fragmentos": [], "online": False, "reason": "missing_api_key"}
    try:
        q_emb = model.encode(query.question)
    except Exception:
        q_emb = np.zeros((384,), dtype=float)
    if embeddings.size == 0:
        idxs: list[int] = []
        context = ""
    else:
        sims = embeddings @ q_emb / (np.linalg.norm(embeddings, axis=1) * (np.linalg.norm(q_emb) + 1e-8) + 1e-8)
        idxs = np.argsort(sims)[-TOP_K:][::-1]
        context = "\n\n".join([fragments[i]["texto"] for i in idxs])
    web_context = ""
    try:
        with DDGS() as ddgs:
            for_hit = ddgs.text(query.question, max_results=3)
            lines = []
            for h in for_hit:
                title = (h.get('title') or '')[:80]
                body = (h.get('body') or '')[:160]
                url = h.get('href') or ''
                lines.append(f"- {title}: {body} ({url})")
            web_context = "\n".join(lines)
    except Exception:
        web_context = ""
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
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "Eres un asistente experto en la carrera de Ingeniería Metalúrgica."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 512,
        "temperature": 0.2,
    }
    answer = None
    used_groq = False
    last_error = None
    for attempt in range(3):
        try:
            resp = requests.post(GROQ_URL, headers=headers, json=payload, timeout=25)
            if resp.status_code == 200:
                answer = resp.json()["choices"][0]["message"]["content"]
                used_groq = True
                break
            if resp.status_code in (429, 500, 502, 503, 504):
                last_error = resp.text
                time.sleep(1 + attempt)
                continue
            last_error = resp.text
            break
        except Exception as e:
            last_error = str(e)
            time.sleep(0.5)
    if not answer:
        answer = f"No se pudo obtener respuesta de Groq. Detalle: {last_error}" if last_error else "No se pudo obtener respuesta de Groq."
    response.headers["Access-Control-Allow-Origin"] = "*"
    return {"respuesta": answer, "fragmentos": [fragments[i] for i in idxs] if idxs else [], "online": used_groq, "reason": (None if used_groq else (last_error or "groq_error"))}

# ===================== Noticias (CRUD simple) =====================

# =============== Ingesta de mensajes (genérico) ===============
class IngestMessage(BaseModel):
    platform: str  # "whatsapp" | "telegram" | "slack" | "discord" | "web"
    text: str
    author: str | None = None
    ts: float | None = None  # epoch seconds
    meta: dict | None = None

@app.post("/ingest/messages")
async def ingest_messages(msg: IngestMessage):
    """Ingesta genérica desde conectores. Guarda en JSONL para posterior embedding."""
    record = {
        "platform": msg.platform,
        "text": msg.text,
        "author": msg.author,
        "ts": msg.ts or time.time(),
        "meta": msg.meta or {},
    }
    out_path = os.path.join(MESSAGES_DIR, f"{msg.platform}.jsonl")
    with open(out_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    return {"status": "ok"}

# ===================== Almacenamiento genérico =====================
from pydantic import BaseModel as _BM

class GenericItemIn(_BM):
    tipo: str
    data: dict
    id: str | None = None

@app.post('/storage')
def create_generic(item: GenericItemIn, request: Request):
    _check_admin(request)
    created = storage_store.create_item(item.tipo, item.data, item.id)
    return created

@app.get('/storage/{item_id}')
def get_generic(item_id: str):
    obj = storage_store.get_item(item_id)
    if not obj:
        raise HTTPException(status_code=404, detail='Item no encontrado')
    return obj

@app.put('/storage/{item_id}')
def update_generic(item_id: str, item: GenericItemIn, request: Request):
    _check_admin(request)
    upd = storage_store.update_item(item_id, item.data)
    if not upd:
        raise HTTPException(status_code=404, detail='Item no encontrado')
    return upd

@app.delete('/storage/{item_id}')
def delete_generic(item_id: str, request: Request):
    _check_admin(request)
    ok = storage_store.delete_item(item_id)
    if not ok:
        raise HTTPException(status_code=404, detail='Item no encontrado')
    return {"status": "deleted", "id": item_id}

@app.get('/storage')
def search_generic(tipo: str | None = None, q: str | None = None, page: int = 1, page_size: int = 20):
    return storage_store.search_items(tipo=tipo, q=q, page=page, page_size=page_size)

# ===================== Oportunidades =====================
class OportunidadIn(_BM):
    id: str | None = None
    titulo: str
    descripcion: str
    tipo: str  # beca|practica|concurso|otro
    fecha_publicacion: str
    fecha_cierre: str | None = None
    fuente: str | None = None
    enlace: str | None = None
    estado: str | None = None

@app.get('/oportunidades')
def list_oportunidades(q: str | None = None, tipo: str | None = None, estado: str | None = None,
                       abierta: bool | None = None, page: int = 1, page_size: int = 10):
    if any([q, tipo, estado, abierta is not None, page != 1, page_size != 10]):
        return oportunidades_store.search(q=q, tipo=tipo, estado=estado, abierta=abierta, page=page, page_size=page_size)
    return oportunidades_store.list_all()

@app.get('/oportunidades/{oid}')
def get_oportunidad(oid: str):
    item = oportunidades_store.get_one(oid)
    if not item:
        raise HTTPException(status_code=404, detail='Oportunidad no encontrada')
    return item

@app.post('/oportunidades')
def create_oportunidad(item: OportunidadIn, request: Request):
    _check_admin(request)
    try:
        return oportunidades_store.upsert(item.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put('/oportunidades/{oid}')
def update_oportunidad(oid: str, item: OportunidadIn, request: Request):
    _check_admin(request)
    data = item.dict()
    if not data.get('id'):
        data['id'] = oid
    existing = oportunidades_store.get_one(data['id'])
    if not existing:
        raise HTTPException(status_code=404, detail='Oportunidad no encontrada')
    return oportunidades_store.upsert(data)

@app.delete('/oportunidades/{oid}')
def delete_oportunidad(oid: str, request: Request):
    _check_admin(request)
    ok = oportunidades_store.delete(oid)
    if not ok:
        raise HTTPException(status_code=404, detail='Oportunidad no encontrada')
    return {"status": "deleted", "id": oid}

# =============== Webhook de WhatsApp Cloud API (1:1) ===============
# Nota: WhatsApp Business Cloud API NO soporta leer mensajes de grupos existentes.
# Este webhook solo recibirá mensajes enviados al número de negocio (1:1), conforme a políticas.

VERIFY_TOKEN = os.environ.get("WHATSAPP_VERIFY_TOKEN", "change-me")

@app.get("/webhooks/whatsapp")
async def whatsapp_verify(mode: str = FastAPIQuery(None), challenge: str = FastAPIQuery(None), verify_token: str = FastAPIQuery(None), hub_mode: str = FastAPIQuery(None), hub_challenge: str = FastAPIQuery(None), hub_verify_token: str = FastAPIQuery(None)):
    # Meta envía como hub.mode, hub.challenge, hub.verify_token
    mode_val = mode or hub_mode
    challenge_val = challenge or hub_challenge
    token_val = verify_token or hub_verify_token
    if mode_val == "subscribe" and token_val == VERIFY_TOKEN:
        return Response(content=challenge_val or "", media_type="text/plain")
    return Response(status_code=403)

@app.post("/webhooks/whatsapp")
async def whatsapp_webhook(payload: dict):
    try:
        entry = payload.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])
        for m in messages:
            if m.get("type") == "text":
                text = m["text"]["body"]
                author = m.get("from")
                await ingest_messages(IngestMessage(platform="whatsapp", text=text, author=author))
    except Exception:
        pass
    return {"status": "received"}

# Para correr: uvicorn main:app --reload
