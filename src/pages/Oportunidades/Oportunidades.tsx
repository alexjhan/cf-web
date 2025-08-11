import React, { useState } from 'react';

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

  return (
    <div className="h-screen text-white overflow-hidden flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)' }}>
      
      {/* Efectos de fondo avanzados */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#C9B037]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#B8860B]/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-20 w-48 h-48 bg-[#FFD700]/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header fijo */}
      <div className="relative z-20 flex-shrink-0 px-6 py-6 border-b border-[#FFD700]/10 backdrop-blur-xl bg-[#1a1a1a]/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-2xl font-bold shadow-2xl">
              🚀
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">
                  CENTRO DE OPORTUNIDADES
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Centro Federado de Ing. Metalúrgica</p>
            </div>
          </div>
          
          {/* Stats Badge */}
          <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-[#1a1a1a]/60 backdrop-blur-md rounded-2xl border border-[#FFD700]/20">
            <div className="text-center">
              <div className="text-lg font-bold text-[#FFD700]">{oportunidades.filter(op => op.activa).length}</div>
              <div className="text-xs text-gray-400">Activas</div>
            </div>
            <div className="w-px h-8 bg-[#FFD700]/20"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#FFD700]">{oportunidadesFiltradas.length}</div>
              <div className="text-xs text-gray-400">Categoría</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            
            {/* Navegación de categorías */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-sm">📋</span>
                Categorías de Oportunidades
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaActiva(categoria.id as any)}
                    className={`group relative p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                      categoriaActiva === categoria.id
                        ? 'bg-[#1a1a1a]/60 border-[#FFD700] shadow-2xl shadow-[#FFD700]/20 transform scale-105'
                        : `bg-[#1a1a1a]/30 ${categoria.borderColor} hover:border-[#FFD700]/50 hover:bg-[#1a1a1a]/50`
                    }`}
                  >
                    {/* Efecto hover */}
                    {categoriaActiva !== categoria.id && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-4xl mb-3">{categoria.icono}</div>
                      <h3 className={`font-bold mb-2 ${
                        categoriaActiva === categoria.id ? 'text-[#FFD700]' : 'text-white group-hover:text-[#FFD700]'
                      }`}>
                        {categoria.nombre}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {categoria.descripcion}
                      </p>
                      <div className="mt-3 text-xs text-gray-500">
                        {oportunidades.filter(op => op.tipo === categoria.id && op.activa).length} disponibles
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de oportunidades */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#FFD700] flex items-center gap-3">
                <span className="text-3xl">{categorias.find(c => c.id === categoriaActiva)?.icono}</span>
                {categorias.find(c => c.id === categoriaActiva)?.nombre}
              </h3>
              
              {oportunidadesFiltradas.length > 0 ? (
                <div className="grid gap-6">
                  {oportunidadesFiltradas.map((oportunidad) => (
                    <div
                      key={oportunidad.id}
                      className="relative bg-[#1a1a1a]/40 backdrop-blur-md rounded-3xl border border-[#FFD700]/20 p-8 hover:border-[#FFD700]/50 transition-all duration-300 group"
                    >
                      {/* Efecto de fondo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        {/* Header */}
                        <div className="flex flex-wrap justify-between items-start mb-6">
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-[#FFD700] mb-2">
                              {oportunidad.titulo}
                            </h4>
                            {oportunidad.empresa && (
                              <p className="text-gray-300 font-medium">📢 {oportunidad.empresa}</p>
                            )}
                            {oportunidad.universidad && (
                              <p className="text-gray-300 font-medium">🏫 {oportunidad.universidad}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {oportunidad.duracion && (
                              <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded-xl text-sm font-bold border border-[#FFD700]/30">
                                ⏱️ {oportunidad.duracion}
                              </span>
                            )}
                            {oportunidad.modalidad && (
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-bold border border-blue-400/30">
                                💻 {oportunidad.modalidad}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-gray-200 leading-relaxed mb-6 text-lg">
                          {oportunidad.descripcion}
                        </p>

                        {/* Requisitos y Beneficios */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h5 className="text-[#FFD700] font-bold mb-3 flex items-center gap-2">
                              <span>📋</span> Requisitos
                            </h5>
                            <ul className="space-y-2">
                              {oportunidad.requisitos.map((req, idx) => (
                                <li key={idx} className="text-gray-300 flex items-start gap-2">
                                  <span className="text-[#FFD700] mt-1">▸</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-[#FFD700] font-bold mb-3 flex items-center gap-2">
                              <span>🎁</span> Beneficios
                            </h5>
                            <ul className="space-y-2">
                              {oportunidad.beneficios.map((ben, idx) => (
                                <li key={idx} className="text-gray-300 flex items-start gap-2">
                                  <span className="text-green-400 mt-1">✓</span>
                                  <span>{ben}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-wrap justify-between items-center pt-6 border-t border-[#FFD700]/10">
                          <div className="text-sm text-gray-400">
                            📅 Publicado: {new Date(oportunidad.fecha).toLocaleDateString('es-ES')}
                          </div>
                          <div className="flex gap-3">
                            <button className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C9B037] text-black font-bold rounded-xl hover:from-[#C9B037] hover:to-[#B8860B] transition-all duration-300 transform hover:scale-105">
                              📧 Contactar
                            </button>
                            <button className="px-6 py-3 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#FFD700] rounded-xl hover:bg-[#FFD700]/20 transition-all duration-300 border border-[#FFD700]/30">
                              🔖 Guardar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-4xl mb-6 mx-auto">
                    🔍
                  </div>
                  <h3 className="text-2xl font-bold text-[#FFD700] mb-4">
                    No hay oportunidades disponibles
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    No se encontraron oportunidades en la categoría "{categorias.find(c => c.id === categoriaActiva)?.nombre}". 
                    Revisa otras categorías o vuelve más tarde.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oportunidades;
