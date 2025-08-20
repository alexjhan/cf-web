import { useEffect, useState } from 'react';
import * as api from '../../services/documentosService';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../components/AdminLayout';
import DynamicForm, { type FieldConfig } from '../components/DynamicForm';
import AdminFormPanel from '../components/AdminFormPanel';
import { useToast } from '../../components/Toast/ToastContext';

interface ListState { items: api.Documento[]; total: number; page: number; pageSize: number; }
const tipos = ['academico','administrativo','reglamento','formulario','guia','convenio'] as const;
type TipoDocumento = typeof tipos[number];
const emptyForm = { titulo: '', subtitulo: '', tipo: ['academico'] as TipoDocumento[], fecha: new Date().toISOString().slice(0,10), link: '' };

export default function AdminDocumentosPage(){
  const { isAuthenticated } = useAuth();
  const [list, setList] = useState<ListState>({ items: [], total:0, page:1, pageSize:30 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [form, setForm] = useState<typeof emptyForm>({...emptyForm});
  const [editingId, setEditingId] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  async function load(page=1){
    setLoading(true); setError(null);
    try { const data = await api.list(page, list.pageSize, search || undefined); setList(data); }
    catch(e:any){ setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ load(1); /* eslint-disable-next-line react-hooks/exhaustive-deps */}, []);
  useEffect(()=>{ const t = setTimeout(()=> load(1), 400); return ()=> clearTimeout(t); /* eslint-disable-next-line react-hooks/exhaustive-deps */}, [search]);

  function startCreate(){ setEditingId(null); setForm({...emptyForm}); setFormError(null); setModalOpen(true); }
  async function startEdit(id: string){ setError(null); setFormError(null); try{ const d = await api.get(id); if(!d){ setError('No encontrado'); toast.push({ type:'warning', message:'Documento no encontrado'}); return;} const { titulo, subtitulo, tipo, fecha, link } = d; setForm({ titulo, subtitulo, tipo: tipo ? (Array.isArray(tipo) ? tipo.filter((t: any) => tipos.includes(t)) : [tipo].filter((t: any) => tipos.includes(t))) : [], fecha, link }); setEditingId(id); setModalOpen(true);} catch(e:any){ setError(e.message); toast.push({ type:'error', message:'Error cargando documento'});} }
  async function save(){
    setSaving(true); setFormError(null);
    try {
      if(!form.titulo.trim()) throw new Error('Título requerido');
      if(!form.link.trim()) throw new Error('Link requerido');
      if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(form.fecha)) throw new Error('Fecha inválida');
      // Validar que todos los tipos sean válidos
  const tiposValidos = Array.isArray(form.tipo) ? form.tipo.filter((t: any) => tipos.includes(t)) : [form.tipo].filter((t: any) => tipos.includes(t));
  const payload = { ...form, tipo: tiposValidos as TipoDocumento[] };
  if(editingId) await api.update(editingId, payload); else await api.create(payload);
      await load(1);
      setModalOpen(false); setEditingId(null); setForm({...emptyForm});
      toast.push({ type:'success', message: editingId? 'Documento actualizado':'Documento creado'});
    } catch(e:any){ setFormError(e.message); toast.push({ type:'error', message: e.message || 'Error guardando'}); }
    finally { setSaving(false); }
  }
  async function remove(id: string){ if(!confirm('¿Eliminar documento?')) return; try { await api.remove(id); await load(list.page); toast.push({ type:'success', message:'Documento eliminado'}); } catch(e:any){ setError(e.message); toast.push({ type:'error', message: e.message || 'Error eliminando'});} }

  if(!isAuthenticated) return <div className="p-6 text-center text-red-400">No autorizado</div>;

  const filtrados = list.items.filter(d=> (tipoFiltro==='todos' || (Array.isArray(d.tipo) ? d.tipo.includes(tipoFiltro as TipoDocumento) : d.tipo===tipoFiltro)) && (!search.trim() || [d.titulo, d.subtitulo, d.tipo].some(v=> (v||'').toString().toLowerCase().includes(search.toLowerCase()))));

  return (
    <AdminLayout title="Documentos">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={()=> setTipoFiltro('todos')} className={`px-3 py-1 rounded text-xs font-semibold ${tipoFiltro==='todos'?'bg-[#FFD700] text-black':'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}>Todos</button>
          {tipos.map(t=> (
            <button key={t} onClick={()=> setTipoFiltro(t)} className={`px-3 py-1 rounded text-xs font-semibold capitalize ${tipoFiltro===t?'bg-[#FFD700] text-black':'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}>{t}</button>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Buscar..." className="bg-gray-800/70 px-3 py-2 rounded border border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 outline-none flex-1" />
          <button onClick={startCreate} className="px-5 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-black font-semibold rounded-md text-sm tracking-wide shadow hover:from-[#FFD700] hover:to-[#FFE066] transition">Nuevo</button>
        </div>
      </div>
      <div>
        {loading && <div className="text-sm text-gray-400 mb-4">Cargando...</div>}
        {error && <div className="text-sm text-red-400 mb-4">{error}</div>}
        {!loading && filtrados.length===0 && <div className="text-center text-gray-400 py-10 border border-dashed border-gray-600 rounded-xl">Sin documentos</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map(d => (
            <div key={d.id} className="relative bg-gray-900 rounded-xl border border-gray-700 p-4 flex flex-col gap-2 shadow hover:shadow-lg hover:border-[#FFD700]/50 transition group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(d.tipo) ? d.tipo : [d.tipo]).map((t, i) => (
                    <span key={t + i} className="text-[10px] px-2 py-1 rounded-full bg-[#23232a] border border-gray-600 font-semibold tracking-wide text-gray-300 group-hover:border-[#FFD700]/60 capitalize">{t}</span>
                  ))}
                </div>
                <span className="text-[10px] px-2 py-1 rounded bg-[#23232a] border border-gray-700 text-gray-400">{d.fecha}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#FFD700] leading-snug line-clamp-2" title={d.titulo}>{d.titulo}</h3>
              {d.subtitulo && <p className="text-[11px] text-gray-400 line-clamp-2" title={d.subtitulo}>{d.subtitulo}</p>}

              <div className="flex flex-wrap gap-2 mt-2">
                <button onClick={()=> startEdit(d.id)} className="px-3 py-1.5 text-[11px] rounded bg-yellow-600 hover:bg-yellow-500 font-semibold">Editar</button>
                <a href={d.link} target="_blank" rel="noopener" className="px-3 py-1.5 text-[11px] rounded bg-blue-600 hover:bg-blue-500 font-semibold">Ver</a>
                <button onClick={()=> remove(d.id)} className="px-3 py-1.5 text-[11px] rounded bg-red-600 hover:bg-red-500 font-semibold">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AdminFormPanel
        mode="modal"
        open={modalOpen}
        onClose={()=> { setModalOpen(false); setEditingId(null); }}
        title="Documento"
        editing={!!editingId}
        onReset={()=> startCreate()}
        newLabel="Nuevo"
      >
        <DynamicForm
          fields={[
            { name:'titulo', label:'Título', required:true, placeholder:'Título del documento' },
            { name:'subtitulo', label:'Subtítulo', placeholder:'Opcional' },
            { name:'tipo', label:'Tipo(s)', type:'multiselect', required:true, options: tipos.map(t=> ({ value:t, label:t })) },
            { name:'fecha', label:'Fecha', type:'date', required:true },
            { name:'link', label:'Link', required:true, placeholder:'URL de descarga' },
          ] as FieldConfig[]}
          value={{...form, tipo: Array.isArray(form.tipo) ? form.tipo : (typeof form.tipo === 'string' ? [form.tipo] : []) } as any}
          onChange={patch=> setForm(f=> ({...f, ...patch}))}
          onSubmit={save}
          submitLabel={editingId? 'Guardar Cambios':'Agregar'}
          busyLabel="Guardando..."
          disabled={saving}
          error={formError}
          layout="one-column"
        />
      </AdminFormPanel>
    </AdminLayout>
  );
}
