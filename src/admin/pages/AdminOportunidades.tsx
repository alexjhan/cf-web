import { useState, useEffect, useMemo } from 'react';
import * as oportunidadesApi from '../../services/oportunidadesService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../components/AdminLayout';
import { DynamicForm } from '../components/DynamicForm';
import type { FieldConfig } from '../components/DynamicForm';
import AdminFormPanel from '../components/AdminFormPanel';
import { useToast } from '../../components/Toast/ToastContext';

// Modelo refinado por categoría (union discriminada)
export type OportunidadCategoria = 'laborales' | 'educacion_pregrado' | 'educacion_posgrado' | 'especializaciones';
interface BaseOportunidad { id: number; categoria: OportunidadCategoria; titulo: string; fechaPublicacion: string; requisitos: string[]; beneficios: string[]; activa: boolean; }
export interface OportunidadLaboral extends BaseOportunidad { categoria:'laborales'; empresa:string; texto:string; contacto:string; fecha?: string; }
export interface OportunidadPregrado extends BaseOportunidad { categoria:'educacion_pregrado'; institucion:string; duracion:string; tipoEstudio:'presencial'|'virtual'; contenido:string; fecha?: string; }
export interface OportunidadPosgrado extends BaseOportunidad { categoria:'educacion_posgrado'; institucion:string; duracion:string; tipoEstudio:'presencial'|'virtual'; contacto:string; fecha?: string; }
export interface OportunidadEspecializacion extends BaseOportunidad { categoria:'especializaciones'; institucion:string; duracion:string; tipoEstudio:'presencial'|'semipresencial'|'virtual'; texto:string; contacto:string; fecha?: string; }
export type Oportunidad = OportunidadLaboral | OportunidadPregrado | OportunidadPosgrado | OportunidadEspecializacion;

const CATEGORIES: { id: OportunidadCategoria; label: string; color: string }[] = [
  { id: 'laborales', label: 'Laborales', color: 'bg-[#FFD700]' },
  { id: 'educacion_pregrado', label: 'Pregrado', color: 'bg-[#C9B037]' },
  { id: 'educacion_posgrado', label: 'Posgrado', color: 'bg-[#B8860B]' },
  { id: 'especializaciones', label: 'Especialización', color: 'bg-[#DAA520]' },
];

function emptyByCategoria(c: OportunidadCategoria): Partial<Oportunidad>{
  const base = { id:0, titulo:'', fechaPublicacion: new Date().toISOString().split('T')[0], requisitos:[] as string[], beneficios:[] as string[], activa:true } as const;
  switch(c){
    case 'laborales': return { ...base, categoria:'laborales', empresa:'', texto:'', contacto:'', fecha: base.fechaPublicacion };
    case 'educacion_pregrado': return { ...base, categoria:'educacion_pregrado', institucion:'', duracion:'', tipoEstudio:'presencial', contenido:'', fecha: base.fechaPublicacion };
    case 'educacion_posgrado': return { ...base, categoria:'educacion_posgrado', institucion:'', duracion:'', tipoEstudio:'presencial', contacto:'', fecha: base.fechaPublicacion };
    case 'especializaciones': return { ...base, categoria:'especializaciones', institucion:'', duracion:'', tipoEstudio:'presencial', texto:'', contacto:'', fecha: base.fechaPublicacion };
  }
  return { ...base, categoria:c } as Partial<Oportunidad>; // fallback (no debería alcanzarse)
}

