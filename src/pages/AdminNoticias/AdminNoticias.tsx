import React, { useEffect, useState } from "react";
import EmptyOverlay from '../../components/Shared/EmptyOverlay';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';

interface Noticia {
  id: string; // slug estable
  fecha: string; // formato YYYY-MM-DD
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  autor: string;
  categoria: string[];
  imagen?: string; // url local o remota (dataURL o externa)
  destacada?: boolean;
  vistas?: number;
}

const slug = (t: string) => t.toLowerCase().normalize('NFD').replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');

const seedNoticias: Omit<Noticia,'id'>[] = [
  { fecha: "2025-07-31", titulo: "Nuevo Laboratorio Metalúrgico Inaugurado", descripcionCorta: "Inauguración de laboratorio con equipos de última generación.", descripcionLarga: "Se inauguró el nuevo laboratorio con equipos de última generación para prácticas y proyectos de investigación. Este espacio permitirá a los estudiantes y docentes realizar investigaciones avanzadas, experimentos y trabajos colaborativos en el área de metalurgia. La ceremonia contó con la presencia de autoridades y especialistas del sector.", autor: "Admin", categoria: ["Evento"], imagen: "" },
  { fecha: "2025-07-15", titulo: "Conferencia Internacional de Materiales", descripcionCorta: "Participación destacada en conferencia internacional.", descripcionLarga: "Docentes y estudiantes participaron en la conferencia internacional, presentando investigaciones innovadoras sobre nuevos materiales y procesos metalúrgicos. El evento reunió a expertos de todo el mundo y permitió el intercambio de conocimientos y experiencias en el campo de la ciencia de materiales.", autor: "Admin", categoria: ["Conferencias"], imagen: "" },
];

const defaultNoticias: Noticia[] = seedNoticias.map((n,i)=> ({
  ...n,
  id: `${n.fecha}-${slug(n.titulo)}-${i}`,
  vistas: 0,
  destacada: false,
}));

