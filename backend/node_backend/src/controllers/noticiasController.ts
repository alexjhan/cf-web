// Controlador de noticias: maneja validación y llamadas al servicio Supabase
import { Request, Response, NextFunction } from 'express';
import { NoticiaCreateSchema, NoticiaUpdateSchema, mapNoticiaToDb, mapDbToNoticia } from '../domain/noticia';
import * as supa from '../services/supabaseService';

// Nombre de la tabla en Supabase
const TABLE = 'noticias';

// GET /api/noticias (lista paginada)
export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    // Normaliza parámetros de paginación y búsqueda
    const page = Number(req.query.page)||1; const pageSize = Number(req.query.pageSize)||20; const q = (req.query.q as string)||undefined;
    // Llama al servicio genérico
  const result = await supa.listTable<any>(TABLE, page, pageSize, q);
  res.json({ ...result, items: result.items.map(mapDbToNoticia) });
  } catch (err) { next(err); }
}
// GET /api/noticias/:id (obtiene detalle)
export async function obtener(req: Request, res: Response, next: NextFunction) {
  try {
  const data = await supa.getById<any>(TABLE, req.params.id);
  if (!data) return res.status(404).json({ error: 'not_found' });
  res.json(mapDbToNoticia(data));
  } catch (err) { next(err); }
}
// POST /api/noticias (crea registro) - protegido por authMiddleware en rutas
export async function crear(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida cuerpo con Zod
  const parsed = NoticiaCreateSchema.parse(req.body);
  const created = await supa.insertOne<any>(TABLE, mapNoticiaToDb(parsed));
  res.status(201).json(mapDbToNoticia(created));
  } catch (err) { next(err); }
}
// PUT /api/noticias/:id (actualiza campos parciales)
export async function actualizar(req: Request, res: Response, next: NextFunction) {
  try {
  const parsed = NoticiaUpdateSchema.parse(req.body);
  const updated = await supa.updateOne<any>(TABLE, req.params.id, mapNoticiaToDb(parsed));
  res.json(mapDbToNoticia(updated));
  } catch (err) { next(err); }
}
// DELETE /api/noticias/:id (elimina registro)
export async function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    await supa.deleteOne(TABLE, req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
}
