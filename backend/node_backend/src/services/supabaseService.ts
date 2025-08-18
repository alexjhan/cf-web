// Importa el cliente oficial de Supabase y el tipo SupabaseClient
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Variable singleton para reutilizar la instancia del cliente
let client: SupabaseClient | null = null;

// Retorna (o crea) el cliente Supabase usando variables de entorno
function getClient() {
  // Si ya existe, se reutiliza
  if (!client) {
    // URL base del proyecto Supabase
    const url = process.env.SUPABASE_URL;
    // Clave: prioriza service role, cae a anon para solo lectura
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    // Validación de configuración
    if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_*_KEY env vars');
    // Crea cliente sin persistir sesión en servidor
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  // Devuelve instancia
  return client;
}

// Tipo genérico de respuesta paginada
export interface Paginated<T> { items: T[]; total: number; page: number; pageSize: number; }

// Lista registros de una tabla con paginación y búsqueda simple por 'titulo'
export async function listTable<T>(table: string, page = 1, pageSize = 20, search?: string): Promise<Paginated<T>> {
  // Obtiene cliente
  const supa = getClient();
  // Construye rango (offset basado en página)
  let query = supa
    .from(table)
    .select('*', { count: 'exact' }) // pide conteo total
    .order('created_at', { ascending: false }) // orden descendente
    .range((page-1)*pageSize, page*pageSize - 1); // límites inclusive
  // Aplica filtro si hay término de búsqueda
  if (search) {
    query = query.ilike('titulo', `%${search}%`);
  }
  // Ejecuta query
  const { data, error, count } = await query;
  // Propaga error si existe
  if (error) throw error;
  // Estructura de retorno normalizada
  return { items: (data as T[]) || [], total: count || 0, page, pageSize };
}

// Recupera un registro por id (o null si no existe)
export async function getById<T>(table: string, id: string): Promise<T | null> {
  const supa = getClient();
  const { data, error } = await supa.from(table).select('*').eq('id', id).single();
  if (error) {
    // Código específico de not found de PostgREST
    if ((error as any).code === 'PGRST116') return null;
    throw error;
  }
  return data as T;
}

// Inserta un registro y devuelve la fila creada
export async function insertOne<T>(table: string, payload: any): Promise<T> {
  const supa = getClient();
  const { data, error } = await supa.from(table).insert(payload).select().single();
  if (error) throw error;
  return data as T;
}

// Actualiza un registro existente
export async function updateOne<T>(table: string, id: string, payload: any): Promise<T> {
  const supa = getClient();
  const { data, error } = await supa.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data as T;
}

// Elimina un registro por id devolviendo éxito booleano
export async function deleteOne(table: string, id: string): Promise<boolean> {
  const supa = getClient();
  const { error } = await supa.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}
