// Controlador de documentos
import { Request, Response, NextFunction } from 'express';
import { DocumentoCreateSchema, DocumentoUpdateSchema } from '../domain/documento';
import * as supa from '../services/supabaseService';

// Tabla documentos en Supabase
const TABLE = 'documentos';

// GET listado paginado
export async function listar(req: Request, res: Response, next: NextFunction) {
	try { const page = Number(req.query.page)||1; const pageSize = Number(req.query.pageSize)||20; const q = req.query.q as string|undefined; res.json(await supa.listTable(TABLE, page, pageSize, q)); } catch (e) { next(e); }
}
// GET detalle
export async function obtener(req: Request, res: Response, next: NextFunction) {
	try { const d = await supa.getById(TABLE, req.params.id); if (!d) return res.status(404).json({ error: 'not_found' }); res.json(d); } catch (e) { next(e); }
}
// POST crear documento
export async function crear(req: Request, res: Response, next: NextFunction) {
	try { const parsed = DocumentoCreateSchema.parse(req.body); const created = await supa.insertOne(TABLE, parsed); res.status(201).json(created); } catch (e) { next(e); }
}
// PUT actualizar documento
export async function actualizar(req: Request, res: Response, next: NextFunction) {
	try { const parsed = DocumentoUpdateSchema.parse(req.body); const updated = await supa.updateOne(TABLE, req.params.id, parsed); res.json(updated); } catch (e) { next(e); }
}
// DELETE eliminar documento
export async function eliminar(req: Request, res: Response, next: NextFunction) {
	try { await supa.deleteOne(TABLE, req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
}