function validar(o: Partial<Oportunidad>): string | null {
  if(!o.titulo?.trim()) return 'Título requerido';
  if(!o.categoria) return 'Categoría requerida';
  if(!o.fechaPublicacion) return 'Fecha requerida';
  switch(o.categoria){
    case 'laborales': if(!o.empresa?.trim()) return 'Empresa requerida'; if(!o.texto?.trim()) return 'Texto requerido'; if(!o.contacto?.trim()) return 'Contacto requerido'; return null;
    case 'educacion_pregrado': if(!o.institucion?.trim()) return 'Institución requerida'; if(!o.duracion?.trim()) return 'Duración requerida'; if(!o.tipoEstudio) return 'Tipo de estudio requerido'; if(!o.contenido?.trim()) return 'Contenido requerido'; return null;
    case 'educacion_posgrado': if(!o.institucion?.trim()) return 'Institución requerida'; if(!o.duracion?.trim()) return 'Duración requerida'; if(!o.tipoEstudio) return 'Tipo de estudio requerido'; if(!o.contacto?.trim()) return 'Contacto requerido'; return null;
    case 'especializaciones': if(!o.institucion?.trim()) return 'Institución requerida'; if(!o.duracion?.trim()) return 'Duración requerida'; if(!o.tipoEstudio) return 'Tipo de estudio requerido'; if(!o.texto?.trim()) return 'Texto requerido'; if(!o.contacto?.trim()) return 'Contacto requerido'; return null;
  }
}

