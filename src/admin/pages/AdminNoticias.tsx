import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../components/AdminLayout';
import DynamicForm, { type FieldConfig } from '../components/DynamicForm';
import AdminFormPanel from '../components/AdminFormPanel';
import { useToast } from '../../components/Toast/ToastContext';

import * as noticiasApi from '../../services/noticiasService';
type Noticia = noticiasApi.Noticia;

const defaultNoticias: Noticia[] = [];

function AdminNoticiasContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>(defaultNoticias);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;
  const [total, setTotal] = useState(0);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  // Carga inicial
  useEffect(()=>{ let active=true; (async()=>{ setLoading(true); try{ const data = await noticiasApi.list(1, PAGE_SIZE, search || undefined); if(!active) return; setNoticias(data.items); setTotal(data.total); setPage(1);} catch { try { const saved=localStorage.getItem('noticias'); if(saved){ const parsed=JSON.parse(saved); if(Array.isArray(parsed)) setNoticias(parsed);} } catch {} } finally { if(active) setLoading(false);} })(); return ()=>{ active=false }; // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  // Búsqueda (debounce)
  useEffect(()=>{ const h = setTimeout(async ()=> { setLoading(true); try { const data = await noticiasApi.list(1, PAGE_SIZE, search || undefined); setNoticias(data.items); setTotal(data.total); setPage(1);} finally { setLoading(false);} }, 400); return ()=> clearTimeout(h); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoriaFiltro]);
  const loadMore = async ()=> { if(loadingMore) return; const nextPage = page+1; setLoadingMore(true); try { const data = await noticiasApi.list(nextPage, PAGE_SIZE, search || undefined); setNoticias(prev=> [...prev, ...data.items]); setTotal(data.total); setPage(nextPage);} finally { setLoadingMore(false);} };
  useEffect(()=>{ const params = new URLSearchParams(location.search); const editId = params.get('edit'); if(editId) setPendingEditId(editId); }, [location.search]);
  const emptyForm: Noticia = { id:'', fecha:'', titulo:'', descripcionCorta:'', descripcionLarga:'', autor:'', categoria:[], imagen:'', vistas:0, destacada:false };
  const [form, setForm] = useState<Noticia>({...emptyForm});
  const [preview, setPreview] = useState<string>('');
  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();
  useEffect(()=>{ if(pendingEditId && noticias.length){ const idx = noticias.findIndex(n=> n.id===pendingEditId); if(idx>=0){ setEditIdx(idx); setForm(noticias[idx]); setPreview(noticias[idx].imagen||''); setPendingEditId(null); const params=new URLSearchParams(location.search); params.delete('edit'); navigate({ pathname: location.pathname, search: params.toString() }, { replace:true }); } } }, [pendingEditId, noticias]);
  const categoriasDisponibles = ['Actualidad','Evento','Economía','Investigación','Premios','Charlas','Conferencias','Oportunidades','Otros'];
  const shortWords = form.descripcionCorta.trim() ? form.descripcionCorta.trim().split(/\s+/).filter(Boolean).length : 0;
  const fields = useMemo(()=>{
    const fs: FieldConfig[] = [
      { name:'fecha', label:'Fecha publicación', type:'date', required:true },
      { name:'categoria', label:'Categoría', type:'select', required:true, options: categoriasDisponibles.map(c=> ({ value:c, label:c })) },
      { name:'autor', label:'Autor', required:true },
      { name:'titulo', label:'Título', required:true, maxLength:180 },
      { name:'descripcionCorta', label:'Contenido corto (máx 160 palabras)', type:'textarea', required:true, helperText:`${shortWords}/160 palabras` },
      { name:'descripcionLarga', label:'Contenido largo', type:'textarea', required:true },
  { name:'imagen', label:'Imagen', type:'file', helperText:'Opcional (JPG/PNG)' }
    ];
    return fs;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortWords]);

  const onChangeForm = (patch: Partial<Noticia>) => {
    const next: Partial<Noticia> = { ...patch };
    if ('categoria' in patch && typeof patch.categoria === 'string') {
      // Guardar como array con un elemento para mantener compatibilidad del modelo
      (next as any).categoria = [patch.categoria];
    }
    if ('descripcionCorta' in patch && typeof patch.descripcionCorta === 'string') {
      const words = patch.descripcionCorta.trim().split(/\s+/).filter(Boolean);
      if (words.length > 160) {
        (next as any).descripcionCorta = words.slice(0,160).join(' ');
      }
    }
    setForm(prev=> ({ ...prev, ...next }));
  };
  const handleAdd = async () => { if(!form.fecha||!form.titulo||!form.descripcionCorta||!form.descripcionLarga||!form.autor||form.categoria.length===0){ toast.push({ type:'warning', message:'Completa los campos requeridos' }); return; } try { const payload: noticiasApi.NoticiaPayload = { fecha: form.fecha, titulo: form.titulo, descripcionCorta: form.descripcionCorta, descripcionLarga: form.descripcionLarga, autor: form.autor, categoria: form.categoria, imagen: form.imagen, destacada: form.destacada }; const created = await noticiasApi.create(payload); setNoticias(prev=> [...prev, created]); window.dispatchEvent(new Event('news-changed')); toast.push({ type:'success', message:'Noticia creada' }); setForm({...emptyForm}); setPreview(''); setModalOpen(false); } catch { toast.push({ type:'error', message:'Error creando noticia' }); } };
  const handleEdit = (idx: number)=> { setEditIdx(idx); setForm(noticias[idx]); setPreview(noticias[idx].imagen||''); setModalOpen(true); };
  const handleUpdate = async ()=> { if(editIdx===null) return; try { const payload: Partial<noticiasApi.NoticiaPayload> = { fecha: form.fecha, titulo: form.titulo, descripcionCorta: form.descripcionCorta, descripcionLarga: form.descripcionLarga, autor: form.autor, categoria: form.categoria, imagen: form.imagen, destacada: form.destacada }; const updated = await noticiasApi.update(noticias[editIdx].id, payload); setNoticias(prev=> prev.map(n=> n.id===updated.id? updated : n)); window.dispatchEvent(new Event('news-changed')); toast.push({ type:'success', message:'Cambios guardados' }); } catch { toast.push({ type:'error', message:'Error al guardar' }); } setEditIdx(null); setForm({...emptyForm}); setPreview(''); setModalOpen(false); };
  const handleDelete = async (idx: number)=> { if(!window.confirm('¿Eliminar esta noticia?')) return; const target = noticias[idx]; try { await noticiasApi.remove(target.id); setNoticias(prev=> prev.filter(n=> n.id!== target.id)); setDeletedIds(prev=> prev.includes(target.id)? prev : [...prev, target.id]); window.dispatchEvent(new Event('news-changed')); toast.push({ type:'success', message:'Noticia eliminada' }); } catch { toast.push({ type:'error', message:'Error al eliminar' }); } };
  useEffect(()=>{ try{ localStorage.setItem('noticias', JSON.stringify(noticias)); localStorage.setItem('noticias_initialized','1'); }catch{} }, [noticias]);
  useEffect(()=>{ try{ localStorage.setItem('noticias_deleted', JSON.stringify(deletedIds)); }catch{} }, [deletedIds]);
  const filtradas = useMemo(()=> {
    let arr = noticias;
    if(categoriaFiltro !== 'todas') arr = arr.filter(n=> n.categoria.includes(categoriaFiltro));
    const term = search.trim().toLowerCase();
    if(term){
      arr = arr.filter(n=> [n.titulo,n.autor,n.descripcionCorta].some(v=> v.toLowerCase().includes(term)));
    }
    return arr;
  }, [noticias, categoriaFiltro, search]);

  return (
    <AdminLayout title="Noticias">
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-40"><div className="px-6 py-3 bg-[#1a1a1a] border border-[#FFD700]/40 rounded-xl text-[#FFD700] animate-pulse text-sm">Cargando...</div></div>}
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex flex-wrap gap-2">
          <button onClick={()=> setCategoriaFiltro('todas')} className={`px-3 py-1 rounded text-xs font-semibold ${categoriaFiltro==='todas'?'bg-[#FFD700] text-black':'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}>Todas</button>
          {categoriasDisponibles.map(cat=> (
            <button key={cat} onClick={()=> setCategoriaFiltro(cat)} className={`px-3 py-1 rounded text-xs font-semibold ${categoriaFiltro===cat?'bg-[#FFD700] text-black':'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}>{cat}</button>
          ))}
        </div>
        <div className="flex flex-1 gap-3">
          <input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Buscar..." className="bg-gray-800/70 px-3 py-2 rounded border border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 outline-none flex-1 min-w-[200px]" />
          <button onClick={()=> { setForm({...emptyForm}); setEditIdx(null); setPreview(''); setModalOpen(true); }} className="px-5 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-black font-semibold rounded-md text-sm tracking-wide shadow hover:from-[#FFD700] hover:to-[#FFE066] transition">Nueva Noticia</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
          {filtradas.map((n, idx)=> (
            <div key={n.id} className="bg-gray-900 rounded border border-gray-700 p-4 relative">
              <span className="absolute top-2 left-4 text-[10px] text-gray-500">ID: {n.id}</span>
              {n.imagen && <img src={preview && editIdx===idx? preview : n.imagen} className="mb-2 max-h-32 rounded border border-gray-700 object-cover w-full" />}
              <span className="text-xs text-gray-400 mb-1 block">{n.fecha} | <span className="italic text-gray-500">{n.autor}</span></span>
              <h3 className="text-base font-bold mb-1">{n.titulo}</h3>
              <p className="text-yellow-400 font-bold italic mb-1 text-xs">{n.descripcionCorta}</p>
              {n.descripcionLarga.split(/\n|\r/).slice(0,2).map((p,i)=> <p key={i} className="text-gray-300 mb-1 text-xs" style={{whiteSpace:'pre-line'}}>{p}</p>)}
              <div className="flex gap-2 mt-2">
                <button onClick={()=> handleEdit(idx)} className="flex-1 text-xs bg-yellow-600 hover:bg-yellow-500 rounded px-2 py-1">Editar</button>
                <button onClick={()=> handleDelete(idx)} className="text-xs bg-red-600 hover:bg-red-500 rounded px-2 py-1">Eliminar</button>
              </div>
            </div>
          ))}
          {noticias.length===0 && !loading && <div className="col-span-full text-center text-gray-400 py-10">Sin noticias</div>}
        </div>
        { (noticias.length < total) && (
          <div className="mt-6 flex justify-center">
            <button onClick={loadMore} disabled={loadingMore} className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold text-sm disabled:opacity-60">
              {loadingMore? 'Cargando...':'Cargar más'} ({noticias.length}/{total})
            </button>
          </div>
        )}
        <AdminFormPanel
          mode="modal"
          open={modalOpen}
          onClose={()=> { setModalOpen(false); setEditIdx(null); }}
          title="Noticia"
          editing={editIdx!==null}
          onReset={()=> { setEditIdx(null); setForm({...emptyForm}); setPreview(''); }}
          newLabel="Nueva"
        >
          <DynamicForm
            fields={fields}
            value={form as any}
            onChange={onChangeForm as any}
            onSubmit={editIdx===null? handleAdd : handleUpdate}
            submitLabel={editIdx===null? 'Agregar':'Guardar Cambios'}
            layout="one-column"
          />
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-2">
              <input type="checkbox" checked={form.destacada} onChange={e=> setForm(f=> ({ ...f, destacada: e.target.checked }))} /> Destacada
            </label>
            {form.imagen && form.imagen.startsWith('data:') && (
              <img src={form.imagen} className="mt-2 max-h-32 rounded border border-gray-700 object-cover" />
            )}
          </div>
  </AdminFormPanel>
    </AdminLayout>
  );
}

export default function AdminNoticiasPage(){
  const { isAuthenticated } = useAuth();
  if(!isAuthenticated) return <div className="p-6 text-center text-red-400">No autorizado</div>;
  return <ProtectedRoute title="Administración de Noticias"><AdminNoticiasContent/></ProtectedRoute>;
}
