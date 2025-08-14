import React, { useState } from 'react';

type TabId = 'directiva' | 'carta' | 'comisiones' | 'funciones' | 'transparencia';

interface Directivo {
  cargo: string;
  nombre: string;
  codigo: string;
}

const tabs: { id: TabId; titulo: string; icono: string }[] = [
  { id: 'directiva', titulo: 'Directiva 2025-2', icono: '👥' },
  { id: 'carta', titulo: 'Carta Oficial', icono: '📜' },
  { id: 'comisiones', titulo: 'Comisiones', icono: '🛠️' },
  { id: 'funciones', titulo: 'Funciones', icono: '📋' },
  { id: 'transparencia', titulo: 'Transparencia', icono: '🔍' }
];

// Directiva oficial Centro Federado EPIMT 2025-2
const directivaActual: Directivo[] = [
  { cargo: 'Presidente', nombre: 'Álvaro Huiza Flores', codigo: '183172' },
  { cargo: 'Vicepresidente', nombre: 'Barra Huacho María Fernanda', codigo: '215859' },
  { cargo: 'Secretario de Organización', nombre: 'Huillca Alvaro Alexandro', codigo: '222018' },
  { cargo: 'Secretaria de Actas y Archivos', nombre: 'Villacorta Salcedo Vanessa', codigo: '215340' },
  { cargo: 'Secretario de Economía', nombre: 'Pila Huaracha Iván Vides', codigo: '231926' },
  { cargo: 'Secretaria de Arte y Cultura', nombre: 'Huamani Tejada Ariana Valentina', codigo: '240499' },
  { cargo: 'Secretario de Recreación y Deportes', nombre: 'Silva Nina Leonel Filiberto', codigo: '211428' },
  { cargo: 'Secretaria de Eventos Sociales', nombre: 'Millones Montesinos Atzumy Francisca', codigo: '231022' },
  { cargo: 'Secretario de Asuntos Académicos', nombre: 'Challco Choque Lucio Alex', codigo: '216332' },
  { cargo: 'Secretaria de Ambiente', nombre: 'Quillahuaman Chaman Summy Marisel', codigo: '231928' },
  { cargo: 'Secretario de Proyección, Asistencia Social y Asuntos Exteriores', nombre: 'Guzman Candia Marcelo Tito', codigo: '215323' },
  { cargo: 'Secretario de Acreditación', nombre: 'Campar Carrión Rony Antony', codigo: '224926' },
  { cargo: 'Secretario de Infraestructura', nombre: 'Quispe Quispe Ronal Raúl', codigo: '215333' },
  { cargo: 'Secretaria de Medios y Difusión', nombre: 'Lucero Guadalupe Cjuiro Laupa', codigo: '234959' },
  { cargo: 'Secretaria de Investigación e Innovación Tecnológica', nombre: 'Jorge Luis Tito Durand', codigo: '191925' }
];

const comisiones = [
  { 
    nombre: 'Académica', 
    responsable: 'Challco Choque Lucio Alex',
    descripcion: 'Gestiona asuntos académicos, coordinación con la escuela y apoyo estudiantil.' 
  },
  { 
    nombre: 'Arte y Cultura', 
    responsable: 'Huamani Tejada Ariana Valentina',
    descripcion: 'Promueve actividades culturales, artísticas y de identidad estudiantil.' 
  },
  { 
    nombre: 'Recreación y Deportes', 
    responsable: 'Silva Nina Leonel Filiberto',
    descripcion: 'Organiza eventos deportivos, recreativos y de integración estudiantil.' 
  },
  { 
    nombre: 'Investigación e Innovación', 
    responsable: 'Jorge Luis Tito Durand',
    descripcion: 'Fomenta la investigación científica y desarrollo tecnológico estudiantil.' 
  },
  { 
    nombre: 'Proyección Social', 
    responsable: 'Guzman Candia Marcelo Tito',
    descripcion: 'Gestiona actividades de extensión, asistencia social y relaciones externas.' 
  },
  { 
    nombre: 'Ambiente', 
    responsable: 'Quillahuaman Chaman Summy Marisel',
    descripcion: 'Promueve la conciencia ambiental y sostenibilidad en la escuela.' 
  }
];

const funciones = [
  'Representar a los estudiantes ante los órganos de gobierno universitario y la Escuela Profesional.',
  'Canalizar inquietudes, propuestas y necesidades del estudiantado de Ingeniería Metalúrgica.',
  'Promover actividades académicas, culturales, deportivas y de formación complementaria.',
  'Coordinar con la Federación Universitaria del Cusco en asuntos de interés estudiantil.',
  'Gestionar proyectos de bienestar estudiantil, infraestructura y mejora de servicios.',
  'Fomentar la participación en investigación, innovación y responsabilidad social universitaria.',
  'Mantener comunicación transparente con la comunidad estudiantil mediante diversos medios.',
  'Organizar eventos de integración, ceremonias oficiales y actividades representativas.'
];

