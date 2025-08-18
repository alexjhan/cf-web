// Controlador de oportunidades
import { Request, Response, NextFunction } from 'express';
import { OportunidadCreateSchema, OportunidadUpdateSchema, mapOportunidadToDb, mapDbToOportunidad } from '../domain/oportunidad';
import * as supa from '../services/supabaseService';

// Tabla en Supabase
const TABLE = 'oportunidades';

// GET listado paginado
export async function listar(req: Request, res: Response, next: NextFunction) {
	try {
		const page = Number(req.query.page)||1; const pageSize = Number(req.query.pageSize)||20; const q = req.query.q as string|undefined;
		const result = await supa.listTable<any>(TABLE, page, pageSize, q);
		res.json({ ...result, items: result.items.map(mapDbToOportunidad) });
	} catch (e) { next(e); }
}
// GET detalle
export async function obtener(req: Request, res: Response, next: NextFunction) {
	try { const d = await supa.getById<any>(TABLE, req.params.id); if (!d) return res.status(404).json({ error: 'not_found' }); res.json(mapDbToOportunidad(d)); } catch (e) { next(e); }
}
// POST crear
export async function crear(req: Request, res: Response, next: NextFunction) {
	try { const parsed = OportunidadCreateSchema.parse(req.body); const created = await supa.insertOne<any>(TABLE, mapOportunidadToDb(parsed)); res.status(201).json(mapDbToOportunidad(created)); } catch (e) { next(e); }
}
// PUT actualizar
export async function actualizar(req: Request, res: Response, next: NextFunction) {
	try { const parsed = OportunidadUpdateSchema.parse(req.body); const updated = await supa.updateOne<any>(TABLE, req.params.id, mapOportunidadToDb(parsed)); res.json(mapDbToOportunidad(updated)); } catch (e) { next(e); }
}
// DELETE eliminar
export async function eliminar(req: Request, res: Response, next: NextFunction) {
	try { await supa.deleteOne(TABLE, req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
}
