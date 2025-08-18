import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as controller from '../src/controllers/noticiasController';
import * as supa from '../src/services/supabaseService';

// Mock supabase service
vi.mock('../src/services/supabaseService', () => ({
  listTable: vi.fn(async () => ({ items: [{ id: '1', titulo: 'Test', contenido: 'Body' }], total: 1, page: 1, pageSize: 20 })),
  getById: vi.fn(async (_t: string, id: string) => id === '1' ? ({ id: '1', titulo: 'Test', contenido: 'Body' }) : null),
  insertOne: vi.fn(async (_t: string, payload: any) => ({ id: '1', ...payload })),
  updateOne: vi.fn(async (_t: string, id: string, payload: any) => ({ id, ...payload })),
  deleteOne: vi.fn(async () => true)
}));

function mockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.status = (c: number) => { res.statusCode = c; return res; };
  res.jsonData = undefined;
  res.json = (d: any) => { res.jsonData = d; return res; };
  return res;
}

function noopNext(e?: any) { if (e) throw e; }

describe('noticiasController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('lista noticias', async () => {
    const req: any = { query: {} };
    const res = mockRes();
    await controller.listar(req, res, noopNext);
    expect(res.jsonData.total).toBe(1);
  });

  it('crea noticia válida', async () => {
    const req: any = { body: { titulo: 'Hola', contenido: 'Contenido largo' } };
    const res = mockRes();
    await controller.crear(req, res, noopNext);
    expect(res.statusCode).toBe(201);
    expect(res.jsonData.id).toBeDefined();
  });

  it('rechaza noticia inválida', async () => {
    const req: any = { body: { titulo: 'Hi', contenido: 'a' } }; // falla validaciones
    const res = mockRes();
    let threw = false;
    try { await controller.crear(req, res, (e)=>{ if(e) threw = true; }); } catch { threw = true; }
    expect(threw).toBe(true);
  });

  it('retorna 404 si no existe', async () => {
    const req: any = { params: { id: 'x' } };
    const res = mockRes();
    await controller.obtener(req, res, noopNext);
    expect(res.statusCode).toBe(404);
  });
});
