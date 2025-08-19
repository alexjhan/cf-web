import { useEffect, useState } from 'react';
import * as api from '../../../services/documentosService';
import { useAuth } from '../../../hooks/useAuth';

interface ListState { items: api.Documento[]; total: number; page: number; pageSize: number; }

const tipos: Array<api.DocumentoPayload['tipo']> = ['academico','administrativo','reglamento','formulario','guia','convenio'];

const emptyForm: api.DocumentoPayload = {
  titulo: '',
  subtitulo: '',
  tipo: 'academico',
  fecha: new Date().toISOString().slice(0,10),
  peso: '',
  link: ''
};

export default function AdminDocumentos() {
  const { isAuthenticated } = useAuth();
  const [list, setList] = useState<ListState>({ items: [], total: 0, page:1, pageSize: 30 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [form, setForm] = useState<api.DocumentoPayload>({...emptyForm});
  const [editingId, setEditingId] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  async function load(page=1) {
    setLoading(true); setError(null);
    try {
      const data = await api.list(page, list.pageSize, search || undefined);
      setList(data);
    } catch(e:any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ load(1); }, []); // inicial
  useEffect(()=>{ const t = setTimeout(()=> load(1), 400); return ()=> clearTimeout(t); }, [search]);

  function onChange<K extends keyof api.DocumentoPayload>(key: K, value: api.DocumentoPayload[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm({...emptyForm});
  }

  async function startEdit(id: string) {
    setError(null);
    try {
      const d = await api.get(id);
      if (!d) { setError('No encontrado'); return; }
      const { titulo, subtitulo, tipo, fecha, peso, link } = d;
      setForm({ titulo, subtitulo, tipo: tipo as any, fecha, peso, link });
      setEditingId(id);
    } catch(e:any) { setError(e.message); }
  }

  async function save() {
    setSaving(true); setError(null);
    try {
      // Validación mínima frontend
      if (!form.titulo.trim()) throw new Error('Título requerido');
      if (!form.link.trim()) throw new Error('Link requerido');
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(form.fecha)) throw new Error('Fecha inválida');
      if (editingId) {
        await api.update(editingId, form); // enviamos todo
      } else {
        await api.create(form);
      }
      await load(1);
      startCreate();
    } catch(e:any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar documento?')) return;
    try { await api.remove(id); await load(list.page); } catch(e:any) { setError(e.message); }
  }

  if (!isAuthenticated) return <div className="p-6 text-center text-red-400">No autorizado</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Administrar Documentos</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Buscar..." className="bg-gray-800 px-3 py-2 rounded border border-gray-600 flex-1" />
        <button onClick={startCreate} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">Nuevo</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Lista */}
        <div className="md:col-span-2">
          {loading && <div className="text-sm text-gray-400">Cargando...</div>}
          {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
          <table className="w-full text-sm border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Peso</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map(d => (
                <tr key={d.id} className="border-t border-gray-700 hover:bg-gray-800/60">
                  <td className="p-2">{d.titulo}</td>
                  <td className="p-2 capitalize">{d.tipo}</td>
                  <td className="p-2">{d.fecha}</td>
                  <td className="p-2">{d.peso}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={()=> startEdit(d.id)} className="px-2 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs">Editar</button>
                    <button onClick={()=> remove(d.id)} className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs">Eliminar</button>
                  </td>
                </tr>
              ))}
              {list.items.length === 0 && !loading && (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400">Sin documentos</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulario */}
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          <h2 className="font-semibold mb-3 text-lg">{editingId ? 'Editar' : 'Nuevo'} Documento</h2>
          <div className="flex flex-col gap-3">
            <input className="bg-gray-800 px-3 py-2 rounded border border-gray-600" placeholder="Título" value={form.titulo} onChange={e=> onChange('titulo', e.target.value)} />
            <input className="bg-gray-800 px-3 py-2 rounded border border-gray-600" placeholder="Subtítulo" value={form.subtitulo || ''} onChange={e=> onChange('subtitulo', e.target.value)} />
            <select className="bg-gray-800 px-3 py-2 rounded border border-gray-600" value={form.tipo} onChange={e=> onChange('tipo', e.target.value as any)}>
              {tipos.map(t=> <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="date" className="bg-gray-800 px-3 py-2 rounded border border-gray-600" value={form.fecha} onChange={e=> onChange('fecha', e.target.value)} />
            <input className="bg-gray-800 px-3 py-2 rounded border border-gray-600" placeholder="Peso (ej: 1.2 MB)" value={String(form.peso)} onChange={e=> onChange('peso', e.target.value)} />
            <input className="bg-gray-800 px-3 py-2 rounded border border-gray-600" placeholder="Link" value={form.link} onChange={e=> onChange('link', e.target.value)} />
            <div className="flex gap-2 mt-2">
              <button disabled={saving} onClick={save} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 px-3 py-2 rounded">{saving ? 'Guardando...' : 'Guardar'}</button>
              {editingId && <button type="button" onClick={startCreate} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded">Cancelar</button>}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
