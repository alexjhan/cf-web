import { z } from 'zod';

const DATE_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

// Categorías controladas que usa el frontend
export const CategoriaEnum = z.enum(['laborales','educacion_pregrado','educacion_posgrado','especializaciones']);

// Esquema extendido alineado al frontend (camelCase)
export const OportunidadCreateSchema = z.object({
  categoria: CategoriaEnum,
  titulo: z.string().min(3),
  fechaPublicacion: z.string().regex(DATE_REGEX,'Formato fecha YYYY-MM-DD'),
  requisitos: z.array(z.string()).default([]),
  beneficios: z.array(z.string()).default([]),
  activa: z.boolean().default(true),
  // Campos variables
  empresa: z.string().optional().nullable(),
  texto: z.string().optional().nullable(),
  contacto: z.string().optional().nullable(),
  institucion: z.string().optional().nullable(),
  duracion: z.string().optional().nullable(),
  tipoEstudio: z.string().optional().nullable(),
  contenido: z.string().optional().nullable(),
  fecha: z.string().regex(DATE_REGEX,'Formato fecha YYYY-MM-DD').optional().nullable()
});

export const OportunidadUpdateSchema = OportunidadCreateSchema.partial();

export type OportunidadCreate = z.infer<typeof OportunidadCreateSchema>;
export type OportunidadUpdate = z.infer<typeof OportunidadUpdateSchema>;
export interface Oportunidad extends OportunidadCreate { id: string; created_at?: string; updated_at?: string; }

// Mapeo a columnas snake_case. Se asume que la tabla tiene columnas creadas acorde:
// categoria, titulo, fecha_publicacion, requisitos (text[]), beneficios (text[]), activa (bool),
// empresa, texto, contacto, institucion, duracion, tipo_estudio, contenido, fecha (date)
export function mapOportunidadToDb(o: Partial<OportunidadCreate|OportunidadUpdate>) {
  if(!o) return {};
  return {
    categoria: o.categoria,
    titulo: o.titulo,
    fecha_publicacion: o.fechaPublicacion || o.fecha,
    requisitos: o.requisitos,
    beneficios: o.beneficios,
    activa: o.activa,
    empresa: o.empresa,
    texto: o.texto,
    contacto: o.contacto,
    institucion: o.institucion,
    duracion: o.duracion,
    tipo_estudio: o.tipoEstudio,
    contenido: o.contenido,
    fecha: o.fecha || o.fechaPublicacion
  };
}

export function mapDbToOportunidad(row: any): Oportunidad {
  return {
    id: row.id,
    categoria: row.categoria,
    titulo: row.titulo,
    fechaPublicacion: row.fecha_publicacion || row.fecha || '',
    requisitos: row.requisitos || [],
    beneficios: row.beneficios || [],
    activa: !!row.activa,
    empresa: row.empresa || null,
    texto: row.texto || null,
    contacto: row.contacto || null,
    institucion: row.institucion || null,
    duracion: row.duracion || null,
    tipoEstudio: row.tipo_estudio || row.tipoEstudio || null,
    contenido: row.contenido || null,
    fecha: row.fecha || null,
    created_at: row.created_at,
    updated_at: row.updated_at
  } as Oportunidad;
}
