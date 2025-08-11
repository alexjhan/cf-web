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
    <div className="min-h-screen text-white" style={{ background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f0f 50%, #000000 100%)' }}>
      
      {/* Header Hero */}
      <div className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9B037]/10 via-transparent to-[#FFD700]/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#FFD700]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#C9B037]/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#B8860B]/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-gradient-to-r from-[#C9B037]/20 to-[#FFD700]/20 rounded-full border border-[#C9B037]/30">
            <span className="text-3xl animate-bounce">📰</span>
            <span className="text-[#FFD700] font-bold tracking-wider">CENTRO DE NOTICIAS</span>
            <span className="text-3xl animate-bounce delay-500">✨</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-8">
            <span style={{ color: '#FFD700' }}>Noticias &</span>
            <br />
            <span style={{ color: '#C9B037' }}>Actualidad</span>
          </h1>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Mantente informado con las últimas noticias, eventos y novedades del 
            <span className="text-[#FFD700] font-bold"> Centro Federado de Estudiantes</span>
          </p>
          
          <div className="mt-12 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-3 text-lg">
              <span className="text-2xl">🔥</span>
              <span className="text-gray-300">Actualizaciones en tiempo real</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <span className="text-2xl">📱</span>
              <span className="text-gray-300">Noticias verificadas</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <span className="text-2xl">⚡</span>
              <span className="text-gray-300">Contenido exclusivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Estadísticas Simples */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-black text-[#FFD700] mb-2">{noticias.length}</div>
              <div className="text-gray-300 font-medium text-sm">Noticias Totales</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-black text-[#FFD700] mb-2">📅</div>
              <div className="text-gray-300 font-medium text-sm">Actualizado Hoy</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-black text-[#FFD700] mb-2">{noticias.filter(n => n.destacada).length}</div>
              <div className="text-gray-300 font-medium text-sm">Destacadas</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-black text-[#FFD700] mb-2">
                {Math.floor(noticias.reduce((acc, n) => acc + (n.vistas || 0), 0) / 1000)}K
              </div>
              <div className="text-gray-300 font-medium text-sm">Vistas Totales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Principal: Noticia Izquierda + Lista Derecha */}
      <div className="py-16 px-4">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Noticia Principal - Lado Izquierdo (2/3 del espacio) */}
            <div className="xl:col-span-2">
              {principal ? (
                <div className="bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl p-8 border border-[#C9B037]/30 hover:border-[#FFD700]/50 transition-all duration-300">
                  
                  {/* Header de la noticia */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {principal.categoria.map((cat: string, i: number) => (
                        <span 
                          key={i}
                          className="px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-xl text-sm font-bold border border-[#FFD700]/30"
                        >
                          {cat}
                        </span>
                      ))}
                      
                      {principal.destacada && (
                        <span className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 rounded-xl text-sm font-bold border border-red-400/30 animate-pulse">
                          ⭐ DESTACADA
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span className="font-medium">{formatearFecha(principal.fecha)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>✍️</span>
                        <span className="font-medium">{principal.autor}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span className="font-medium">{tiempoLectura(principal.descripcionLarga)} min de lectura</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👁️</span>
                        <span className="font-medium">{principal.vistas} vistas</span>
                      </span>
                    </div>
                    
                    <div className="text-6xl mb-6">
                      {principal.destacada ? '⭐' : '📰'}
                    </div>
                  </div>

                  {/* Imagen de la noticia */}
                  {principal.imagen && principal.imagen !== "" && (
                    <div className="mb-8 relative overflow-hidden rounded-2xl">
                      <img 
                        src={principal.imagen}
                        alt={`Imagen de ${principal.titulo}`}
                        className="w-full h-64 md:h-80 object-cover"
                      />
                      
                      {/* Overlay con categoría */}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-black/70 backdrop-blur-sm text-[#FFD700] rounded-xl text-sm font-bold border border-[#FFD700]/30">
                          {principal.categoria[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Título y contenido */}
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight">
                      <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">
                        {principal.titulo}
                      </span>
                    </h1>
                    
                    <div className="text-xl text-gray-300 leading-relaxed font-light bg-gradient-to-r from-[#23232a] to-[#18181b] p-6 rounded-2xl border border-[#C9B037]/20">
                      {principal.descripcionCorta}
                    </div>
                    
                    <div className="prose prose-lg prose-invert max-w-none">
                      <div className="space-y-6 text-gray-300 leading-relaxed">
                        {principal.descripcionLarga.split('\n').map((paragraph: string, idx: number) => (
                          paragraph.trim() && (
                            <p key={idx} className="text-lg leading-8">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                    
                    {/* Footer de la noticia */}
                    <div className="mt-12 pt-8 border-t border-[#C9B037]/20">
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>
                          Última actualización: {formatearFecha(principal.fecha)}
                        </span>
                        <div className="flex gap-4">
                          <button className="px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg hover:bg-[#FFD700]/20 transition-colors border border-[#FFD700]/30">
                            📤 Compartir
                          </button>
                          <button className="px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg hover:bg-[#FFD700]/20 transition-colors border border-[#FFD700]/30">
                            🔖 Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl p-12 border border-[#C9B037]/30 text-center">
                  <div className="text-6xl mb-6">📰</div>
                  <h2 className="text-3xl font-bold text-[#FFD700] mb-4">
                    Selecciona una noticia
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Elige una noticia de la lista para ver el contenido completo
                  </p>
                </div>
              )}
            </div>

            {/* Lista de Noticias - Lado Derecho (1/3 del espacio) */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <h2 className="text-3xl font-bold text-[#FFD700] mb-8 text-center">
                  📋 Lista de Noticias
                </h2>
                
                <div className="bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl p-6 border border-[#C9B037]/30 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFD700] scrollbar-track-gray-800">
                  <div className="space-y-4">
                    {noticiasOrdenadas.map((noticia, index) => (
                      <div
                        key={noticia.id}
                        onClick={() => setSelectedIdx(index)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                          selectedIdx === index
                            ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 border-[#FFD700] transform scale-[1.02]'
                            : 'bg-gradient-to-br from-[#1f1f24] to-[#16161a] border-[#C9B037]/20 hover:border-[#FFD700]/50 hover:bg-gradient-to-r hover:from-[#FFD700]/10 hover:to-[#C9B037]/10'
                        }`}
                      >
                        {/* Imagen thumbnail */}
                        {noticia.imagen && noticia.imagen !== "" && (
                          <div className="w-full h-32 mb-3 overflow-hidden rounded-xl">
                            <img 
                              src={noticia.imagen}
                              alt={`Thumbnail ${noticia.titulo}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Categorías */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {noticia.categoria.slice(0, 2).map((cat: string, i: number) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-lg text-xs font-bold"
                            >
                              {cat}
                            </span>
                          ))}
                          {noticia.destacada && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold">
                              ⭐
                            </span>
                          )}
                        </div>
                        
                        {/* Título */}
                        <h3 className={`font-bold mb-2 line-clamp-2 ${
                          selectedIdx === index ? 'text-[#FFD700] text-lg' : 'text-white text-base'
                        }`}>
                          {noticia.titulo}
                        </h3>
                        
                        {/* Descripción corta */}
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {noticia.descripcionCorta}
                        </p>
                        
                        {/* Metadatos */}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <span>⏱️</span>
                              <span>{tiempoLectura(noticia.descripcionLarga)} min</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span>👁️</span>
                              <span>{noticia.vistas}</span>
                            </span>
                          </div>
                          <span>{formatearFecha(noticia.fecha)}</span>
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

      {/* Sección de Newsletter */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl">📢</span>
          </div>
          <h2 className="text-5xl font-bold text-[#FFD700] mb-8 leading-tight">
            ¿Quieres estar siempre informado?
          </h2>
          <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Suscríbete a nuestro boletín informativo y recibe las últimas noticias, 
            eventos y oportunidades del Centro Federado directamente en tu correo.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-5 bg-[#FFD700] text-black font-bold text-lg rounded-2xl hover:bg-[#C9B037] transition-all duration-300 transform hover:scale-105 shadow-xl">
              📧 Suscribirse al Boletín
            </button>
            <button className="px-10 py-5 border-3 border-[#FFD700] text-[#FFD700] font-bold text-lg rounded-2xl hover:bg-[#FFD700] hover:text-black transition-all duration-300 transform hover:scale-105">
              📱 Síguenos en Redes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noticias;
