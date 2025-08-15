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
from . import news_store

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

"""Carga segura de fragments y embeddings si existen; si no, inicia vacíos"""
try:
    with open(EMBEDDINGS_PATH, "r", encoding="utf-8") as f:
        fragments = json.load(f)
except FileNotFoundError:
    fragments = []

embeddings = np.array([frag["embedding"] for frag in fragments]) if fragments else np.zeros((0, 384), dtype=float)
model = SentenceTransformer(MODEL_EMBED)

from fastapi.responses import JSONResponse
app = FastAPI()

# Endpoint de salud para monitoreo
@app.get("/health")
async def health_check():
    """Endpoint de salud para verificar que el API está funcionando"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "RAG API Metalurgia",
        "fragments_loaded": len(fragments),
        "embeddings_shape": embeddings.shape if embeddings.size > 0 else [0, 0]
    }

# Endpoint global para OPTIONS (preflight CORS)
@app.options("/{rest_of_path:path}")
async def options_handler(rest_of_path: str):
    return JSONResponse(content={}, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*"
    })

# Permitir CORS para el frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Query(BaseModel):
    question: str

@app.post("/ask")
def ask(query: Query, response: Response):
    # 1. Embedding de la pregunta
    q_emb = model.encode(query.question)
    # 2. Similaridad coseno (manejar vacío)
    if embeddings.size == 0:
        idxs = []
        context = ""
    else:
        sims = embeddings @ q_emb / (np.linalg.norm(embeddings, axis=1) * np.linalg.norm(q_emb) + 1e-8)
        idxs = np.argsort(sims)[-TOP_K:][::-1]
        context = "\n\n".join([fragments[i]["texto"] for i in idxs])
    # Buscar en la web (DuckDuckGo)
    # web_results = buscar_web_duckduckgo(query.question)
    # web_context = "\n\n".join([f"{r['titulo']}: {r['snippet']} ({r['url']})" for r in web_results])
    web_context = ""  # Quitar o adaptar según nueva estructura
    # 3. Prompt para el LLM
    prompt = f"""Eres un asistente administrativo experto en la Escuela Profesional de Ingeniería Metalúrgica de Cusco. Responde únicamente sobre temas administrativos, trámites, normativas, documentos oficiales, procesos internos y consultas relacionadas con la gestión de la escuela profesional. Utiliza solo la información de los documentos oficiales proporcionados y, si es relevante, complementa con información web confiable.

Tu respuesta debe ser precisa, específica y directamente relacionada con la pregunta. Si la pregunta es ambigua o falta información, solicita detalles adicionales de manera formal y clara. Si no sabes la respuesta, di 'No tengo información suficiente'.

IMPORTANTE: Si la respuesta incluye requisitos, pasos, documentos, procesos o listas, debes presentarlos OBLIGATORIAMENTE usando listas con viñetas o numeradas, y NUNCA en párrafos largos. No incluyas texto en bloque para estos casos. Ejemplo:

- Requisito 1
- Requisito 2
- Requisito 3

Contexto de documentos oficiales:
{context}

Contexto web relevante:
{web_context}

Pregunta: {query.question}
Respuesta:"""
    # 4. Llama a Groq Cloud
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "Eres un asistente experto en la carrera de Ingeniería Metalúrgica."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 512,
        "temperature": 0.2
    }
    resp = requests.post(GROQ_URL, headers=headers, json=data)
    if resp.status_code == 200:
        answer = resp.json()["choices"][0]["message"]["content"]
    else:
        answer = f"Error al consultar Groq: {resp.text}"
    # Forzar header CORS en la respuesta (debug)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return {"respuesta": answer, "fragmentos": [fragments[i] for i in idxs] if idxs else []}

# ===================== Noticias (CRUD simple) =====================
class NewsIn(BaseModel):
    id: str | None = None
    fecha: str
    titulo: str
    descripcionCorta: str
    descripcionLarga: str
    autor: str
    categoria: List[str]
    imagen: str | None = None
    destacada: bool | None = False
    vistas: int | None = 0

@app.get('/news')
def list_all_news():
    return news_store.list_news()

@app.get('/news/{nid}')
def get_one_news(nid: str):
    # Incrementar vistas al acceder
    n = news_store.increment_views(nid)
    if not n:
        raise HTTPException(status_code=404, detail='Noticia no encontrada')
    return n

@app.post('/news')
def create_news(item: NewsIn):
    try:
        stored = news_store.upsert_news(item.dict())
        return stored
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put('/news/{nid}')
def update_news(nid: str, item: NewsIn):
    existing = news_store.get_news(nid)
    if not existing:
        raise HTTPException(status_code=404, detail='Noticia no encontrada')
    data = item.dict()
    if not data.get('id'):
        data['id'] = nid
    stored = news_store.upsert_news(data)
    return stored

@app.delete('/news/{nid}')
def remove_news(nid: str):
    ok = news_store.delete_news(nid)
    if not ok:
        raise HTTPException(status_code=404, detail='Noticia no encontrada')
    return {"status": "deleted", "id": nid}

@app.post('/news/{nid}/views')
def add_view(nid: str):
    n = news_store.increment_views(nid)
    if not n:
        raise HTTPException(status_code=404, detail='Noticia no encontrada')
    return {"status": "ok", "vistas": n['vistas']}

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