const documentos = [
  { titulo: 'Estatuto del Centro Federado EPIMT', tipo: 'PDF', descripcion: 'Marco normativo y reglamentario del Centro Federado', url: '#' },
  { titulo: 'Reglamento Interno 2025-2', tipo: 'PDF', descripcion: 'Normas internas para el periodo actual', url: '#' },
  { titulo: 'Carta de Invitación FUC - Juramentación', tipo: 'PDF', descripcion: 'Documento oficial para la ceremonia del 15 de agosto', url: '#' },
  { titulo: 'Plan de Gestión 2025-2', tipo: 'PDF', descripcion: 'Objetivos y metas de la gestión actual', url: '#' },
  { titulo: 'Informe de Gestión Anterior', tipo: 'PDF', descripcion: 'Rendición de cuentas del periodo 2025-1', url: '#' }
];

const Representacion: React.FC = () => {
  const [activo, setActivo] = useState<TabId>('directiva');

  const renderContenido = () => {
    switch (activo) {
      case 'directiva':
        return (
          <div className="space-y-8">
            {/* Información del periodo */}
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 border border-[#FFD700]/30 rounded-2xl p-5 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏛️</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FFD700]">Centro Federado EPIMT 2025-2</h3>
                  <p className="text-[#C9B037] text-sm">Electo democráticamente | Juramentación: 15 de agosto de 2025</p>
                </div>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                Nueva directiva elegida para representar a los estudiantes de la Escuela Profesional de Ingeniería Metalúrgica 
                durante el semestre académico 2025-2, con el compromiso de servir a la comunidad estudiantil.
              </p>
            </div>

            {/* Directiva completa */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#FFD700] flex items-center gap-2">
                <span>👥</span> Directiva Completa 2025-2
              </h3>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {directivaActual.map((directivo, index) => (
                  <div 
                    key={index} 
                    className="group bg-[#1a1a1a]/60 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-[#FFD700] font-semibold text-xs tracking-wide uppercase leading-snug">
                        {directivo.cargo}
                      </div>
                      {index === 0 && <span className="text-yellow-400 text-sm">👑</span>}
                      {index === 1 && <span className="text-gray-400 text-sm">🥈</span>}
                    </div>
                    <div className="text-gray-100 font-medium text-sm leading-snug mb-2">
                      {directivo.nombre}
                    </div>
                    <div className="text-gray-400 text-xs font-mono">
                      Cód. {directivo.codigo}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-[#1a1a1a]/40 border border-[#FFD700]/10 rounded-xl p-4 text-center">
                <p className="text-gray-300 text-sm">
                  <span className="text-[#FFD700] font-semibold">{directivaActual.length}</span> integrantes oficiales | 
                  Información verificada y actualizada para el periodo 2025-2
                </p>
              </div>
            </div>
          </div>
        );

      case 'carta':
        return (
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFD700] flex items-center gap-2">
              <span>📜</span> Carta Oficial de Invitación
            </h3>
            
            <div className="bg-[#1a1a1a]/60 border border-[#FFD700]/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              {/* Encabezado formal */}
              <div className="text-center mb-6 pb-4 border-b border-[#FFD700]/20">
                <h4 className="text-[#FFD700] font-bold text-lg mb-2">
                  CENTRO FEDERADO DE LA ESCUELA PROFESIONAL DE INGENIERÍA METALÚRGICA
                </h4>
                <p className="text-gray-300 text-sm uppercase tracking-wider">
                  Universidad Nacional de San Antonio Abad del Cusco
                </p>
              </div>

              {/* Asunto */}
              <div className="mb-6">
                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4">
                  <h5 className="text-[#FFD700] font-bold text-sm mb-2">ASUNTO:</h5>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Invitación a la Federación Universitaria del Cusco para participar en la ceremonia de 
                    juramentación y acreditación del nuevo Centro Federado
                  </p>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="space-y-4 text-gray-200 text-sm leading-relaxed">
                <p>De mi especial consideración:</p>
                
                <p>
                  Por medio de la presente, y a nombre del Centro Federado de la Escuela Profesional de Ingeniería Metalúrgica, 
                  me es grato saludarlo cordialmente y, a la vez, invitar a la Federación Universitaria del Cusco a participar 
                  en la ceremonia de juramentación y acreditación oficial del nuevo Centro Federado, electo democráticamente 
                  para el semestre académico 2025-2.
                </p>

                <div className="bg-[#FFD700]/5 border-l-4 border-[#FFD700]/30 pl-4 py-2">
                  <p className="text-[#FFD700] font-semibold">
                    📅 Fecha: Viernes 15 de agosto de 2025
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    Horario y lugar se confirmará oportunamente
                  </p>
                </div>

                <p>
                  Este evento tiene como propósito formalizar el reconocimiento de la nueva directiva ante la comunidad 
                  universitaria y dar inicio oficial a sus funciones en representación del estudiantado de nuestra 
                  escuela profesional.
                </p>

                <p>
                  Agradeciendo de antemano su atención y apoyo, me despido reiterándole mi consideración y estima 
                  personal e institucional.
                </p>
              </div>

              {/* Firma */}
              <div className="mt-8 pt-4 border-t border-[#FFD700]/20 text-center">
                <div className="text-[#FFD700] font-bold">Álvaro Huiza Flores</div>
                <div className="text-gray-400 text-sm">Presidente - Centro Federado EPIMT</div>
                <div className="text-gray-500 text-xs">Código: 183172</div>
              </div>
            </div>
          </div>
        );

      case 'comisiones':
        return (
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFD700] flex items-center gap-2">
              <span>🛠️</span> Comisiones de Trabajo
            </h3>
            
            <div className="grid md:grid-cols-2 gap-5">
              {comisiones.map((comision, index) => (
                <div key={index} className="bg-[#1a1a1a]/60 border border-[#FFD700]/20 rounded-xl p-5 hover:border-[#FFD700]/40 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📌</span>
                    <h4 className="font-semibold text-[#FFD700] text-base">{comision.nombre}</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{comision.descripcion}</p>
                  <div className="text-xs text-gray-400">
                    <span className="text-[#FFD700]">Responsable:</span> {comision.responsable}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'funciones':
        return (
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFD700] flex items-center gap-2">
              <span>📋</span> Funciones del Centro Federado
            </h3>
            
            <div className="space-y-3">
              {funciones.map((funcion, index) => (
                <div key={index} className="flex items-start gap-3 bg-[#1a1a1a]/50 border border-[#FFD700]/15 rounded-lg p-4 hover:bg-[#1a1a1a]/70 transition-colors">
                  <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                  <span className="text-gray-200 text-sm leading-relaxed">{funcion}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'transparencia':
        return (
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFD700] flex items-center gap-2">
              <span>🔍</span> Documentos y Transparencia
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {documentos.map((documento, index) => (
                <a 
                  key={index} 
                  href={documento.url} 
                  className="group block bg-[#1a1a1a]/60 border border-[#FFD700]/20 rounded-xl p-5 hover:border-[#FFD700]/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#FFD700] font-semibold text-sm bg-[#FFD700]/10 px-2 py-1 rounded">{documento.tipo}</span>
                    <span className="text-[#FFD700] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </div>
                  <div className="text-gray-200 font-medium leading-snug text-sm mb-2">{documento.titulo}</div>
                  <p className="text-gray-400 text-xs leading-relaxed">{documento.descripcion}</p>
                </a>
              ))}
            </div>
            
            <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl p-4 text-center">
              <p className="text-gray-300 text-sm">
                📌 Los documentos están en proceso de digitalización. 
                <span className="text-[#FFD700]"> Enlaces activos próximamente.</span>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)'
      }}
    >
      {/* Efectos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/5" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C9B037]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-14 pb-10 sm:pt-16 sm:pb-14 md:pt-20 md:pb-16 text-center">
        <div className="inline-block mb-6">
          <div className="bg-[#FFD700]/10 p-4 rounded-full border border-[#FFD700]/30">
            <span className="text-4xl">🏛️</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent mb-4 leading-tight">
          Centro Federado
          <span className="block text-3xl sm:text-4xl md:text-5xl mt-1">EPIMT</span>
        </h1>
        <p className="max-w-2xl mx-auto text-[#C9B037] font-medium text-sm sm:text-base md:text-lg">
          Representación Estudiantil | Escuela Profesional de Ingeniería Metalúrgica
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="relative px-4 mb-8">
        <div className="max-w-6xl mx-auto flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivo(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium flex-shrink-0 transition-all border whitespace-nowrap ${
                activo === tab.id 
                  ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-lg shadow-[#FFD700]/30' 
                  : 'bg-[#1a1a1a]/70 text-gray-300 border-[#FFD700]/25 hover:bg-[#1a1a1a]/90 hover:border-[#FFD700]/40'
              }`}
              aria-pressed={activo === tab.id}
            >
              <span>{tab.icono}</span>
              <span className="hidden sm:inline">{tab.titulo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {renderContenido()}
        </div>
      </div>
    </div>
  );
};

export default Representacion;
