// Servicio para consumir API de documentos
const API_BASE = 'https://cf-backend-production-38d0.up.railway.app/api/documentos';
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


  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (q) params.append('q', q);
  const r = await fetch(`${API_BASE}?${params.toString()}`);
  if (!r.ok) throw new Error('Error listando documentos');
  return r.json();
}


  const r = await fetch(`${API_BASE}/${id}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('Error obteniendo documento');
  return r.json();
}


  const r = await fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('Error creando documento');
  return r.json();
}


  const r = await fetch(`${API_BASE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('Error actualizando documento');
  return r.json();
}


export async function remove(id: string) {
  const r = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!r.ok) throw new Error('Error eliminando documento');
  return r.json();
}
