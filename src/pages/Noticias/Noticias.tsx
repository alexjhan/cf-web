import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import noticiasBase from '../../data/noticias.json';
import { useNavigate, useLocation } from 'react-router-dom';

// Interfaz simplificada para las noticias
interface Noticia {
  id: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  imagen?: string;
  categoria: string[];
  fecha: string; // ISO YYYY-MM-DD
  autor: string;
  vistas: number;
  destacada: boolean;
}

const Noticias: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const handleShare = (n: Noticia) => {
    const url = `${window.location.origin}/noticias?id=${encodeURIComponent(n.id)}`;
    const title = n.titulo;
    const text = n.descripcionCorta || n.titulo;
    // Web Share API
    if (navigator.share) {
      navigator.share({ title, text, url }).then(() => {
        setShareMsg('Compartido');
        setTimeout(() => setShareMsg(null), 2500);
      }).catch(() => {
        try { navigator.clipboard.writeText(url); } catch {}
        setShareMsg('Enlace copiado');
        setTimeout(() => setShareMsg(null), 2500);
      });
    } else {
      // Fallback copiar portapapeles
      try { navigator.clipboard.writeText(url); }
      catch {}
      setShareMsg('Enlace copiado');
      setTimeout(() => setShareMsg(null), 2500);
    }
  };

  // Normalizar base (importada) añadiendo id, vistas, destacada si faltan
  const baseNormalizada: Noticia[] = useMemo(() => {
    if (noticias.length > 0) return [];
    const toSlug = (t: string) => t.toLowerCase().normalize('NFD').replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');
    return (noticiasBase as any[]).map((n, i) => ({
      id: `${n.fecha || '0000-00-00'}-${toSlug(n.titulo || 'noticia')}-${i}`,
      titulo: n.titulo || 'Sin título',
      descripcionCorta: n.descripcionCorta || '',
      descripcionLarga: n.descripcionLarga || '',
      imagen: n.imagen,
      categoria: Array.isArray(n.categoria) ? n.categoria : [],
      fecha: n.fecha || new Date().toISOString().slice(0,10),
      autor: n.autor || 'Desconocido',
      vistas: (n as any).vistas ?? 0,
      destacada: (n as any).destacada ?? false,
    }));
  }, [noticias.length]);

  // Merge base con localStorage (store sobrescribe por id)
  const mergedNoticias: Noticia[] = useMemo(() => {
    return noticias.length ? noticias : baseNormalizada;
  }, [noticias, baseNormalizada]);

  // Cargar desde backend
  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(apiBase + '/news', { signal: controller.signal });
        if (!res.ok) throw new Error('status ' + res.status);
        const data = await res.json();
        if (Array.isArray(data)) setNoticias(data);
      } catch (e:any) {
        setError('Sin conexión al servidor (modo demo)');
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // Deep link ?id=xxx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      const idx = mergedNoticias.findIndex(n => n.id === id);
      if (idx >= 0) setSelectedIdx(idx);
    }
  }, [location.search, mergedNoticias]);

  // Ordenar noticias por fecha (más recientes primero)
  const noticiasOrdenadas = [...mergedNoticias].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  // Noticia principal seleccionada
  const principal = noticiasOrdenadas[selectedIdx];

  // Funciones de utilidad
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tiempoLectura = (texto: string): number => {
    const palabras = texto.split(' ').length;
    return Math.ceil(palabras / 200); // Asumiendo 200 palabras por minuto
  };

  return (
    <div 
      className="min-h-screen text-white overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)' }}
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="px-6 py-4 bg-[#1a1a1a] border border-[#FFD700]/40 rounded-xl text-[#FFD700] animate-pulse">Cargando noticias...</div>
        </div>
      )}
      {error && !loading && (
        <div className="fixed top-4 right-4 bg-red-700/80 text-white px-4 py-2 rounded-lg text-sm border border-red-400 shadow-lg z-50">
          {error}
        </div>
      )}
      {/* Fondo y partículas estilo Carrera */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C9B037]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-[#FFD700]/6 rounded-full blur-2xl animate-pulse delay-500"></div>
        {/* Partículas flotantes responsive */}
        <div className="absolute top-16 md:top-20 left-6 md:left-10 w-2 md:w-3 h-2 md:h-3 bg-[#FFD700]/60 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-32 md:top-40 right-12 md:right-20 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#C9B037]/70 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-24 md:bottom-32 left-12 md:left-20 w-3 md:w-4 h-3 md:h-4 bg-[#FFD700]/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-12 md:bottom-20 right-6 md:right-10 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#B8860B]/80 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-48 md:top-60 left-1/3 w-2 md:w-3 h-2 md:h-3 bg-[#C9B037]/60 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute bottom-48 md:bottom-60 right-1/3 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#FFD700]/70 rounded-full animate-pulse delay-800"></div>
      </div>

      {/* Header épico responsivo */}
      <header className="relative py-8 md:py-16 px-4">
        {shareMsg && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-xl bg-black/70 backdrop-blur border border-[#FFD700]/40 text-sm md:text-base text-[#FFD700] shadow-lg animate-fade-in" aria-live="polite">
            {shareMsg}
          </div>
        )}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Logo con recuadro */}
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-block mb-4 md:mb-6">
              <div className="bg-[#FFD700]/10 p-4 md:p-6 rounded-full border border-[#FFD700]/30 shadow-2xl hover:shadow-[#FFD700]/40 transition-all duration-500">
                <span className="text-4xl md:text-5xl lg:text-6xl">📰</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide mb-4 md:mb-6 leading-tight text-center">
            CENTRO DE NOTICIAS
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-[#C9B037] font-medium tracking-wider max-w-3xl mx-auto mb-6 md:mb-10 text-center">
            Centro Federado de Ingeniería Metalúrgica • Mantente Informado
          </p>

          {/* Stats rápidas épicas - Responsive */}
          <div className="flex justify-center gap-4 md:gap-8 text-center mb-6 md:mb-10">
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{mergedNoticias.length}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Noticias</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{mergedNoticias.filter(n => n.destacada).length}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Destacadas</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{mergedNoticias.reduce((sum, n) => sum + n.vistas, 0)}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Vistas</div>
            </div>
          </div>

          {/* Estadísticas por tipo - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto mb-8 md:mb-12">
            <div className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
              <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">🔥</div>
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{mergedNoticias.filter(n => n.destacada).length}</div>
              <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">Destacadas</div>
            </div>
            <div className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
              <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">📊</div>
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{Math.round(mergedNoticias.reduce((sum, n) => sum + n.vistas, 0) / (mergedNoticias.length || 1))}</div>
              <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">Promedio</div>
            </div>
            <div className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
              <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">📅</div>
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{mergedNoticias.filter(n => new Date(n.fecha).getMonth() === new Date().getMonth()).length}</div>
              <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">Este Mes</div>
            </div>
            <div className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
              <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">🌟</div>
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{mergedNoticias.length ? Math.max(...mergedNoticias.map(n => n.vistas)) : 0}</div>
              <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">Más Vista</div>
            </div>
          </div>
        </div>
      </header>

  {/* Contenido principal */}
  <div className="relative flex-1 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
            
            {/* Layout principal: Dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Noticia principal - Izquierda */}
              <div className="lg:col-span-2 order-1">
                {principal ? (
                  <div>
                    <div className="relative bg-[#1a1a1a]/40 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#FFD700]/20 shadow-2xl overflow-hidden">
                      
                      {/* Efecto de fondo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/5"></div>
                      
                      {/* Contenido scrolleable */}
                      <div className="relative p-5 sm:p-7 md:p-8" style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#FFD700 transparent'
                      }}>
                        
                        {/* Header de la noticia */}
                        <div className="mb-6 sm:mb-8">
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                            {principal.categoria.map((cat: string, i: number) => (
                              <span 
                                key={i}
                                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold border border-[#FFD700]/30 backdrop-blur-sm"
                              >
                                {cat}
                              </span>
                            ))}
                            
                            {principal.destacada && (
                              <span className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold border border-red-400/30 animate-pulse backdrop-blur-sm">
                                ⭐ DESTACADA
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 text-[11px] sm:text-sm text-gray-400 mb-5 sm:mb-6">
                            <span className="flex items-center gap-2 bg-[#1a1a1a]/40 px-3 py-1 rounded-xl">
                              <span>📅</span>
                              <span className="font-medium">{formatearFecha(principal.fecha)}</span>
                            </span>
                            <span className="flex items-center gap-2 bg-[#1a1a1a]/40 px-3 py-1 rounded-xl">
                              <span>✍️</span>
                              <span className="font-medium">{principal.autor}</span>
                            </span>
                            <span className="flex items-center gap-2 bg-[#1a1a1a]/40 px-3 py-1 rounded-xl">
                              <span>⏱️</span>
                              <span className="font-medium">{tiempoLectura(principal.descripcionLarga)} min</span>
                            </span>
                            <span className="flex items-center gap-2 bg-[#1a1a1a]/40 px-3 py-1 rounded-xl">
                              <span>👁️</span>
                              <span className="font-medium">{principal.vistas} vistas</span>
                            </span>
                          </div>
                        </div>

                        {/* Imagen de la noticia */}
                        {principal.imagen && principal.imagen !== "" && (
                          <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-xl sm:rounded-2xl">
                            <img 
                              src={principal.imagen}
                              alt={`Imagen de ${principal.titulo}`}
                              className="w-full h-52 sm:h-64 md:h-80 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                          </div>
                        )}

                        {/* Título y contenido */}
                        <div className="space-y-6">
                          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                            <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">
                              {principal.titulo}
                            </span>
                          </h1>
                          
                          <div className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed p-4 sm:p-6 bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#FFD700]/10">
                            {principal.descripcionCorta}
                          </div>
                          
                          <div className="prose prose-sm md:prose-lg prose-invert max-w-none">
            <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg">
                              {principal.descripcionLarga.split('\n').map((paragraph: string, idx: number) => (
                                paragraph.trim() && (
              <p key={idx} className="leading-7 text-sm md:text-base lg:text-lg">
                                    {paragraph}
                                  </p>
                                )
                              ))}
                            </div>
                          </div>
                          
                          {/* Footer de la noticia */}
                          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#FFD700]/10">
                            <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
                              <span className="text-sm md:text-base lg:text-lg text-gray-400">
                                Última actualización: {formatearFecha(principal.fecha)}
                              </span>
                              <div className="flex gap-2 sm:gap-3">
                                <button className="px-3 sm:px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#FFD700] rounded-lg sm:rounded-xl hover:bg-[#FFD700]/20 transition-all duration-300 border border-[#FFD700]/30 text-sm md:text-base lg:text-lg" onClick={() => handleShare(principal)}>
                                  📤 Compartir
                                </button>
                                {isAuthenticated && (
                                  <>
                                    <button className="px-3 sm:px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#FFD700] rounded-lg sm:rounded-xl hover:bg-[#FFD700]/20 transition-all duration-300 border border-[#FFD700]/30 text-sm md:text-base lg:text-lg" onClick={() => navigate('/admin-noticias?edit=' + principal.id)}>
                                      ✏️ Editar
                                    </button>
                                    <button className="px-3 sm:px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#FFD700] rounded-lg sm:rounded-xl hover:bg-[#FFD700]/20 transition-all duration-300 border border-[#FFD700]/30 text-sm md:text-base lg:text-lg">
                                      🔖 Guardar
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-12 bg-[#1a1a1a]/40 backdrop-blur-md rounded-3xl border border-[#FFD700]/20">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-4xl mb-6 mx-auto">
                        📰
                      </div>
                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4">
                        Selecciona una noticia
                      </h2>
                      <p className="text-gray-400 text-sm md:text-base lg:text-lg">
                        Elige una noticia de la lista para ver el contenido completo
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de noticias - Derecha */}
              <div className="lg:col-span-1 order-2">
                <div className="lg:sticky lg:top-4">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-xs sm:text-sm">📋</span>
                    <span className="truncate">Lista de Noticias</span>
                  </h2>
                  <div className="space-y-2.5 sm:space-y-3 max-h-full lg:max-h-[calc(100vh-230px)] lg:overflow-y-auto pr-1 lg:pr-2" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#FFD700 transparent'
                  }}>
                    {noticiasOrdenadas.map((noticia, index) => (
                      <div
                        key={noticia.id}
                        onClick={() => setSelectedIdx(index)}
                        className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md ${
                          selectedIdx === index
                            ? 'bg-[#1a1a1a]/60 border-[#FFD700] shadow-2xl shadow-[#FFD700]/20'
                            : 'bg-[#1a1a1a]/30 border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#1a1a1a]/50'
                        }`}
                      >
                        {/* Efecto hover */}
                        {selectedIdx !== index && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        )}
                        
                        {/* Categorías */}
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {noticia.categoria.slice(0, 2).map((cat: string, i: number) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] rounded-lg text-[10px] sm:text-xs font-bold border border-[#FFD700]/30"
                            >
                              {cat}
                            </span>
                          ))}
                          {noticia.destacada && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 rounded-lg text-[10px] sm:text-xs font-bold border border-red-400/30">
                              ⭐
                            </span>
                          )}
                        </div>
                        
                        {/* Título */}
            <h3 className={`font-bold mb-1.5 line-clamp-2 leading-tight ${
                          selectedIdx === index 
              ? 'text-[#FFD700] text-sm md:text-base lg:text-lg' 
              : 'text-white text-sm md:text-base lg:text-lg group-hover:text-[#FFD700] transition-colors'
                        }`}>
                          {noticia.titulo}
                        </h3>
                        
                        {/* Descripción corta */}
                        <p className="text-gray-400 text-xs md:text-sm mb-2.5 line-clamp-2 leading-relaxed normal-case">
                          {noticia.descripcionCorta}
                        </p>
                        
                        {/* Metadatos */}
                        <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>⏱️ {tiempoLectura(noticia.descripcionLarga)}m</span>
                            <span>👁️ {noticia.vistas}</span>
                          </div>
                          <span className="truncate max-w-[90px] sm:max-w-none">{formatearFecha(noticia.fecha)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Noticias;
