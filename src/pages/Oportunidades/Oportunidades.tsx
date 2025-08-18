import React, { useState } from 'react';
import EmptyOverlay from '../../components/Shared/EmptyOverlay';

// Interfaces para los datos
interface Oportunidad {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'laboral' | 'pregrado' | 'posgrado' | 'especializacion';
  empresa?: string;
  universidad?: string;
  duracion?: string;
  modalidad?: string;
  requisitos: string[];
  beneficios: string[];
  contacto: string;
  fecha: string;
  activa: boolean;
}

const Oportunidades: React.FC = () => {
  const [categoriaActiva, setCategoriaActiva] = useState<'laboral' | 'pregrado' | 'posgrado' | 'especializacion'>('laboral');

  // Datos de ejemplo (después se pueden cargar desde API o JSON)
  const oportunidades: Oportunidad[] = [
    // LABORALES
    {
      id: '1',
      titulo: 'Ingeniero Metalúrgico - Minera del Sur',
      descripcion: 'Buscamos ingeniero metalúrgico para supervisar procesos de concentración y flotación de minerales en operaciones de gran escala.',
      tipo: 'laboral',
      empresa: 'Minera del Sur S.A.',
      requisitos: ['Título universitario en Ingeniería Metalúrgica', 'Experiencia mínima 2 años', 'Conocimiento en software de simulación'],
      beneficios: ['Sueldo competitivo S/. 8,000-12,000', 'Seguro médico completo', 'Bonos por productividad'],
      contacto: 'rrhh@mineradelsur.com',
      fecha: '2024-01-15',
      activa: true
    },
    {
      id: '2',
      titulo: 'Especialista en Fundición - SIDERPERÚ',
      descripcion: 'Posición para especialista en procesos de fundición y colada continua en planta siderúrgica de última generación.',
      tipo: 'laboral',
      empresa: 'SIDERPERÚ',
      requisitos: ['Ingeniería Metalúrgica o Materiales', 'Experiencia en fundición', 'Conocimiento en control de calidad'],
      beneficios: ['Salario desde S/. 10,000', 'Capacitaciones internacionales', 'Plan de carrera'],
      contacto: 'talentos@siderperu.com.pe',
      fecha: '2024-01-20',
      activa: true
    },
    
    // PREGRADO
    {
      id: '3',
      titulo: 'Ingeniería Metalúrgica - UNI',
      descripcion: 'Carrera universitaria enfocada en el procesamiento de minerales, metalurgia extractiva y desarrollo de materiales.',
      tipo: 'pregrado',
      universidad: 'Universidad Nacional de Ingeniería',
      duracion: '5 años',
      modalidad: 'Presencial',
      requisitos: ['Bachillerato completo', 'Examen de admisión', 'Matemáticas y física avanzada'],
      beneficios: ['Laboratorios especializados', 'Convenios con mineras', 'Prácticas profesionales'],
      contacto: 'admision@uni.edu.pe',
      fecha: '2024-02-01',
      activa: true
    },
    {
      id: '4',
      titulo: 'Ingeniería de Materiales - PUCP',
      descripcion: 'Programa universitario con énfasis en ciencia e ingeniería de materiales metálicos y no metálicos.',
      tipo: 'pregrado',
      universidad: 'Pontificia Universidad Católica del Perú',
      duracion: '5 años',
      modalidad: 'Presencial',
      requisitos: ['Secundaria completa', 'Examen de admisión PUCP', 'Entrevista personal'],
      beneficios: ['Becas de excelencia académica', 'Intercambios internacionales', 'Investigación aplicada'],
      contacto: 'admision@pucp.edu.pe',
      fecha: '2024-02-05',
      activa: true
    },

    // POSGRADO
    {
      id: '5',
      titulo: 'Maestría en Metalurgia Extractiva',
      descripcion: 'Programa de posgrado enfocado en técnicas avanzadas de extracción y refinación de metales, con énfasis en sostenibilidad.',
      tipo: 'posgrado',
      universidad: 'Universidad Nacional de Ingeniería',
      duracion: '2 años',
      modalidad: 'Presencial',
      requisitos: ['Título de Ingeniero Metalúrgico', 'Promedio mínimo 14', 'Certificado de inglés intermedio'],
      beneficios: ['Becas de investigación', 'Laboratorios especializados', 'Convenios internacionales'],
      contacto: 'posgrado@uni.edu.pe',
      fecha: '2024-02-01',
      activa: true
    },
    {
      id: '6',
      titulo: 'Doctorado en Ciencia e Ingeniería de Materiales',
      descripcion: 'Programa doctoral para investigación avanzada en nanomateriales, biomateriales y materiales inteligentes.',
      tipo: 'posgrado',
      universidad: 'Universidad Nacional Mayor de San Marcos',
      duracion: '4 años',
      modalidad: 'Presencial',
      requisitos: ['Maestría en área afín', 'Proyecto de investigación', 'Examen de suficiencia en inglés'],
      beneficios: ['Beca completa CONCYTEC', 'Publicaciones internacionales', 'Pasantías en el extranjero'],
      contacto: 'doctorado@unmsm.edu.pe',
      fecha: '2024-01-25',
      activa: true
    },

    // ESPECIALIZACIONES
    {
      id: '7',
      titulo: 'Especialización en Soldadura Avanzada',
      descripcion: 'Curso especializado en técnicas de soldadura para aplicaciones industriales de alta precisión y materiales especiales.',
      tipo: 'especializacion',
      universidad: 'TECSUP',
      duracion: '6 meses',
      modalidad: 'Semi-presencial',
      requisitos: ['Conocimientos básicos de soldadura', 'Experiencia en el sector industrial'],
      beneficios: ['Certificación internacional AWS', 'Prácticas en empresas', 'Kit de herramientas'],
      contacto: 'especializaciones@tecsup.edu.pe',
      fecha: '2024-01-20',
      activa: true
    },
    {
      id: '8',
      titulo: 'Metalurgia de Polvos y Sinterizado',
      descripcion: 'Especialización en tecnologías de metalurgia de polvos, compactación y sinterizado para componentes de precisión.',
      tipo: 'especializacion',
      universidad: 'SENATI',
      duracion: '4 meses',
      modalidad: 'Presencial',
      requisitos: ['Título técnico o universitario', 'Experiencia en manufactura'],
      beneficios: ['Certificación SENATI', 'Acceso a laboratorio especializado', 'Bolsa de trabajo'],
      contacto: 'metalurgia@senati.edu.pe',
      fecha: '2024-01-30',
      activa: true
    },
    {
      id: '9',
      titulo: 'Control de Calidad en Procesos Metalúrgicos',
      descripcion: 'Programa de especialización en sistemas de control de calidad, normas internacionales y certificación de procesos.',
      tipo: 'especializacion',
      universidad: 'Centro de Extensión UNI',
      duracion: '3 meses',
      modalidad: 'Virtual',
      requisitos: ['Experiencia en industria metalúrgica', 'Conocimientos básicos de estadística'],
      beneficios: ['Certificación internacional ISO', 'Modalidad flexible', 'Red de contactos profesionales'],
      contacto: 'extension@uni.edu.pe',
      fecha: '2024-02-10',
      activa: true
    },
    {
      id: '10',
      titulo: 'Hidrometalurgia y Biolixiviación',
      descripcion: 'Especialización avanzada en procesos hidrometalúrgicos y biotecnología aplicada a la extracción de metales.',
      tipo: 'especializacion',
      universidad: 'PONTIFICIA UNIVERSIDAD JAVERIANA',
      duracion: '8 meses',
      modalidad: 'Semi-presencial',
      requisitos: ['Ingeniería Metalúrgica o Química', 'Conocimientos en microbiología'],
      beneficios: ['Certificación internacional', 'Prácticas en laboratorio', 'Convenio con universidades extranjeras'],
      contacto: 'especializaciones@javeriana.edu.co',
      fecha: '2024-01-18',
      activa: true
    }
  ];

  const categorias = [
    {
      id: 'laboral',
      nombre: 'Oportunidades Laborales',
      icono: '💼',
      descripcion: 'Ofertas de trabajo en el sector metalúrgico',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'pregrado',
      nombre: 'Educación de Pregrado',
      icono: '🎓',
      descripcion: 'Programas universitarios en metalurgia',
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-400/30'
    },
    {
      id: 'posgrado',
      nombre: 'Educación de Posgrado',
      icono: '📚',
      descripcion: 'Maestrías y doctorados especializados',
      color: 'from-purple-500/20 to-violet-500/20',
      borderColor: 'border-purple-400/30'
    },
    {
      id: 'especializacion',
      nombre: 'Especializaciones',
      icono: '⚡',
      descripcion: 'Cursos y certificaciones técnicas',
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-400/30'
    }
  ];

  const oportunidadesFiltradas = oportunidades.filter(op => op.tipo === categoriaActiva && op.activa);

  const DATA_REAL = false; // bandera temporal

  return (
    <div 
      className="min-h-screen text-white overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)' }}
    >
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
      {/*!DATA_REAL && (
        <EmptyOverlay
          title="Oportunidades en construcción"
          message="Estamos preparando el listado real de convocatorias, becas y posiciones. Muy pronto habrá contenido actualizado."
          icon="🚧"
        />
      )*/}
      <header className="relative py-8 md:py-16 px-4">
        <div className="relative max-w-6xl mx-auto">
          
          {/* Logo con recuadro */}
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-block mb-4 md:mb-6">
              <div className="bg-[#FFD700]/10 p-4 md:p-6 rounded-full border border-[#FFD700]/30 shadow-2xl hover:shadow-[#FFD700]/40 transition-all duration-500">
                <span className="text-4xl md:text-5xl lg:text-6xl">🚀</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide mb-4 md:mb-6 leading-tight text-center">
            CENTRO DE OPORTUNIDADES
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-[#C9B037] font-medium tracking-wider max-w-3xl mx-auto mb-6 md:mb-10 text-center">
            Centro Federado de Ingeniería Metalúrgica • Impulsa tu Carrera Profesional
          </p>

          {/* Stats rápidas épicas - Responsive */}
          <div className="flex justify-center gap-4 md:gap-8 text-center mb-6 md:mb-10">
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{oportunidades.filter(op => op.activa).length}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Activas</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{categorias.length}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Categorías</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{oportunidadesFiltradas.length}</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Filtradas</div>
            </div>
          </div>

          {/* Estadísticas por categoría - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto mb-8 md:mb-12">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
                <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{categoria.icono}</div>
                <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{oportunidades.filter(op => op.tipo === categoria.id && op.activa).length}</div>
                <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{categoria.nombre}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative px-4 md:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
            
            {/* Navegación de categorías */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-5 sm:mb-6 flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-xs sm:text-sm">📋</span>
                <span className="truncate">Categorías de Oportunidades</span>
              </h2>
              {/* Scroll horizontal en móvil */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 scrollbar-thin md:overflow-visible snap-x snap-mandatory">
                {categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaActiva(categoria.id as any)}
        className={`group relative px-3.5 py-3 sm:px-4 sm:py-4 rounded-2xl border transition-all duration-300 backdrop-blur-md flex-shrink-0 w-44 sm:w-48 md:w-auto snap-start ${
                      categoriaActiva === categoria.id
                        ? 'bg-[#1a1a1a]/60 border-[#FFD700] shadow-2xl shadow-[#FFD700]/20 transform scale-105'
                        : `bg-[#1a1a1a]/30 ${categoria.borderColor} hover:border-[#FFD700]/50 hover:bg-[#1a1a1a]/50`
                    }`}
                  >
                    {/* Efecto hover */}
                    {categoriaActiva !== categoria.id && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    )}
                    
                    <div className="text-center space-y-0.5">
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-1.5">{categoria.icono}</div>
                      <h3 className={`font-semibold text-sm md:text-base lg:text-lg leading-snug tracking-tight ${categoriaActiva === categoria.id ? 'text-[#FFD700]' : 'text-white group-hover:text-[#FFD700]'}`}>{categoria.nombre}</h3>
                      <p className="text-gray-400 text-xs md:text-sm normal-case leading-snug line-clamp-2">
                        {categoria.descripcion}
                      </p>
                      <div className="pt-0.5 text-xs md:text-sm text-gray-500">
                        {oportunidades.filter(op => op.tipo === categoria.id && op.activa).length} disponibles
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de oportunidades */}
            <div className="space-y-6">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-3xl">{categorias.find(c => c.id === categoriaActiva)?.icono}</span>
                <span className="truncate max-w-[70%] sm:max-w-none leading-snug">{categorias.find(c => c.id === categoriaActiva)?.nombre}</span>
              </h3>
              
              {oportunidadesFiltradas.length > 0 ? (
        <div className="space-y-6">
                  {oportunidadesFiltradas.map((oportunidad) => (
                    <div
                      key={oportunidad.id}
                      className="relative bg-[#1a1a1a]/40 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#FFD700]/20 p-5 sm:p-7 md:p-8 hover:border-[#FFD700]/50 transition-all duration-300 group"
                    >
                      {/* Efecto de fondo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-4 sm:gap-6 items-start mb-6">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-1.5 sm:mb-2 leading-snug break-words break-all">
                              {oportunidad.titulo}
                            </h4>
                            {oportunidad.empresa && (
                              <p className="text-gray-300 font-medium text-sm md:text-base lg:text-lg">📢 {oportunidad.empresa}</p>
                            )}
                            {oportunidad.universidad && (
                              <p className="text-gray-300 font-medium text-sm md:text-base lg:text-lg">🏫 {oportunidad.universidad}</p>
                            )}
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-2 self-start">
                            {oportunidad.duracion && (
                              <span className="px-2.5 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-xl text-[11px] sm:text-sm font-bold border border-[#FFD700]/30 whitespace-nowrap">
                                ⏱️ {oportunidad.duracion}
                              </span>
                            )}
                            {oportunidad.modalidad && (
                              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-[11px] sm:text-sm font-bold border border-blue-400/30 whitespace-nowrap">
                                💻 {oportunidad.modalidad}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-gray-200 text-sm md:text-base lg:text-lg leading-relaxed mb-5 sm:mb-6 line-clamp-6">
                          {oportunidad.descripcion}
                        </p>

                        {/* Requisitos y Beneficios */}
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 mb-5 sm:mb-6">
                          <div>
              <h5 className="text-[#FFD700] font-bold mb-3 flex items-center gap-2 text-lg md:text-xl lg:text-2xl">
                              <span>📋</span> Requisitos
                            </h5>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {oportunidad.requisitos.map((req, idx) => (
                                <li key={idx} className="text-gray-300 flex items-start gap-2 text-sm md:text-base lg:text-lg break-words">
                                  <span className="text-[#FFD700] mt-1">▸</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
              <h5 className="text-[#FFD700] font-bold mb-3 flex items-center gap-2 text-lg md:text-xl lg:text-2xl">
                              <span>🎁</span> Beneficios
                            </h5>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {oportunidad.beneficios.map((ben, idx) => (
                                <li key={idx} className="text-gray-300 flex items-start gap-2 text-sm md:text-base lg:text-lg break-words">
                                  <span className="text-green-400 mt-1">✓</span>
                                  <span>{ben}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:justify-between sm:items-center pt-5 sm:pt-6 border-t border-[#FFD700]/10">
                          <div className="text-sm md:text-base lg:text-lg text-gray-400 order-2 sm:order-1">
                            📅 Publicado: {new Date(oportunidad.fecha).toLocaleDateString('es-ES')}
                          </div>
                          <div className="flex gap-2 sm:gap-3 order-1 sm:order-2">
                            <button className="px-3.5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FFD700] to-[#C9B037] text-black font-bold rounded-lg sm:rounded-xl hover:from-[#C9B037] hover:to-[#B8860B] transition-all duration-300 transform hover:scale-105 text-sm md:text-base lg:text-lg">
                              📧 Contactar
                            </button>
                            <button className="px-3.5 sm:px-6 py-2 sm:py-3 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#FFD700] rounded-lg sm:rounded-xl hover:bg-[#FFD700]/20 transition-all duration-300 border border-[#FFD700]/30 text-sm md:text-base lg:text-lg">
                              🔖 Guardar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-3xl sm:text-4xl mb-5 sm:mb-6 mx-auto">
                    🔍
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-3 sm:mb-4">
                    No hay oportunidades disponibles
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base lg:text-lg leading-relaxed">
                    No se encontraron oportunidades en la categoría "{categorias.find(c => c.id === categoriaActiva)?.nombre}". 
                    Revisa otras categorías o vuelve más tarde.
                  </p>
                </div>
              )}
            </div>
          </div>
      </main>
    </div>
  );
};

export default Oportunidades;
