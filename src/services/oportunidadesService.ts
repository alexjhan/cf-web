// Servicio para oportunidades (alineado a backend /api/oportunidades)
const API_BASE = 'https://<TU_BACKEND_RAILWAY>.railway.app'; // Cambia por tu URL real
const BASE_PATH = '/api/oportunidades';

export type OportunidadCategoria = 'laborales' | 'educacion_pregrado' | 'educacion_posgrado' | 'especializaciones';

export interface OportunidadPayloadBase {
  categoria: OportunidadCategoria;
  titulo: string;
  fechaPublicacion: string; // YYYY-MM-DD
  requisitos: string[];
  beneficios: string[];
  activa: boolean;
  // Campos flexibles según categoría
  empresa?: string; texto?: string; contacto?: string; // laborales / especializaciones
  institucion?: string; duracion?: string; tipoEstudio?: string; contenido?: string; // educación
  fecha?: string; // duplicado opcional
}
export interface Oportunidad extends OportunidadPayloadBase { id: number | string; created_at?: string; updated_at?: string; }

function authHeaders(): Record<string,string> {
  const token = (import.meta as any).env?.VITE_ADMIN_TOKEN || localStorage.getItem('adminToken') || localStorage.getItem('ADMIN_TOKEN') || '';
  return token ? { 'X-Admin-Token': token } : {};
}

export interface PaginatedOportunidades { items: Oportunidad[]; total: number; page: number; pageSize: number; }

export async function list(page=1, pageSize=30, q?: string): Promise<PaginatedOportunidades> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if(q) params.append('q', q);
  const r = await fetch(`${API_BASE + BASE_PATH}?${params.toString()}`);
  if(!r.ok) throw new Error('Error listando oportunidades');
  return r.json();
}
export async function create(payload: OportunidadPayloadBase): Promise<Oportunidad> {
  const r = await fetch(API_BASE + BASE_PATH, { method:'POST', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(payload) });
  if(!r.ok) throw new Error('Error creando oportunidad');
  return r.json();
}
export async function update(id: number|string, payload: Partial<OportunidadPayloadBase>): Promise<Oportunidad> {
  const r = await fetch(API_BASE + BASE_PATH + '/' + id, { method:'PUT', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(payload) });
  if(!r.ok) throw new Error('Error actualizando oportunidad');
  return r.json();
}
export async function remove(id: number|string) {
  const r = await fetch(API_BASE + BASE_PATH + '/' + id, { method:'DELETE', headers:{ ...authHeaders() } });
  if(!r.ok) throw new Error('Error eliminando oportunidad');
  return r.json();
}
