// Servicio para consumir API de documentos
const API_BASE = 'https://cf-backend-production-38d0.up.railway.app/api/storage';
// Token se obtiene dinámicamente cuando se arma cada request


export interface DocumentoPayload {
  titulo: string;
  subtitulo?: string;
  tipo: ('academico'|'administrativo'|'reglamento'|'formulario'|'guia'|'convenio') | ('academico'|'administrativo'|'reglamento'|'formulario'|'guia'|'convenio')[];
  fecha: string; // YYYY-MM-DD
  link: string;
}

export interface Documento extends DocumentoPayload {
  id: string;
  created_at: string;
  updated_at?: string;
}

function authHeaders(): Record<string,string> {
  const token = (import.meta as any).env?.VITE_ADMIN_TOKEN || localStorage.getItem('adminToken') || '';
  return token ? { 'X-Admin-Token': token } : {};
}


export async function list(page=1, pageSize=30, q?: string) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize), tipo: 'documento' });
  if (q) params.append('q', q);
  const r = await fetch(`${API_BASE}?${params.toString()}`);
  if (!r.ok) throw new Error('Error listando documentos');
  const data = await r.json();
  // Adaptar los items para exponerlos como Documento
  const items = (data.items || []).map((item: any) => ({
    ...item.data,
    id: item.id,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
  return { ...data, items };
}


export async function get(id: string) {
  const r = await fetch(`${API_BASE}/${id}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('Error obteniendo documento');
  const item = await r.json();
  if (!item || !item.data) return null;
  return {
    ...item.data,
    id: item.id,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}


export async function create(payload: DocumentoPayload) {
  const r = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ tipo: 'documento', data: payload })
  });
  if (!r.ok) throw new Error('Error creando documento');
  const item = await r.json();
  return {
    ...item.data,
    id: item.id,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}


export async function update(id: string, payload: Partial<DocumentoPayload>) {
  const r = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ tipo: 'documento', data: payload })
  });
  if (!r.ok) throw new Error('Error actualizando documento');
  const item = await r.json();
  return {
    ...item.data,
    id: item.id,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}


export async function remove(id: string) {
  const r = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!r.ok) throw new Error('Error eliminando documento');
  return r.json();
}
