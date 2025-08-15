import json
import os
import threading
from datetime import datetime
from typing import List, Dict, Any, Optional

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, 'news.json')
_lock = threading.Lock()

SEED_NEWS: List[Dict[str, Any]] = [
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

def _save(data: List[Dict[str, Any]]):
    tmp = DATA_PATH + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, DATA_PATH)

def _load() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_PATH):
        _save(SEED_NEWS)
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
    except Exception:
        pass
    return []

def list_news() -> List[Dict[str, Any]]:
    with _lock:
        return _load()

def get_news(nid: str) -> Optional[Dict[str, Any]]:
    with _lock:
        for n in _load():
            if n.get('id') == nid:
                return n
    return None

def slug(text: str) -> str:
    import unicodedata, re
    t = unicodedata.normalize('NFD', text.lower())
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    t = re.sub(r'[^a-z0-9\s-]', '', t)
    t = re.sub(r'\s+', '-', t).strip('-')
    return t[:60]

def upsert_news(item: Dict[str, Any]) -> Dict[str, Any]:
    required = ["titulo", "fecha", "descripcionCorta", "descripcionLarga", "autor", "categoria"]
    for r in required:
        if r not in item:
            raise ValueError(f"Campo requerido faltante: {r}")
    if not item.get('id'):
        base_slug = slug(item['titulo'])
        item['id'] = f"{item['fecha']}-{base_slug}-{int(datetime.utcnow().timestamp())}"
    with _lock:
        data = _load()
        idx = next((i for i, n in enumerate(data) if n.get('id') == item['id']), None)
        if idx is None:
            data.append(item)
        else:
            data[idx] = item
        _save(data)
    return item

def delete_news(nid: str) -> bool:
    with _lock:
        data = _load()
        new_data = [n for n in data if n.get('id') != nid]
        if len(new_data) == len(data):
            return False
        _save(new_data)
    return True
