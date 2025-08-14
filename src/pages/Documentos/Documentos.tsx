import { useState } from 'react';

const Documentos = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('academicos');

  const categorias = [
    { id: 'academicos', nombre: 'Académicos', icono: '📚' },
    { id: 'administrativos', nombre: 'Administrativos', icono: '📋' },
    { id: 'reglamentos', nombre: 'Reglamentos', icono: '⚖️' },
    { id: 'formularios', nombre: 'Formularios', icono: '📝' },
    { id: 'guias', nombre: 'Guías', icono: '🗺️' },
    { id: 'convenios', nombre: 'Convenios', icono: '🤝' }
  ];

  const documentos = {
    academicos: [
      {
        titulo: 'Plan de Estudios 2024',
        descripcion: 'Plan curricular actualizado de la carrera de Ingeniería Metalúrgica',
        tipo: 'PDF',
        tamaño: '2.5 MB',
        fecha: '2024-03-15',
        urgente: true,
        enlace: '#'
      },
      {
        titulo: 'Reglamento de Grados y Títulos',
        descripcion: 'Normativas para obtención de grados académicos y títulos profesionales',
        tipo: 'PDF',
        tamaño: '1.8 MB',
        fecha: '2024-02-10',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Manual de Prácticas Pre-Profesionales',
        descripcion: 'Lineamientos para el desarrollo de prácticas profesionales',
        tipo: 'PDF',
        tamaño: '3.2 MB',
        fecha: '2024-01-20',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Catálogo de Cursos Electivos',
        descripcion: 'Lista completa de cursos electivos disponibles por semestre',
        tipo: 'PDF',
        tamaño: '1.2 MB',
        fecha: '2024-03-01',
        urgente: false,
        enlace: '#'
      }
    ],
    administrativos: [
      {
        titulo: 'Solicitud de Certificado de Estudios',
        descripcion: 'Formato para solicitud de certificados académicos',
        tipo: 'DOC',
        tamaño: '125 KB',
        fecha: '2024-03-10',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Formato de Carta de Presentación',
        descripcion: 'Plantilla oficial para cartas de presentación institucional',
        tipo: 'DOC',
        tamaño: '95 KB',
        fecha: '2024-02-28',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Procedimiento de Matrícula',
        descripcion: 'Guía paso a paso para el proceso de matrícula estudiantil',
        tipo: 'PDF',
        tamaño: '890 KB',
        fecha: '2024-03-05',
        urgente: true,
        enlace: '#'
      }
    ],
    reglamentos: [
      {
        titulo: 'Reglamento General de Estudiantes',
        descripcion: 'Normativas y derechos de los estudiantes universitarios',
        tipo: 'PDF',
        tamaño: '4.1 MB',
        fecha: '2024-01-15',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Reglamento de Evaluación Académica',
        descripcion: 'Criterios y procedimientos de evaluación estudiantil',
        tipo: 'PDF',
        tamaño: '2.7 MB',
        fecha: '2024-02-01',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Código de Ética Universitaria',
        descripcion: 'Principios éticos y conducta en la comunidad universitaria',
        tipo: 'PDF',
        tamaño: '1.5 MB',
        fecha: '2024-01-10',
        urgente: false,
        enlace: '#'
      }
    ],
    formularios: [
      {
        titulo: 'Solicitud de Beca de Estudios',
        descripcion: 'Formato para postulación a becas académicas y socioeconómicas',
        tipo: 'PDF',
        tamaño: '275 KB',
        fecha: '2024-03-12',
        urgente: true,
        enlace: '#'
      },
      {
        titulo: 'Formato de Proyecto de Tesis',
        descripcion: 'Plantilla oficial para presentación de proyectos de tesis',
        tipo: 'DOC',
        tamaño: '180 KB',
        fecha: '2024-02-25',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Evaluación Docente',
        descripcion: 'Formulario de evaluación del desempeño docente',
        tipo: 'PDF',
        tamaño: '320 KB',
        fecha: '2024-03-08',
        urgente: false,
        enlace: '#'
      }
    ],
    guias: [
      {
        titulo: 'Guía de Laboratorios Metalúrgicos',
        descripcion: 'Manual de uso seguro y procedimientos de laboratorio',
        tipo: 'PDF',
        tamaño: '5.8 MB',
        fecha: '2024-02-20',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Manual de Seguridad Industrial',
        descripcion: 'Protocolos de seguridad en procesos metalúrgicos',
        tipo: 'PDF',
        tamaño: '3.4 MB',
        fecha: '2024-02-15',
        urgente: true,
        enlace: '#'
      },
      {
        titulo: 'Guía de Redacción Académica',
        descripcion: 'Normas y estilo para documentos académicos y científicos',
        tipo: 'PDF',
        tamaño: '1.9 MB',
        fecha: '2024-03-01',
        urgente: false,
        enlace: '#'
      }
    ],
    convenios: [
      {
        titulo: 'Convenio Southern Copper Corporation',
        descripcion: 'Acuerdo de cooperación académica y prácticas profesionales',
        tipo: 'PDF',
        tamaño: '2.1 MB',
        fecha: '2024-01-30',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Convenio Antamina S.A.',
        descripcion: 'Colaboración en investigación y desarrollo tecnológico',
        tipo: 'PDF',
        tamaño: '1.7 MB',
        fecha: '2024-02-14',
        urgente: false,
        enlace: '#'
      },
      {
        titulo: 'Convenio Universidad de Chile',
        descripcion: 'Intercambio académico y movilidad estudiantil',
        tipo: 'PDF',
        tamaño: '1.3 MB',
        fecha: '2024-03-02',
        urgente: false,
        enlace: '#'
      }
    ]
  };

  const estadisticas = [
    { icono: '📄', numero: '180+', texto: 'Documentos' },
    { icono: '📁', numero: '6', texto: 'Categorías' },
    { icono: '⬇️', numero: '2.5K+', texto: 'Descargas/mes' },
    { icono: '🔄', numero: '24/7', texto: 'Actualizado' }
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
      className="min-h-screen text-white overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)'
      }}
    >
      {/* Efectos de fondo épicos */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C9B037]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-[#FFD700]/6 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative">
        {/* Header Épico */}
        <div className="text-center px-4 pt-10 pb-10 sm:pt-12 sm:pb-14 md:pt-14 md:pb-16">
          <div className="inline-block mb-5 sm:mb-6">
            <div className="bg-[#FFD700]/10 p-3 sm:p-4 rounded-full border border-[#FFD700]/30">
              <span className="text-3xl sm:text-4xl">📚</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide mb-3 sm:mb-4 md:mb-6">
            <span className="block">Centro de</span>
            <span className="block">Documentos</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#C9B037] font-medium tracking-wide max-w-2xl mx-auto mb-6 md:mb-8">
            Escuela Profesional de Ingeniería Metalúrgica • Acceso Digital 24/7
          </p>

          {/* Stats rápidas épicas */}
          <div className="flex justify-center gap-8 text-center mb-8">
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-2xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">180+</div>
              <div className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors duration-300">Documentos</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-2xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">6</div>
              <div className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors duration-300">Categorías</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-2xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">24/7</div>
              <div className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors duration-300">Disponible</div>
            </div>
          </div>

          {/* Estadísticas detalladas épicas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 max-w-4xl mx-auto mb-8 md:mb-12">
            {estadisticas.map((stat, index) => (
              <div key={index} className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
                <div className="text-lg sm:text-xl md:text-2xl mb-1 md:mb-2 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{stat.icono}</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{stat.numero}</div>
                <div className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación por categorías - Responsive */}
        <div className="px-4 mb-6 md:mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto no-scrollbar pb-2 md:pb-0 snap-x snap-mandatory">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                  className={`
                    flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-2xl font-medium transition-all duration-300 text-xs sm:text-sm md:text-base flex-shrink-0 snap-start hover:scale-105
                    ${categoriaActiva === categoria.id
                      ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/30'
                      : 'bg-[#1a1a1a]/60 text-gray-300 hover:bg-[#1a1a1a]/80 border border-[#FFD700]/20 hover:border-[#FFD700]/40'
                    }
                  `}
                >
                  <span className="text-sm sm:text-base md:text-lg">{categoria.icono}</span>
                  <span className="hidden sm:inline whitespace-nowrap">{categoria.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="px-4 pb-12 md:pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {documentos[categoriaActiva as keyof typeof documentos].map((doc, index) => (
                <div
                  key={index}
                  className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/40 hover:bg-[#FFD700]/5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📄</div>
                      {doc.urgente && (
                        <div className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full border border-red-500/30 animate-pulse">
                          Urgente
                        </div>
                      )}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-lg border ${getTipoColor(doc.tipo)}`}>
                      {doc.tipo}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#FFD700] mb-3 group-hover:text-white transition-colors duration-300">
                    {doc.titulo}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {doc.descripcion}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>📅 {doc.fecha}</span>
                    <span>📊 {doc.tamaño}</span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#C9B037] text-black font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all duration-300 hover:scale-105">
                    <span className="flex items-center justify-center gap-2">
                      <span>⬇️</span>
                      Descargar
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentos;