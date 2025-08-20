
import { useState, useEffect } from 'react';
import BackToHomeButton from '../../components/Shared/BackToHomeButton';

type TipoDocumento = 'academico'|'administrativo'|'reglamento'|'formulario'|'guia'|'convenio';
interface DocumentoFront {
  id: string;
  titulo: string;
  subtitulo?: string;
  tipo: TipoDocumento[];
  fecha: string;
  link: string;
  created_at: string;
  updated_at?: string;
}
import EmptyOverlay from '../../components/Shared/EmptyOverlay';
import * as api from '../../services/documentosService';

const Documentos = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('academico');
  const [documentos, setDocumentos] = useState<DocumentoFront[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const categorias = [
    { id: 'academico', nombre: 'Académicos', icono: '📚' },
    { id: 'administrativo', nombre: 'Administrativos', icono: '📋' },
    { id: 'reglamento', nombre: 'Reglamentos', icono: '⚖️' },
    { id: 'formulario', nombre: 'Formularios', icono: '📝' },
    { id: 'guia', nombre: 'Guías', icono: '🗺️' },
    { id: 'convenio', nombre: 'Convenios', icono: '🤝' }
  ];


  useEffect(() => {
    setLoading(true);
    setError(null);
    api.list(1, 100)
      .then(data => {
        // Normalizar tipo: siempre array de strings válidos
        const normalizados: DocumentoFront[] = (data.items || []).map((doc: any) => ({
          ...doc,
          tipo: Array.isArray(doc.tipo)
            ? doc.tipo.filter((t: any) => typeof t === 'string')
            : (typeof doc.tipo === 'string' ? [doc.tipo] : [])
        }));
        setDocumentos(normalizados);
      })
      .catch(e => setError('Error cargando documentos'))
      .finally(() => setLoading(false));
  }, []);


  // Calcular la fecha de última actualización real
  const ultimaActualizacion = documentos.length > 0
    ? documentos.reduce((max, doc) => {
        const fecha = doc.fecha || doc.created_at;
        if (!fecha) return max;
        const dateObj = new Date(fecha);
        return dateObj > max ? dateObj : max;
      }, new Date(0))
    : null;

  const estadisticas = [
    { icono: '📄', numero: documentos.length.toString(), texto: 'Documentos' },
    { icono: '📁', numero: '6', texto: 'Categorías' },
    { icono: '🕒', numero: ultimaActualizacion ? ultimaActualizacion.toLocaleDateString() : '-', texto: 'Última actualización' },
    { icono: '🔄', numero: '24/7', texto: 'Disponible' }
  ];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'PDF': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'DOC': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'XLS': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };



  return (
    <div 
      className="min-h-screen text-white overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)'
      }}
    >
  <BackToHomeButton />
      {/* Efectos de fondo épicos con partículas flotantes */}
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

      <div className="relative">
        {/*!DATA_REAL && (
          <EmptyOverlay
            title="Documentos en preparación"
            message="Aún no se han cargado documentos oficiales. Este módulo se habilitará cuando el equipo termine la carga y validación de archivos."
            icon="📂"
          />
        )*/}
        {/* Header Épico - Responsive como Inicio.tsx */}
  <div className="text-center px-4 py-6 md:py-16">
          <div className="inline-block mb-6 md:mb-10">
            <div className="bg-[#FFD700]/10 p-3 md:p-6 rounded-full border border-[#FFD700]/30 shadow-2xl md:hover:shadow-[#FFD700]/40 transition-all duration-500">
              <span className="text-4xl md:text-5xl lg:text-6xl">📚</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide mb-4 md:mb-6 leading-tight">
            <span className="block">Centro de</span>
            <span className="block">Documentos</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-[#C9B037] font-medium tracking-wider max-w-3xl mx-auto mb-6 md:mb-10">
            Escuela Profesional de Ingeniería Metalúrgica • Acceso Digital 24/7
          </p>

          {/* Stats rápidas épicas - Responsive */}
          <div className="flex justify-center gap-3 md:gap-8 text-center mb-6 md:mb-10">
            <div className="group cursor-pointer md:hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">+5</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Documentos</div>
            </div>
            <div className="group cursor-pointer md:hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">6</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Categorías</div>
            </div>
            <div className="group cursor-pointer md:hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">24/7</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Disponible</div>
            </div>
          </div>

          {/* Estadísticas detalladas épicas - Responsive mejorado */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto mb-8 md:mb-12">
            {estadisticas.map((stat, index) => (
              <div key={index} className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
                <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{stat.icono}</div>
                <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{stat.numero}</div>
                <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación por categorías - Responsive como Inicio.tsx */}
        <div className="px-4 mb-6 md:mb-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-12 pb-2 md:pb-0">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                  className={`group relative flex items-center gap-2 px-3.5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl font-medium transition-all duration-300 text-sm md:text-base lg:text-lg flex-shrink-0 md:hover:scale-105 transform overflow-hidden ${
                    categoriaActiva === categoria.id
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#C9B037] text-black shadow-lg shadow-[#FFD700]/25 scale-105 border border-[#FFD700]/60'
                      : 'bg-[#1a1a1a]/50 backdrop-blur-sm text-gray-300 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#1a1a1a]/70'
                  }`}
                >
                  {categoriaActiva !== categoria.id && (
                    <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#FFD700]/10 to-transparent" />
                  )}
                  <span className={`text-sm md:text-lg lg:text-xl ${categoriaActiva === categoria.id ? 'drop-shadow-sm' : 'group-hover:text-[#FFD700] transition-colors duration-300'}`}>{categoria.icono}</span>
                  <span className={`whitespace-nowrap font-semibold tracking-tight text-xs md:text-base ${categoriaActiva === categoria.id ? 'text-black' : 'group-hover:text-[#FFD700] transition-colors duration-300'}`}>{categoria.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal - Responsive mejorado */}
        <div className="px-4 pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-2 md:gap-3 lg:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="text-center py-10 text-gray-400">Cargando documentos...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-400">{error}</div>
              ) : (
                documentos
                  .filter(doc => doc.tipo.includes(categoriaActiva as TipoDocumento))
                  .map((doc, index) => (
                    <div
                      key={doc.id || index}
                      className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 border border-[#FFD700]/20 hover:border-[#FFD700]/40 hover:bg-[#FFD700]/5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/10"
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="text-xl md:text-2xl lg:text-3xl">📄</div>
                          {/* Si en el futuro Documento tiene 'urgente', mostrar aquí */}
                        </div>
                        {doc.tipo.map((t, i) => (
                          <span key={t + i} className={`inline-block text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg border ${getTipoColor(t)}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base md:text-lg lg:text-xl font-bold text-[#FFD700] mb-2 md:mb-3 group-hover:text-white transition-colors duration-300 leading-tight">
                        {doc.titulo}
                      </h3>
                      <p className="text-gray-300 text-xs md:text-sm lg:text-base mb-3 md:mb-4 leading-relaxed">
                        {doc.subtitulo || ''}
                      </p>
                      <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-400 mb-3 md:mb-4">
                        <span>📅 {doc.fecha ? new Date(doc.fecha).toLocaleDateString() : (doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '')}</span>

                      </div>





                      <a href={doc.link} target="_blank" rel="noopener noreferrer" className="w-full block bg-gradient-to-r from-[#FFD700] to-[#C9B037] text-black font-medium py-2.5 md:py-3 lg:py-4 px-3 md:px-4 lg:px-6 rounded-lg md:rounded-xl lg:rounded-2xl hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all duration-300 hover:scale-105 text-sm md:text-base text-center">
                        <span className="flex items-center justify-center gap-1 md:gap-2">
                          <span className="text-sm md:text-base">⬇️</span>
                          <span className="font-semibold">Visitar y Descargar</span>
                        </span>
                      </a>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentos;