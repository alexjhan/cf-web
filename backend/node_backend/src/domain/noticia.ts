import { z } from 'zod';

// Fecha simple YYYY-MM-DD
const DATE_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

// Esquema alineado al frontend (campos camelCase) que luego se mapea a columnas snake_case en DB
export const NoticiaCreateSchema = z.object({
  fecha: z.string().regex(DATE_REGEX, 'Formato fecha YYYY-MM-DD'),
  titulo: z.string().min(3),
  descripcionCorta: z.string().min(3),
  descripcionLarga: z.string().min(5),
  autor: z.string().min(2),
  categoria: z.array(z.string()).min(1), // se almacenará como text[] (categorias)
  imagen: z.string().optional().nullable(), // URL pública o data URI (se podría validar)
  destacada: z.boolean().optional().default(false),
  vistas: z.number().int().nonnegative().optional().default(0)
});

export const NoticiaUpdateSchema = NoticiaCreateSchema.partial();

export type NoticiaCreate = z.infer<typeof NoticiaCreateSchema>;
export type NoticiaUpdate = z.infer<typeof NoticiaUpdateSchema>;
export interface Noticia extends NoticiaCreate { id: string; created_at?: string; updated_at?: string; }

// Helpers de mapeo (frontend -> DB / DB -> frontend)
export function mapNoticiaToDb(n: Partial<NoticiaCreate | NoticiaUpdate>) {
  if(!n) return {};
  return {
    fecha: n.fecha,
    titulo: n.titulo,
    descripcion_corta: (n as any).descripcionCorta,
    descripcion_larga: (n as any).descripcionLarga,
    autor: n.autor,
    categorias: Array.isArray(n.categoria)? n.categoria : undefined,
    imagen: n.imagen,
    destacada: n.destacada,
    vistas: n.vistas
  };
}

export function mapDbToNoticia(row: any): Noticia {
  return {
    id: row.id,
    fecha: row.fecha || row.fecha_publicacion || '',
    titulo: row.titulo,
    descripcionCorta: row.descripcion_corta || row.descripcionCorta || '',
    descripcionLarga: row.descripcion_larga || row.descripcionLarga || row.contenido || '',
    autor: row.autor || row.fuente || '',
    categoria: row.categorias || row.categoria ? (Array.isArray(row.categorias) ? row.categorias : [row.categoria]) : [],
    imagen: row.imagen || row.url || null,
    destacada: !!row.destacada,
    vistas: typeof row.vistas === 'number'? row.vistas : (row.vistas ?? 0),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}
