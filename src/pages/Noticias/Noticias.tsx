import React, { useState, useEffect } from 'react';

// Interfaz simplificada para las noticias
interface Noticia {
  id: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  imagen: string;
  categoria: string[];
  fecha: string;
  autor: string;
  vistas: number;
  destacada: boolean;
}

const Noticias: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  // Cargar noticias desde localStorage o archivo JSON
  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        // Intentar cargar desde localStorage primero
        const noticiasGuardadas = localStorage.getItem('noticias');
        if (noticiasGuardadas) {
          const noticiasData = JSON.parse(noticiasGuardadas);
          setNoticias(noticiasData);
        } else {
          // Si no hay en localStorage, cargar desde archivo JSON
          const response = await fetch('/src/data/noticias.json');
          const noticiasData = await response.json();
          setNoticias(noticiasData);
        }
      } catch (error) {
        console.error('Error al cargar noticias:', error);
        setNoticias([]);
      }
    };

    cargarNoticias();
  }, []);

  // Ordenar noticias por fecha (más recientes primero)
  const noticiasOrdenadas = [...noticias].sort((a, b) => {
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
    <div className="min-h-screen text-white flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)' }}>
      
      {/* Efectos de fondo avanzados */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#C9B037]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#B8860B]/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-20 w-48 h-48 bg-[#FFD700]/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 px-4 sm:px-6 py-5 sm:py-6 border-b border-[#FFD700]/10 backdrop-blur-xl bg-[#1a1a1a]/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-2xl font-bold shadow-2xl flex-shrink-0">
                📰
              </div>
              <div className="min-w-0">
                <h1 className="ty-display font-black leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent block">CENTRO DE</span>
                  <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">NOTICIAS</span>
                </h1>
                <p className="ty-meta text-gray-400 truncate mt-1">Centro Federado de Ing. Metalúrgica</p>
              </div>
            </div>
            {/* Desktop Stats */}
            <div className="hidden md:flex items-center gap-4 px-5 py-3 bg-[#1a1a1a]/60 backdrop-blur-md rounded-2xl border border-[#FFD700]/20">
              <div className="text-center">
                <div className="ty-stat text-[#FFD700]">{noticias.length}</div>
                <div className="ty-meta text-gray-400">Noticias</div>
              </div>
              <div className="w-px h-8 bg-[#FFD700]/20" />
              <div className="text-center">
                <div className="ty-stat text-[#FFD700]">{noticias.filter(n => n.destacada).length}</div>
                <div className="ty-meta text-gray-400">Destacadas</div>
              </div>
            </div>
          </div>
          {/* Mobile stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-[#FFD700]/15 text-center">
              <div className="ty-stat text-[#FFD700] leading-none">{noticias.length}</div>
              <div className="ty-meta text-gray-400 mt-1">Noticias</div>
            </div>
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-[#FFD700]/15 text-center">
              <div className="ty-stat text-[#FFD700] leading-none">{noticias.filter(n => n.destacada).length}</div>
              <div className="ty-meta text-gray-400 mt-1">Destacadas</div>
            </div>
          </div>
        </div>
      </header>

  {/* Contenido principal */}
  <div className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            
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
                          <h1 className="ty-h1 font-black leading-tight">
                            <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">
                              {principal.titulo}
                            </span>
                          </h1>
                          
                          <div className="ty-body text-gray-200 leading-relaxed p-4 sm:p-6 bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#FFD700]/10">
                            {principal.descripcionCorta}
                          </div>
                          
                          <div className="prose prose-sm md:prose-lg prose-invert max-w-none">
            <div className="space-y-4 text-gray-300 leading-relaxed ty-body">
                              {principal.descripcionLarga.split('\n').map((paragraph: string, idx: number) => (
                                paragraph.trim() && (
              <p key={idx} className="leading-7 ty-body">
                                    {paragraph}
                                  </p>
                                )
                              ))}
                            </div>
                          </div>
                          
                          {/* Footer de la noticia */}
                          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#FFD700]/10">
                            <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
                              <span className="ty-body-sm text-gray-400">
                                Última actualización: {formatearFecha(principal.fecha)}
                              </span>
                              <div className="flex gap-2 sm:gap-3">
                                <button className="px-3 sm:px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#FFD700] rounded-lg sm:rounded-xl hover:bg-[#FFD700]/20 transition-all duration-300 border border-[#FFD700]/30 ty-body-sm">
                                  📤 Compartir
                                </button>
                                <button className="px-3 sm:px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#FFD700] rounded-lg sm:rounded-xl hover:bg-[#FFD700]/20 transition-all duration-300 border border-[#FFD700]/30 ty-body-sm">
                                  🔖 Guardar
                                </button>
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
                      <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                        Selecciona una noticia
                      </h2>
                      <p className="text-gray-400">
                        Elige una noticia de la lista para ver el contenido completo
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de noticias - Derecha */}
              <div className="lg:col-span-1 order-2">
                <div className="lg:sticky lg:top-4">
                  <h2 className="ty-h3 font-bold text-[#FFD700] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
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
              ? 'text-[#FFD700] ty-body' 
              : 'text-white ty-body-sm group-hover:text-[#FFD700] transition-colors'
                        }`}>
                          {noticia.titulo}
                        </h3>
                        
                        {/* Descripción corta */}
                        <p className="text-gray-400 ty-meta mb-2.5 line-clamp-2 leading-relaxed normal-case">
                          {noticia.descripcionCorta}
                        </p>
                        
                        {/* Metadatos */}
                        <div className="flex justify-between items-center ty-meta text-gray-500">
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
