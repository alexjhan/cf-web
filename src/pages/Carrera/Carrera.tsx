
import React, { useState } from 'react';

const Carrera: React.FC = () => {
  const [seccionActiva, setSeccionActiva] = useState<'general' | 'perfil' | 'plan' | 'campo'>('general');

  const secciones = [
    {
      id: 'general',
      nombre: 'Información General',
      icono: '🎓',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'perfil',
      nombre: 'Perfil Profesional',
      icono: '👨‍🔬',
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'plan',
      nombre: 'Plan de Estudios',
      icono: '📚',
      color: 'from-purple-500/20 to-violet-500/20'
    },
    {
      id: 'campo',
      nombre: 'Campo Ocupacional',
      icono: '💼',
      color: 'from-orange-500/20 to-red-500/20'
    }
  ];

  const estadisticas = [
    { numero: '50', texto: 'Años de Historia', icono: '🏛️' },
    { numero: '10', texto: 'Semestres', icono: '📅' },
    { numero: '90%+', texto: 'Empleabilidad', icono: '💼' },
    { numero: 'ICACIT', texto: 'Acreditación', icono: '🏆' }
  ];

  const areas = [
    'Pirometalurgia Avanzada',
    'Hidrometalurgia',
    'Electrometalurgia',
    'Simulación de Procesos',
    'Mineralurgia',
    'Fundición de Precisión',
    'Aleaciones Especiales',
    'Control de Calidad',
    'Metalurgia Física',
    'Tratamientos Térmicos'
  ];

  const renderContent = () => {
    switch (seccionActiva) {
      case 'general':
        return (
          <div className="space-y-8">
            {/* Misión y Visión */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
                <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                  <span className="text-3xl">🎯</span> Misión
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  Brindar formación profesional científica, tecnológica y humanística de calidad, 
                  con valores y principios y responsabilidad social, afirmando la interculturalidad, 
                  reconociendo la diversidad natural, cultural y fortaleciendo nuestra identidad 
                  andino-amazónica; logrando líderes competitivos.
                </p>
              </div>
              
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
                <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                  <span className="text-3xl">🌟</span> Visión
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  Formar ciudadanos que valoran su cultura, conocen sus derechos y responsabilidades, 
                  desarrollan sus talentos y participan de manera innovadora, competitiva y comprometida 
                  en las dinámicas sociales, contribuyendo al desarrollo de sus comunidades y del país.
                </p>
              </div>
            </div>

            {/* Historia */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">📜</span> Reseña Histórica
              </h3>
              <div className="space-y-4 text-gray-200 leading-relaxed">
                <p>
                  La Escuela Profesional de Ingeniería Metalúrgica de la Universidad Nacional de San Antonio Abad del Cusco, 
                  fue creada el <strong className="text-[#FFD700]">07 de mayo de 1975</strong> por Resolución Nº 2241-75-CONUP, 
                  con el propósito de fomentar el desarrollo en la región Sur-Este del Perú.
                </p>
                <p>
                  En el <strong className="text-[#FFD700]">2025 cumplirá sus bodas de oro (50 años)</strong>, consolidándose como una 
                  unidad académica acreditada por <strong className="text-[#FFD700]">ICACIT</strong> a nivel nacional e internacional, 
                  líder en la formación profesional, investigación y extensión universitaria.
                </p>
                <p>
                  Nuestra misión es formar profesionales integrales para transformar recursos minerales en metales, 
                  aleaciones y otros materiales de ingeniería para el desarrollo de la industria automotriz, naval, 
                  aeronáutica, metal mecánico y metal eléctrico con desarrollo sostenible.
                </p>
              </div>
            </div>

            {/* Lema */}
            <div className="text-center bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-3xl p-12 border border-[#FFD700]/30">
              <h2 className="text-4xl font-black text-[#FFD700] mb-4">
                "Metalurgia innovadora para un futuro sostenible"
              </h2>
              <p className="text-gray-300 text-lg">
                Lema de la Escuela Profesional de Ingeniería Metalúrgica
              </p>
            </div>
          </div>
        );

      case 'perfil':
        return (
          <div className="space-y-8">
            {/* Perfil del Ingresante */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">🚪</span> Perfil del Ingresante
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Conocimientos Básicos</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Matemática, física y química a nivel básico
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Comunicación y ciencias del ambiente
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Tecnologías de información y comunicación
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Habilidades y Actitudes</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Capacidad creativa para resolver problemas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Comunicación oral y escrita efectiva
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Comprensión y redacción de textos
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Perfil del Egresado */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">🎯</span> Perfil del Egresado
              </h3>
              <p className="text-gray-200 mb-6 text-lg">
                El Ingeniero Metalúrgico egresado está preparado para transformar y optimizar materiales metálicos 
                con una sólida base científica y tecnológica, desarrollando procesos eficientes y sostenibles 
                en la industria minera y metalúrgica.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-[#1a1a1a]/40 rounded-2xl border border-[#FFD700]/10">
                  <div className="text-4xl mb-4">🔬</div>
                  <h4 className="text-[#FFD700] font-bold mb-2">Científico-Técnico</h4>
                  <p className="text-gray-300 text-sm">
                    Dominio de procesos metalúrgicos, investigación e innovación tecnológica
                  </p>
                </div>
                <div className="text-center p-6 bg-[#1a1a1a]/40 rounded-2xl border border-[#FFD700]/10">
                  <div className="text-4xl mb-4">🌱</div>
                  <h4 className="text-[#FFD700] font-bold mb-2">Sostenible</h4>
                  <p className="text-gray-300 text-sm">
                    Responsabilidad ambiental y uso eficiente de recursos naturales
                  </p>
                </div>
                <div className="text-center p-6 bg-[#1a1a1a]/40 rounded-2xl border border-[#FFD700]/10">
                  <div className="text-4xl mb-4">👥</div>
                  <h4 className="text-[#FFD700] font-bold mb-2">Humanístico</h4>
                  <p className="text-gray-300 text-sm">
                    Valores éticos, liderazgo y compromiso social
                  </p>
                </div>
              </div>
            </div>

            {/* Competencias */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">⚡</span> Competencias Profesionales
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-4">Áreas de Especialización</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {areas.map((area, index) => (
                      <div key={index} className="bg-[#1a1a1a]/40 rounded-xl p-3 border border-[#FFD700]/10">
                        <span className="text-gray-200 text-sm font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-4">Capacidades Clave</h4>
                  <ul className="space-y-3 text-gray-200">
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <span>Diseño y optimización de procesos metalúrgicos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <span>Desarrollo de nuevos materiales y aleaciones</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <span>Control de calidad y certificación de procesos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <span>Gestión de proyectos industriales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <span>Investigación e innovación tecnológica</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-8">
            {/* Información General del Plan */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">📋</span> Información Académica
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-[#1a1a1a]/40 rounded-2xl border border-[#FFD700]/10">
                  <div className="text-3xl mb-3">⏱️</div>
                  <div className="text-[#FFD700] font-bold text-lg">10 Semestres</div>
                  <div className="text-gray-400 text-sm">Duración</div>
                </div>
                <div className="text-center p-6 bg-[#1a1a1a]/40 rounded-2xl border border-[#FFD700]/10">
                  <div className="text-3xl mb-3">🏛️</div>
                  <div className="text-[#FFD700] font-bold text-lg">UNSAAC</div>
                  <div className="text-gray-400 text-sm">Universidad</div>
                </div>
                <div className="text-center p-6 bg-[#1a1a1a]/40 rounded-2xl border border-[#FFD700]/10">
                  <div className="text-3xl mb-3">🎓</div>
                  <div className="text-[#FFD700] font-bold text-lg">Bachiller</div>
                  <div className="text-gray-400 text-sm">Grado Académico</div>
                </div>
                <div className="text-center p-6 bg-[#1a1a1a]/40 rounded-2xl border border-[#FFD700]/10">
                  <div className="text-3xl mb-3">⚙️</div>
                  <div className="text-[#FFD700] font-bold text-lg">Ingeniero</div>
                  <div className="text-gray-400 text-sm">Título Profesional</div>
                </div>
              </div>
            </div>

            {/* Plan de Estudios por Semestres */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">📚</span> Estructura Curricular
              </h3>
              <p className="text-gray-200 mb-8 text-center">
                La carrera está estructurada en 10 semestres académicos, con énfasis en formación 
                científica, tecnológica y humanística de calidad.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-[#1a1a1a]/40 rounded-2xl p-6 border border-[#FFD700]/10 text-center">
                    <div className="text-2xl mb-3">{index < 2 ? '📖' : index < 6 ? '🔬' : '⚙️'}</div>
                    <h4 className="text-[#FFD700] font-bold mb-2">Semestre {index + 1}</h4>
                    <div className="text-gray-400 text-sm">
                      {index < 2 && 'Formación Básica'}
                      {index >= 2 && index < 6 && 'Formación Específica'}
                      {index >= 6 && index < 8 && 'Especialización'}
                      {index >= 8 && 'Práctica Profesional'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Áreas de Formación */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/20">
                <h4 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-3">
                  <span className="text-2xl">📖</span> Formación Básica
                </h4>
                <ul className="space-y-2 text-gray-200 text-sm">
                  <li>• Matemáticas I-IV</li>
                  <li>• Física I-III</li>
                  <li>• Química General e Inorgánica</li>
                  <li>• Comunicación</li>
                  <li>• Introducción a la Metalurgia</li>
                </ul>
              </div>
              
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20">
                <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-3">
                  <span className="text-2xl">🔬</span> Formación Específica
                </h4>
                <ul className="space-y-2 text-gray-200 text-sm">
                  <li>• Termodinámica Metalúrgica</li>
                  <li>• Metalurgia Física</li>
                  <li>• Pirometalurgia</li>
                  <li>• Hidrometalurgia</li>
                  <li>• Electrometalurgia</li>
                </ul>
              </div>
              
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-400/20">
                <h4 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-3">
                  <span className="text-2xl">⚙️</span> Práctica Profesional
                </h4>
                <ul className="space-y-2 text-gray-200 text-sm">
                  <li>• Prácticas Pre-profesionales</li>
                  <li>• Proyecto de Tesis</li>
                  <li>• Gestión de Proyectos</li>
                  <li>• Seguridad Industrial</li>
                  <li>• Ética Profesional</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'campo':
        return (
          <div className="space-y-8">
            {/* Campo Ocupacional */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">💼</span> Áreas de Desempeño Profesional
              </h3>
              <p className="text-gray-200 mb-8 text-lg text-center">
                Los egresados se encuentran laborando en el ámbito nacional e internacional, 
                cumpliendo su desempeño profesional dentro de las áreas de especialización.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-4xl mb-4">⛏️</div>
                  <h4 className="text-[#FFD700] font-bold mb-3">Industria Minera</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Plantas concentradoras</li>
                    <li>• Operaciones mineras</li>
                    <li>• Procesamiento de minerales</li>
                    <li>• Control de procesos</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-4xl mb-4">🏭</div>
                  <h4 className="text-[#FFD700] font-bold mb-3">Industria Siderúrgica</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Fundición y refinación</li>
                    <li>• Producción de acero</li>
                    <li>• Control de calidad</li>
                    <li>• Desarrollo de aleaciones</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-4xl mb-4">🚗</div>
                  <h4 className="text-[#FFD700] font-bold mb-3">Industria Automotriz</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Componentes metálicos</li>
                    <li>• Tratamientos térmicos</li>
                    <li>• Soldadura especializada</li>
                    <li>• Materiales ligeros</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-4xl mb-4">🏢</div>
                  <h4 className="text-[#FFD700] font-bold mb-3">Consultoría</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Asesoría técnica</li>
                    <li>• Evaluación de proyectos</li>
                    <li>• Auditorías técnicas</li>
                    <li>• Estudios de factibilidad</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-4xl mb-4">🔬</div>
                  <h4 className="text-[#FFD700] font-bold mb-3">Investigación</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Desarrollo de materiales</li>
                    <li>• Nanotecnología</li>
                    <li>• Biomateriales</li>
                    <li>• Materiales inteligentes</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-4xl mb-4">🎓</div>
                  <h4 className="text-[#FFD700] font-bold mb-3">Docencia</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Universidades</li>
                    <li>• Institutos técnicos</li>
                    <li>• Capacitación empresarial</li>
                    <li>• Investigación académica</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Empleadores Destacados */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">🏆</span> Principales Empleadores
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'Southern Copper',
                  'Antamina',
                  'Cerro Verde',
                  'Las Bambas',
                  'Buenaventura',
                  'Volcan Compañía',
                  'SIDERPERÚ',
                  'Aceros Arequipa'
                ].map((empresa, index) => (
                  <div key={index} className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-[#FFD700]/10 text-center">
                    <span className="text-gray-200 font-medium text-sm">{empresa}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Oportunidades de Posgrado */}
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-3xl p-8 border border-[#FFD700]/30">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">📚</span> Oportunidades de Posgrado
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Maestrías Disponibles</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li>• Maestría en Metalurgia Extractiva</li>
                    <li>• Maestría en Ciencia e Ingeniería de Materiales</li>
                    <li>• Maestría en Gestión Minera</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Especializaciones</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li>• Soldadura Avanzada</li>
                    <li>• Metalurgia de Polvos</li>
                    <li>• Control de Calidad</li>
                    <li>• Hidrometalurgia y Biolixiviación</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
              🎓
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                <span className="bg-gradient-to-r from-[#FFD700] to-[#C9B037] bg-clip-text text-transparent">
                  INGENIERÍA METALÚRGICA
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Universidad Nacional de San Antonio Abad del Cusco</p>
            </div>
          </div>
          
          {/* Stats Badge */}
          <div className="hidden md:flex items-center gap-4">
            {estadisticas.map((stat, index) => (
              <div key={index} className="text-center px-4 py-2 bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl border border-[#FFD700]/20">
                <div className="text-lg font-bold text-[#FFD700]">{stat.numero}</div>
                <div className="text-xs text-gray-400">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            
            {/* Navegación de secciones */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-black text-sm">📋</span>
                Información de la Carrera
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {secciones.map((seccion) => (
                  <button
                    key={seccion.id}
                    onClick={() => setSeccionActiva(seccion.id as any)}
                    className={`group relative p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                      seccionActiva === seccion.id
                        ? 'bg-[#1a1a1a]/60 border-[#FFD700] shadow-2xl shadow-[#FFD700]/20 transform scale-105'
                        : 'bg-[#1a1a1a]/30 border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#1a1a1a]/50'
                    }`}
                  >
                    {/* Efecto hover */}
                    {seccionActiva !== seccion.id && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-4xl mb-3">{seccion.icono}</div>
                      <h3 className={`font-bold mb-2 ${
                        seccionActiva === seccion.id ? 'text-[#FFD700]' : 'text-white group-hover:text-[#FFD700]'
                      }`}>
                        {seccion.nombre}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenido dinámico */}
            <div className="min-h-[500px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrera;