function AdminOportunidadesContent(){
  const location = useLocation();
  const navigate = useNavigate();
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 18;
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState<number|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const params = new URLSearchParams(location.search);
  const initialFilter = params.get('cat') as OportunidadCategoria | null;
  const [filtroCategoria, setFiltroCategoria] = useState<string>(initialFilter || 'todas');
  const [form, setForm] = useState<Partial<Oportunidad>>(emptyByCategoria('laborales'));
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const toast = useToast();

  // Carga + migración vieja estructura -> nueva
  useEffect(()=>{
    let active = true;
    (async()=>{
      setLoading(true);
      try {
        // intentar backend primero
  const backend = await oportunidadesApi.list(1, PAGE_SIZE);
  if(!active) return;
  setOportunidades(backend.items as any);
  setTotal(backend.total);
  setPage(1);
      } catch {
        // fallback local migration
        const saved = localStorage.getItem('oportunidades');
        if(saved){
          try {
            const parsed = JSON.parse(saved) as any[];
            const migrated: Oportunidad[] = parsed.map(o => {
          const categoria: OportunidadCategoria = (()=>{ const t=(o.tipo||o.categoria||'').toString().toLowerCase(); if(['empleo','trabajo','laboral'].some(k=> t.includes(k))) return 'laborales'; if(['beca','pregrado'].some(k=> t.includes(k))) return 'educacion_pregrado'; if(['maestr','posgrado','doctorado'].some(k=> t.includes(k))) return 'educacion_posgrado'; if(['especial'].some(k=> t.includes(k))) return 'especializaciones'; return 'laborales'; })();
          const base = { id:o.id, categoria, titulo:o.titulo, fechaPublicacion: o.fechaPublicacion || new Date().toISOString().split('T')[0], requisitos: o.requisitos||[], beneficios: o.beneficios||[], activa: typeof o.activa==='boolean'? o.activa:true };
          switch(categoria){
            case 'laborales': return { ...base, empresa: o.empresa||o.institucion||'', texto: o.descripcion||o.texto||'', contacto: o.contacto||'', fecha: o.fecha||o.fechaVencimiento||base.fechaPublicacion } as OportunidadLaboral;
            case 'educacion_pregrado': return { ...base, institucion: o.institucion||o.empresa||'', duracion: o.duracion||'', tipoEstudio: (o.tipoEstudio||'presencial').includes('virtual')? 'virtual':'presencial', contenido: o.contenido||o.descripcion||'', fecha: o.fecha||o.fechaVencimiento||base.fechaPublicacion } as OportunidadPregrado;
            case 'educacion_posgrado': return { ...base, institucion: o.institucion||o.empresa||'', duracion: o.duracion||'', tipoEstudio: (o.tipoEstudio||'presencial').includes('virtual')? 'virtual':'presencial', contacto: o.contacto||'', fecha: o.fecha||o.fechaVencimiento||base.fechaPublicacion } as OportunidadPosgrado;
            case 'especializaciones': return { ...base, institucion: o.institucion||o.empresa||'', duracion: o.duracion||'', tipoEstudio: (o.tipoEstudio||o.modalidad||'presencial').toLowerCase().includes('semi')? 'semipresencial' : ( (o.tipoEstudio||o.modalidad||'presencial').toLowerCase().includes('virtual')? 'virtual':'presencial'), texto: o.texto||o.descripcion||'', contacto: o.contacto||'', fecha: o.fecha||o.fechaVencimiento||base.fechaPublicacion } as OportunidadEspecializacion;
          }
        });
            if(active) setOportunidades(migrated);
          } catch { if(active) setOportunidades([]); }
        }
      } finally { if(active) setLoading(false); }
    })();
    return ()=> { active=false; };
  },[]);
  useEffect(()=>{ localStorage.setItem('oportunidades', JSON.stringify(oportunidades)); }, [oportunidades]);
  useEffect(()=>{ if(initialFilter){ setFiltroCategoria(initialFilter); } }, [initialFilter]);
  const guardar = (list: Oportunidad[])=> { setOportunidades(list); };
  const enviar = async ()=> { setError(null); const err = validar(form); if(err){ setError(err); toast.push({ type:'warning', message: err }); return;} try { if(editandoId){ const updated = await oportunidadesApi.update(editandoId, form as any); guardar(oportunidades.map(o=> o.id===editandoId? updated as any : o)); toast.push({ type:'success', message:'Oportunidad actualizada'}); } else { const created = await oportunidadesApi.create({ ...(form as any), fechaPublicacion: (form as any).fecha || form.fechaPublicacion }); guardar([...oportunidades, created as any]); toast.push({ type:'success', message:'Oportunidad creada'}); } reset(); } catch(e:any){ setError(e.message || 'Error guardando'); toast.push({ type:'error', message: e.message || 'Error guardando'}); } };
  const reset = ()=> { const cat = (form.categoria||'laborales') as OportunidadCategoria; setForm(emptyByCategoria(cat)); setEditandoId(null); setError(null); };
  const editar = (o: Oportunidad)=> { setForm(o); setEditandoId(o.id); setError(null); setModalOpen(true); };
  const eliminar = async (id: number)=> { if(!confirm('¿Eliminar?')) return; try { await oportunidadesApi.remove(id); guardar(oportunidades.filter(o=> o.id!== id)); toast.push({ type:'success', message:'Eliminada'}); } catch(e:any){ setError(e.message || 'Error eliminando'); toast.push({ type:'error', message: e.message || 'Error eliminando'}); } };
  const alternar = async (id: number)=> { try { const target = oportunidades.find(o=> o.id===id); if(!target) return; const updated = await oportunidadesApi.update(id, { activa: !target.activa }); guardar(oportunidades.map(o=> o.id===id? updated as any : o)); toast.push({ type:'success', message: updated.activa? 'Activada':'Pausada'}); } catch(e:any){ setError(e.message || 'Error actualizando'); toast.push({ type:'error', message: e.message || 'Error actualizando'}); } };
  // (cambioLista eliminado; ahora gestionado dentro de DynamicForm onChange)
  const filtradasBase = filtroCategoria==='todas'? oportunidades : oportunidades.filter(o=> o.categoria===filtroCategoria);
  const term = search.trim().toLowerCase();
  const filtradas = term? filtradasBase.filter(o=> {
    const texto = [o.titulo,(o as any).empresa,(o as any).institucion,(o as any).texto,(o as any).contenido,(o as any).duracion].filter(Boolean).join(' ').toLowerCase();
    return texto.includes(term);
  }) : filtradasBase;
  return (
    <AdminLayout title="Oportunidades">
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=> { setFiltroCategoria('todas'); navigate({ pathname: '/admin/oportunidades' }); }} className={`px-4 py-2 rounded-lg text-sm font-semibold ${filtroCategoria==='todas'? 'bg-[#FFD700] text-black':'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}>Todas</button>
          {CATEGORIES.map(c=> (
            <button key={c.id} onClick={()=> { setFiltroCategoria(c.id); navigate({ pathname:'/admin/oportunidades', search:`?cat=${c.id}` }); }} className={`px-4 py-2 rounded-lg text-sm font-semibold ${filtroCategoria===c.id? 'bg-[#FFD700] text-black':'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}>{c.label}</button>
          ))}
        </div>
  <input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Buscar..." className="bg-gray-800/70 px-3 py-2 rounded border border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 outline-none flex-1 min-w-[200px]" />
  <button onClick={()=> { reset(); setModalOpen(true); }} className="px-5 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-black font-semibold rounded-md text-sm tracking-wide shadow hover:from-[#FFD700] hover:to-[#FFE066] transition">Nuevo</button>
      </div>
      { (oportunidades.length < total) && (
        <div className="mt-6 flex justify-center">
          <button disabled={loadingMore} onClick={async ()=> { if(loadingMore) return; const next=page+1; setLoadingMore(true); try { const data = await oportunidadesApi.list(next, PAGE_SIZE, search||undefined); setOportunidades(prev=> [...prev, ...(data.items as any)]); setTotal(data.total); setPage(next);} finally { setLoadingMore(false);} }} className="px-6 py-2 rounded-lg bg-[#FFD700] text-black font-semibold text-sm disabled:opacity-60">{loadingMore? 'Cargando...':'Cargar más'} ({oportunidades.length}/{total})</button>
        </div>
      )}
      <div className="mb-6">
        {loading && <div className="text-sm text-gray-400 mb-4">Cargando...</div>}
        {filtradas.length===0 && (
          <div className="text-center text-gray-400 py-10 border border-dashed border-gray-600 rounded-xl">Sin oportunidades</div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map(o=> {
            const catLabel = CATEGORIES.find(c=> c.id===o.categoria)?.label || o.categoria;
            const fecha = (o as any).fecha || o.fechaPublicacion;
            const extra = o.categoria==='laborales'
              ? (o as OportunidadLaboral).empresa
              : (o as any).institucion;
            const desc = (o as any).texto || (o as any).contenido || '';
            return (
              <div key={o.id} className="relative bg-gray-900 rounded-xl border border-gray-700 p-4 flex flex-col gap-2 shadow hover:shadow-lg hover:border-[#FFD700]/50 transition group">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#23232a] border border-gray-600 font-semibold tracking-wide text-gray-300 group-hover:border-[#FFD700]/60">{catLabel}</span>
                  <span className={`text-[10px] px-2 py-1 rounded ${o.activa? 'bg-green-500/20 text-green-300 border border-green-600/50':'bg-red-500/20 text-red-300 border border-red-600/50'}`}>{o.activa? 'Activa':'Inactiva'}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#FFD700] leading-snug line-clamp-2">{o.titulo}</h3>
                <p className="text-[11px] text-gray-400 italic">{fecha}</p>
                {extra && <p className="text-[11px] text-gray-300 truncate" title={extra}>{extra}</p>}
                {desc && <p className="text-[11px] text-gray-400 line-clamp-3" title={desc}>{desc}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={()=> editar(o)} className="px-3 py-1.5 text-[11px] rounded bg-yellow-600 hover:bg-yellow-500 font-semibold">Editar</button>
                  <button onClick={()=> alternar(o.id)} className={`px-3 py-1.5 text-[11px] rounded font-semibold ${o.activa? 'bg-orange-600 hover:bg-orange-500':'bg-green-600 hover:bg-green-500'}`}>{o.activa? 'Pausar':'Activar'}</button>
                  <button onClick={()=> eliminar(o.id)} className="px-3 py-1.5 text-[11px] rounded bg-red-600 hover:bg-red-500 font-semibold">Eliminar</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  <AdminFormPanel
          mode="modal"
          open={modalOpen}
          onClose={()=> { setModalOpen(false); setEditandoId(null); }}
          title="Oportunidad"
          editing={!!editandoId}
          onReset={()=> { reset(); }}
          newLabel="Nuevo"
        >
          <DynamicForm
            fields={useMemo(()=>{
              const base: FieldConfig[] = [
                { name:'titulo', label:'Título', required:true, placeholder:'Título de la oportunidad' },
                { name:'categoria', label:'Categoría', type:'select', required:true, options: CATEGORIES.map(c=> ({ value:c.id, label:c.label })) },
                { name:'fecha', label:'Fecha', type:'date' }
              ];
              if(form.categoria==='laborales') base.push(
                { name:'empresa', label:'Empresa', required:true },
                { name:'contacto', label:'Contacto', required:true },
                { name:'texto', label:'Descripción', type:'textarea', required:true }
              );
              if(form.categoria==='educacion_pregrado') base.push(
                { name:'institucion', label:'Institución', required:true },
                { name:'duracion', label:'Duración', required:true },
                { name:'tipoEstudio', label:'Tipo de Estudio', type:'select', required:true, options:[{value:'presencial',label:'Presencial'},{value:'virtual',label:'Virtual'}] },
                { name:'contenido', label:'Contenido', type:'textarea', required:true }
              );
              if(form.categoria==='educacion_posgrado') base.push(
                { name:'institucion', label:'Institución', required:true },
                { name:'duracion', label:'Duración', required:true },
                { name:'tipoEstudio', label:'Tipo de Estudio', type:'select', required:true, options:[{value:'presencial',label:'Presencial'},{value:'virtual',label:'Virtual'}] },
                { name:'contenido', label:'Contenido', type:'textarea', required:true },
                { name:'contacto', label:'Contacto', required:true }
              );
              if(form.categoria==='especializaciones') base.push(
                { name:'institucion', label:'Institución', required:true },
                { name:'duracion', label:'Duración', required:true },
                { name:'tipoEstudio', label:'Tipo de Estudio', type:'select', required:true, options:[{value:'presencial',label:'Presencial'},{value:'semipresencial',label:'Semipresencial'},{value:'virtual',label:'Virtual'}] },
                { name:'texto', label:'Descripción', type:'textarea', required:true },
                { name:'contacto', label:'Contacto', required:true }
              );
              base.push(
                { name:'requisitosTexto', label:'Requisitos (uno por línea)', type:'textarea', helperText:'Un requisito por línea. Usa Enter para agregar más.', placeholder:'Ser egresado universitario\nTener experiencia en metalurgia\nDisponibilidad inmediata', className:'min-h-36' },
                { name:'beneficiosTexto', label:'Beneficios (uno por línea)', type:'textarea', helperText:'Un beneficio por línea. Usa Enter para agregar más.', placeholder:'Sueldo competitivo\nCapacitación continua\nAmbiente laboral agradable', className:'min-h-36' }
              );
              return base;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [form.categoria])}
            value={useMemo(()=>({
              ...form,
              fecha: (form as any).fecha || form.fechaPublicacion,
              requisitosTexto: (form.requisitos||[]).join('\n'),
              beneficiosTexto: (form.beneficios||[]).join('\n')
            }), [form])}
            onChange={(patch)=>{
              if(patch.categoria){
                const t = form.titulo || '';
                const nuevo = emptyByCategoria(patch.categoria as OportunidadCategoria);
                (nuevo as any).titulo = t;
                setForm(nuevo);
                return;
              }
              if('requisitosTexto' in patch){
                setForm(f=> ({
                  ...f,
                  requisitos: (patch as any).requisitosTexto
                    .split(/\r?\n/)
                    .map((x:string)=>x.trim())
                    .filter((x:string)=> x.replace(/\s+/g, '') !== '')
                }));
              } else if('beneficiosTexto' in patch){
                setForm(f=> ({
                  ...f,
                  beneficios: (patch as any).beneficiosTexto
                    .split(/\r?\n/)
                    .map((x:string)=>x.trim())
                    .filter((x:string)=> x.replace(/\s+/g, '') !== '')
                }));
              } else if('fecha' in patch){
                setForm(f=> ({ ...f, fecha: (patch as any).fecha, fechaPublicacion: (patch as any).fecha }));
              } else {
                setForm(f=> ({ ...f, ...(patch as any) }));
              }
            }}
            onSubmit={()=> { enviar(); setModalOpen(false); }}
            submitLabel={editandoId? 'Guardar Cambios':'Agregar'}
            layout="one-column"
            error={error}
          />
          {editandoId && (
            <div className="flex gap-3 mt-4">
              <button onClick={()=> { reset(); setModalOpen(false); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">Cancelar edición</button>
            </div>
          )}
      </AdminFormPanel>
    </AdminLayout>
  );
}

export default function AdminOportunidadesPage(){
  const { isAuthenticated } = useAuth();
  if(!isAuthenticated) return <div className="p-6 text-center text-red-400">No autorizado</div>;
  return <AdminOportunidadesContent/>;
}

