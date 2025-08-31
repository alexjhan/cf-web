// Servicio para noticias (alineado a backend /api/noticias)
const API_BASE = 'https://cf-backend-production-38d0.up.railway.app';
const BASE_PATH = '/api/noticias';

export interface NoticiaPayload {
  fecha: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  autor: string;
  categoria: string[]; // se envía como array (backend puede aceptar string simple también)
  imagen?: string;
  destacada?: boolean;
}
export interface Noticia extends NoticiaPayload { id: string; vistas?: number; created_at?: string; updated_at?: string; }

function authHeaders(): Record<string,string> {
  const token = (import.meta as any).env?.VITE_ADMIN_TOKEN || localStorage.getItem('adminToken') || '';
  return token ? { 'X-Admin-Token': token } : {};
}

export interface PaginatedNoticias { items: Noticia[]; total: number; page: number; pageSize: number; }

export async function list(page=1, pageSize=30, q?: string): Promise<PaginatedNoticias> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if(q) params.append('q', q);
  const r = await fetch(`${API_BASE + BASE_PATH}?${params.toString()}`, { headers: { ...authHeaders() } });
  if(!r.ok) throw new Error('Error listando noticias');
  return r.json();
}
export async function get(id: string): Promise<Noticia|null> {
  const r = await fetch(API_BASE + BASE_PATH + '/' + id, { headers: { ...authHeaders() } });
  if(r.status===404) return null;
  if(!r.ok) throw new Error('Error obteniendo noticia');
  return r.json();
}
export async function create(payload: NoticiaPayload): Promise<Noticia> {
  const r = await fetch(API_BASE + BASE_PATH, { method:'POST', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(payload) });
  if(!r.ok) throw new Error('Error creando noticia');
  return r.json();
}
export async function update(id: string, payload: Partial<NoticiaPayload>): Promise<Noticia> {
  const r = await fetch(API_BASE + BASE_PATH + '/' + id, { method:'PUT', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(payload) });
  if(!r.ok) throw new Error('Error actualizando noticia');
  return r.json();
}
export async function remove(id: string) {
  const r = await fetch(API_BASE + BASE_PATH + '/' + id, { method:'DELETE', headers:{ ...authHeaders() } });
  if(!r.ok) throw new Error('Error eliminando noticia');
  return r.json();
}