const AdminNoticiasContent = () => {
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>(defaultNoticias);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
  const adminToken = (import.meta as any).env?.VITE_ADMIN_TOKEN || localStorage.getItem('adminToken') || '';
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(apiBase + '/news');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length && active) setNoticias(data);
        }
      } catch { /* offline fallback localStorage */
        try { const saved = localStorage.getItem('noticias'); if (saved) { const parsed = JSON.parse(saved); if(Array.isArray(parsed)) setNoticias(parsed); } } catch {}
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);
  const [form, setForm] = useState<Noticia>({ id: '', fecha: "", titulo: "", descripcionCorta: "", descripcionLarga: "", autor: "", categoria: [], imagen: "", vistas:0, destacada:false });
  const [preview, setPreview] = useState<string>("");
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, multiple, options } = target as HTMLSelectElement;
    if (name === "imagen" && (target as HTMLInputElement).files && (target as HTMLInputElement).files![0]) {
      const file = (target as HTMLInputElement).files![0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        // Guardar la imagen como Data URL para que se muestre en la página pública
        setForm((prev) => ({ ...prev, imagen: dataUrl }));
      };
      reader.readAsDataURL(file);
    } else if (name === "categoria" && multiple) {
      const selected = Array.from(options).filter((o: any) => o.selected).map((o: any) => o.value);
      setForm((prev) => ({ ...prev, categoria: selected }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fecha || !form.titulo || !form.descripcionCorta || !form.descripcionLarga || !form.autor || form.categoria.length === 0) return;
    try {
      const payload = { ...form, id: form.id || undefined } as any;
      const res = await fetch(apiBase + '/news', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(adminToken? { 'X-Admin-Token': adminToken }: {}) }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('create');
      const created = await res.json();
      setNoticias(prev => [...prev, created]);
      setStatusMsg('Noticia creada');
      setTimeout(()=>setStatusMsg(null), 2500);
      setForm({ id:'', fecha: '', titulo:'', descripcionCorta:'', descripcionLarga:'', autor:'', categoria:[], imagen:'', vistas:0, destacada:false });
      setPreview('');
    } catch {
      setStatusMsg('Error creando (offline?)');
      setTimeout(()=>setStatusMsg(null), 3000);
    }
  };
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
  setForm(noticias[idx]);
    setPreview(noticias[idx].imagen || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx === null) return;
    try {
      const res = await fetch(apiBase + '/news/' + noticias[editIdx].id, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(adminToken? { 'X-Admin-Token': adminToken }: {}) }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('update');
      const updatedItem = await res.json();
      setNoticias(prev => prev.map(n => n.id === updatedItem.id ? updatedItem : n));
      setStatusMsg('Cambios guardados');
      setTimeout(()=>setStatusMsg(null), 2500);
    } catch {
      setStatusMsg('Error al guardar');
      setTimeout(()=>setStatusMsg(null), 3000);
    }
    setEditIdx(null);
    setForm({ id:'', fecha: '', titulo:'', descripcionCorta:'', descripcionLarga:'', autor:'', categoria:[], imagen:'', vistas:0, destacada:false });
    setPreview('');
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm('¿Eliminar esta noticia?')) return;
    const target = noticias[idx];
    try {
      const res = await fetch(apiBase + '/news/' + target.id, { method: 'DELETE', headers: { ...(adminToken? { 'X-Admin-Token': adminToken }: {}) } });
      if (!res.ok) throw new Error('delete');
      setNoticias(prev => prev.filter(n => n.id !== target.id));
      setDeletedIds(prev => prev.includes(target.id)? prev : [...prev, target.id]);
      setStatusMsg('Noticia eliminada');
      setTimeout(()=>setStatusMsg(null), 2000);
    } catch {
      setStatusMsg('Error al eliminar');
      setTimeout(()=>setStatusMsg(null), 3000);
    }
  };

  // Persistir automáticamente en localStorage cuando cambie la lista
  useEffect(() => {
    try { localStorage.setItem('noticias', JSON.stringify(noticias)); } catch {}
    try { localStorage.setItem('noticias_initialized','1'); } catch {}
  }, [noticias]);

  useEffect(() => {
    try { localStorage.setItem('noticias_deleted', JSON.stringify(deletedIds)); } catch {}
  }, [deletedIds]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a3a4a] to-[#18181b] py-16 px-4 flex flex-col items-center">
      {statusMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/70 text-[#FFD700] px-4 py-2 rounded-xl border border-[#FFD700]/40 text-sm z-50">{statusMsg}</div>
      )}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-40">
          <div className="px-6 py-3 bg-[#1a1a1a] border border-[#FFD700]/40 rounded-xl text-[#FFD700] animate-pulse text-sm">Cargando...</div>
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center" style={{ color: "#C9B037", textShadow: "0 2px 8px #000" }}>
        Panel de Noticias (Admin)
      </h1>
      <div className="w-full max-w-3xl bg-[#23232a] rounded-xl border border-gray-700 p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-[#FFD700]">{editIdx === null ? "Agregar Nueva Noticia" : "Editar Noticia"}</h2>
        <form onSubmit={editIdx === null ? handleAdd : handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Fecha</label>
            <input
              type="date"
              name="fecha"
              className="w-full p-2 rounded bg-[#18181b] text-white border border-gray-700"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Categoría</label>
            <select
              name="categoria"
              className="w-full p-2 rounded bg-[#18181b] text-white border border-gray-700"
              value={form.categoria}
              onChange={handleChange}
              multiple
              required
            >
              <option value="Actualidad">Actualidad</option>
              <option value="Evento">Evento</option>
              <option value="Economía">Economía</option>
              <option value="Investigación">Investigación</option>
              <option value="Premios">Premios</option>
              <option value="Charlas">Charlas</option>
              <option value="Conferencias">Conferencias</option>
              <option value="Oportunidades">Oportunidades</option>
              <option value="Otros">Otros</option>
            </select>
            <span className="text-xs text-gray-400">(Puedes seleccionar varias categorías con Ctrl o Cmd)</span>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Autor</label>
            <input
              type="text"
              name="autor"
              placeholder="Nombre del autor"
              className="w-full p-2 rounded bg-[#18181b] text-white border border-gray-700"
              value={form.autor}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Título de la noticia"
              className="w-full p-2 rounded bg-[#18181b] text-white border border-gray-700"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Descripción corta</label>
            <input
              type="text"
              name="descripcionCorta"
              placeholder="Breve resumen de la noticia"
              className="w-full p-2 rounded bg-[#18181b] text-white border border-gray-700 font-bold"
              value={form.descripcionCorta}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Descripción larga</label>
            <textarea
              name="descripcionLarga"
              placeholder="Desarrollo completo de la noticia (máx. 6 líneas por párrafo)"
              className="w-full p-2 rounded bg-[#18181b] text-white border border-gray-700"
              value={form.descripcionLarga}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Imagen</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              className="w-full p-2 rounded bg-[#18181b] text-white border border-gray-700"
              onChange={handleChange}
            />
            {preview && (
              <img src={preview} alt="Vista previa" className="mt-2 max-h-40 rounded border border-gray-700" />
            )}
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="py-2 px-4 rounded bg-[#C9B037] text-black font-bold hover:bg-[#FFD700] transition">
              {editIdx === null ? "Agregar Noticia" : "Guardar Cambios"}
            </button>
            {editIdx !== null && (
              <button type="button" className="py-2 px-4 rounded bg-gray-700 text-white font-bold" onClick={() => { setEditIdx(null); setForm({ id:'', fecha: "", titulo: "", descripcionCorta: "", descripcionLarga: "", autor: "", categoria: [], imagen: "", vistas:0, destacada:false }); setPreview(""); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {noticias.length === 0 ? (
          <>
            <EmptyOverlay
              title="Aún no hay noticias"
              message="Publica tu primera noticia usando el formulario superior. Aquí aparecerán listadas para administración y edición."
              icon="📰"
              actionLabel="Crear ahora"
              onAction={() => {
                const el = document.querySelector('form input[name="titulo"]') as HTMLInputElement | null;
                el?.focus();
              }}
            />
          </>
        ) : (
          noticias.map((noticia, idx) => (
            <div key={idx} className="bg-[#23232a] rounded-2xl border border-gray-700 shadow-lg p-6 flex flex-col relative">
              <span className="absolute top-2 left-4 text-[10px] text-gray-500">ID: {noticia.id}</span>
              {noticia.imagen && (
                <img src={preview && editIdx === idx ? preview : noticia.imagen} alt="Imagen noticia" className="mb-3 max-h-40 rounded border border-gray-700 object-cover" />
              )}
              <span className="text-xs text-gray-400 mb-2">{noticia.fecha} | <span className="italic text-gray-500">{noticia.autor}</span> | <span className="text-[#FFD700] font-semibold">{Array.isArray(noticia.categoria) ? noticia.categoria.join(', ') : noticia.categoria}</span></span>
              <h3 className="text-lg font-bold text-white mb-2">{noticia.titulo}</h3>
              <p className="text-[#FFD700] font-bold italic mb-2">{noticia.descripcionCorta}</p>
              {noticia.descripcionLarga.split(/\n|\r/).map((parrafo, i) => (
                <p key={i} className="text-gray-300 mb-2" style={{whiteSpace: 'pre-line'}}>{parrafo}</p>
              ))}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="text-xs bg-[#FFD700] text-black px-2 py-1 rounded font-bold hover:bg-[#C9B037]" onClick={() => handleEdit(idx)}>
                  Editar
                </button>
                <button className="text-xs bg-red-700 text-white px-2 py-1 rounded font-bold hover:bg-red-500" onClick={() => handleDelete(idx)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const AdminNoticias: React.FC = () => {
  return (
    <ProtectedRoute title="Administración de Noticias">
      <AdminNoticiasContent />
    </ProtectedRoute>
  );
};

export default AdminNoticias;

