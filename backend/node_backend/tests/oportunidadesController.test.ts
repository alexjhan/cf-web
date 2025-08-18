import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as controller from '../src/controllers/oportunidadesController';

vi.mock('../src/services/supabaseService', () => ({
  listTable: vi.fn(async () => ({ items: [{ id: '1', titulo: 'Beca', descripcion: 'Desc' }], total: 1, page: 1, pageSize: 20 })),
  getById: vi.fn(async (_t: string, id: string) => id === '1' ? ({ id: '1', titulo: 'Beca', descripcion: 'Desc' }) : null),
  insertOne: vi.fn(async (_t: string, payload: any) => ({ id: '1', ...payload })),
  updateOne: vi.fn(async (_t: string, id: string, payload: any) => ({ id, ...payload })),
  deleteOne: vi.fn(async () => true)
}));

function mockRes() { const r: any = {}; r.statusCode=200; r.status=(c:number)=>{r.statusCode=c; return r;}; r.json=(d:any)=>{r.jsonData=d; return r;}; return r; }
function noopNext(e?: any) { if (e) throw e; }

describe('oportunidadesController', () => {
  beforeEach(()=>{ vi.clearAllMocks(); });
  it('lista oportunidades', async () => { const res = mockRes(); await controller.listar({ query:{} } as any, res, noopNext); expect(res.jsonData.total).toBe(1); });
});
