
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
    { numero: '+320', texto: 'Estudiantes Activos', icono: '👥' },
    { numero: 'ICACIT', texto: 'Acreditación', icono: '🏆' }
  ];

  const areas = [
    'Pirometalurgia',
    'Hidrometalurgia',
    'Electrometalurgia',
    'Simulación de Procesos',
    'Mineralurgia',
    'Fundición',
    'Aleaciones',
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
            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                  <span className="text-xl md:text-2xl lg:text-3xl">🎯</span> Misión
                </h3>
                <p className="text-gray-200 leading-relaxed text-sm md:text-base lg:text-lg">
                  Brindar formación profesional científica, tecnológica y humanística de calidad, 
                  con valores y principios y responsabilidad social, afirmando la interculturalidad, 
                  reconociendo la diversidad natural, cultural y fortaleciendo nuestra identidad 
                  andino-amazónica; logrando líderes competitivos.
                </p>
              </div>
              
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                  <span className="text-xl md:text-2xl lg:text-3xl">🌟</span> Visión
                </h3>
                <p className="text-gray-200 leading-relaxed text-sm md:text-base lg:text-lg">
                  Los peruanos acceden a una educación que les permite desarrollar su potencial desde la primera infancia y convertirse en ciudadanos que valoran su cultura, 
                  conocen sus derechos y responsabilidades, desarrollan sus talentos y participan de manera innovadora, 
                  competitiva y comprometida en las dinámicas sociales, contribuyendo al desarrollo de sus comunidades y del país en su conjunto
                </p>
              </div>
            </div>

            {/* Historia */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">📜</span> Reseña Histórica
              </h3>
              <div className="space-y-3 md:space-y-4 text-gray-200 leading-relaxed text-sm md:text-base lg:text-lg">
                <p>
                  La Escuela Profesional de Ingeniería Metalúrgica de la Universidad Nacional de San Antonio Abad del Cusco, 
                  fue creada el <strong className="text-[#FFD700]">07 de mayo de 1975</strong> por Resolución Nº 2241-75-CONUP, 
                  con el propósito de fomentar el desarrollo en la región Sur-Este del Perú.
                </p>
                <p>
                  En el <strong className="text-[#FFD700]">2025 cumplio sus bodas de oro (50 años)</strong>, consolidándose como una 
                  unidad académica acreditada por <strong className="text-[#FFD700]">ICACIT</strong> a nivel nacional e internacional, 
                  líder en la formación profesional, investigación y extensión universitaria.
                </p>
                <p>
                  La Dirección del Departamento Académico de Metalurgia, 
                  cuenta con docentes de nivel académico y de acuerdo a la Ley Universitaria 30220, 
                  acorde a las exigencias de la sociedad y del Ministerio de Educación (SUNEDU), 
                  con grados de doctor, magister, ingeniero y estudios de doctorado como maestría concluidos.
                </p>
              </div>
            </div>

            {/* Lema */}
            <div className="text-center bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#FFD700]/30">
              <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[#FFD700] mb-3 md:mb-4">
                "Metalurgia innovadora para un futuro sostenible"
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg">
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
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">🚪</span> Perfil del Ingresante
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#FFD700] mb-3">Conocimientos Básicos</h4>
                  <ul className="space-y-2 text-gray-200 text-sm md:text-base lg:text-lg">
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
                  <h4 className="text-base md:text-lg font-semibold text-[#FFD700] mb-3">Habilidades y Actitudes</h4>
                  <ul className="space-y-2 text-gray-200 text-sm md:text-base lg:text-lg">
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
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">🎯</span> Perfil del Egresado
              </h3>
              <p className="text-gray-200 mb-4 md:mb-6 text-sm md:text-base lg:text-lg">
                El egresado de la Escuela Profesional de Ingeniería Metalúrgica está dotado de conocimientos, actitudes y habilidades,
                 coherente con las expectativas de los grupos de interés y al entorno socio-económico. El perfil está agrupado en las siguientes competencias.
              </p>
              
              <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">🔬</div>
                  <h4 className="text-[#FFD700] font-bold mb-2 text-sm md:text-base">Científico-Técnico</h4>
                  <p className="text-gray-300 text-xs md:text-sm">
                    Dominio de procesos metalúrgicos, investigación e innovación tecnológica
                  </p>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">🌱</div>
                  <h4 className="text-[#FFD700] font-bold mb-2 text-sm md:text-base">Sostenible</h4>
                  <p className="text-gray-300 text-xs md:text-sm">
                    Responsabilidad ambiental y uso eficiente de recursos naturales
                  </p>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">👥</div>
                  <h4 className="text-[#FFD700] font-bold mb-2 text-sm md:text-base">Humanístico</h4>
                  <p className="text-gray-300 text-xs md:text-sm">
                    Valores éticos, liderazgo y compromiso social
                  </p>
                </div>
              </div>
            </div>

            {/* Competencias */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">⚡</span> Competencias Profesionales
              </h3>
              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#FFD700] mb-3 md:mb-4">Áreas de Especialización</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {areas.map((area, index) => (
                      <div key={index} className="bg-[#1a1a1a]/40 rounded-lg md:rounded-xl p-2 md:p-3 border border-[#FFD700]/10">
                        <span className="text-gray-200 text-xs md:text-sm font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#FFD700] mb-3 md:mb-4">Capacidades Clave</h4>
                  <ul className="space-y-2 md:space-y-3 text-gray-200 text-sm md:text-base">
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Diseño y optimización de procesos metalúrgicos</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Desarrollo de nuevos materiales y aleaciones</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Control de calidad y certificación de procesos</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Gestión de proyectos industriales</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
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
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">📋</span> Información Académica
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">⏱️</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">10 Semestres</div>
                  <div className="text-gray-400 text-xs md:text-sm">Duración</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">🏛️</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">UNSAAC</div>
                  <div className="text-gray-400 text-xs md:text-sm">Universidad</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">🎓</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Bachiller</div>
                  <div className="text-gray-400 text-xs md:text-sm">Grado Académico</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">⚙️</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Ingeniero</div>
                  <div className="text-gray-400 text-xs md:text-sm">Título Profesional</div>
                </div>
              </div>
            </div>

            {/* Plan de Estudios por Semestres */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">📚</span> Estructura Curricular
              </h3>
              <p className="text-gray-200 text-sm md:text-base lg:text-lg mb-6 md:mb-8 text-center">
                La carrera está estructurada en 10 semestres académicos, con énfasis en formación 
                científica, tecnológica y humanística de calidad.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#FFD700]/10 text-center">
                    <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3">{index < 2 ? '📖' : index < 6 ? '🔬' : '⚙️'}</div>
                    <h4 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-1 md:mb-2">Semestre {index + 1}</h4>
                    <div className="text-gray-400 text-xs md:text-sm normal-case">
                      {index < 2 && 'Formación Básica'}
                      {index >= 2 && index < 6 && 'Formación Específica'}
                      {index >= 6 && index < 9 && 'Especialización'}
                      {index >= 9 && 'Práctica Profesional'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón para Ver Plan de Estudios */}
            <div className="flex justify-center">
              <a href="/cursos" className="group block">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-r from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-sm rounded-3xl px-8 md:px-12 py-6 md:py-8 border border-[#FFD700]/30 hover:border-[#FFD700]/60 transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="flex items-center gap-6 text-center">
                      <div className="text-4xl md:text-5xl animate-pulse">📚</div>
                      <div className="flex-1">
                        <h3 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-2">Ver Plan de Estudios Completo</h3>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed">Consulta todas las materias organizadas por semestres y conoce el mapa curricular completo</p>
                      </div>
                      <div className="text-[#FFD700] text-2xl md:text-3xl group-hover:translate-x-2 transition-transform duration-300">→</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        );

      case 'campo':
        return (
          <div className="space-y-8">
            {/* Campo Ocupacional */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">💼</span> Áreas de Desempeño Profesional
              </h3>
              <p className="text-gray-200 text-sm md:text-base lg:text-lg mb-6 md:mb-8 text-center">
                Los egresados se encuentran laborando en el ámbito nacional e internacional, 
                cumpliendo su desempeño profesional dentro de las áreas de especialización.
              </p>
              
              <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">⛏️</div>
                  <h4 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-2 md:mb-3">Industria Minera</h4>
                  <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                    <li>• Plantas concentradoras</li>
                    <li>• Operaciones mineras</li>
                    <li>• Procesamiento de minerales</li>
                    <li>• Control de procesos</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">🏭</div>
                  <h4 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-2 md:mb-3">Industria Siderúrgica</h4>
                  <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                    <li>• Fundición y refinación</li>
                    <li>• Producción de acero</li>
                    <li>• Control de calidad</li>
                    <li>• Desarrollo de aleaciones</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">🏗️</div>
                  <h4 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-2 md:mb-3">Industria Metalmecanica</h4>
                  <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                    <li>• Estructuras metálicas</li>
                    <li>• Tratamientos térmicos</li>
                    <li>• Soldadura especializada</li>
                    <li>• Mecanización</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">🏢</div>
                  <h4 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-2 md:mb-3">Consultoría</h4>
                  <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                    <li>• Asesoría técnica</li>
                    <li>• Evaluación de proyectos</li>
                    <li>• Auditorías técnicas</li>
                    <li>• Estudios de factibilidad</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-xl md:text-2xl lg:text-3xl mb-4">🔬</div>
                  <h4 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-3">Investigación</h4>
                  <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                    <li>• Desarrollo y mejora de materiales metálicos y aleaciones</li>
                    <li>• Procesos de extracción, refinación y reciclaje de metales</li>
                    <li>• Fabricación, conformado y tratamiento de materiales</li>
                    <li>• Evaluación de propiedades, corrosión y durabilidad</li>
                  </ul>
                </div>
                
                <div className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                  <div className="text-xl md:text-2xl lg:text-3xl mb-4">🎓</div>
                  <h4 className="text-[#FFD700] font-bold text-sm md:text-base lg:text-lg mb-3">Docencia</h4>
                  <ul className="text-gray-300 text-xs md:text-sm space-y-1">
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
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">🏆</span> Principales Empleadores
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
                  'Aceros Arequipa',
                  'Metalúrgica Peruana (MEPSA)',
                  'Fundición Ferrosa',
                  'Corporación Aceros del Perú',
                  'TECSUP',
                  'Cormin'
                ].map((empresa, index) => (
                  <div key={index} className="bg-[#1a1a1a]/40 rounded-xl p-4 border border-[#FFD700]/10 text-center">
                    <span className="text-gray-200 font-medium text-sm md:text-base lg:text-lg">{empresa}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Oportunidades de Posgrado */}
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-3xl p-8 border border-[#FFD700]/30">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-xl md:text-2xl lg:text-3xl">📚</span> Oportunidades de Posgrado
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#FFD700] text-sm md:text-base lg:text-lg mb-3">Maestrías Disponibles</h4>
                  <ul className="space-y-2 text-gray-200 text-xs md:text-sm">
                    <li>• Maestría en Metalurgia Extractiva</li>
                    <li>• Maestría en Metalurgia Transformativa</li>
                    <li>• Maestría en Gestión Minera y Ambiental</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#FFD700] text-sm md:text-base lg:text-lg mb-3">Especializaciones</h4>
                  <ul className="space-y-2 text-gray-200 text-xs md:text-sm">
                    <li>• Soldadura Avanzada</li>
                    <li>• Mantenimiento de Plantas</li>
                    <li>• En Procesos Metalúrgicos</li>
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
    <div 
      className="min-h-screen text-white overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)'
      }}
    >
      {/* Efectos de fondo mejorados con partículas flotantes */}
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
        {/* Header Épico - Responsive como Inicio.tsx */}
  <div className="text-center px-4 py-6 md:py-16">
          <div className="inline-block mb-6 md:mb-10">
            <div className="bg-[#FFD700]/10 p-3 md:p-6 rounded-full border border-[#FFD700]/30 shadow-2xl md:hover:shadow-[#FFD700]/40 transition-all duration-500">
              <span className="text-4xl md:text-5xl lg:text-6xl">🎓</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide mb-4 md:mb-6 leading-tight">
            <span className="block">Ingeniería</span>
            <span className="block">Metalúrgica</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-[#C9B037] font-medium tracking-wider max-w-3xl mx-auto mb-6 md:mb-10">
            Universidad Nacional de San Antonio Abad del Cusco • 50 Años de Excelencia
          </p>

          {/* Stats rápidas épicas - Responsive */}
          <div className="flex justify-center gap-3 md:gap-8 text-center mb-6 md:mb-10">
            <div className="group cursor-pointer md:hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">50</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Años</div>
            </div>
            <div className="group cursor-pointer md:hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">300+</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Estudiantes</div>
            </div>
            <div className="group cursor-pointer md:hover:scale-110 transition-all duration-500">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">10</div>
              <div className="text-gray-400 text-xs md:text-sm group-hover:text-gray-200 transition-colors duration-300">Semestres</div>
            </div>
          </div>

          {/* Estadísticas detalladas épicas - Responsive mejorado */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto mb-8 md:mb-12">
            {estadisticas.map((stat, index) => (
              <div key={index} className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-2.5 md:p-4 lg:p-6 border border-[#FFD700]/20 md:hover:border-[#FFD700]/50 md:hover:bg-[#FFD700]/5 md:hover:scale-105 md:hover:shadow-xl md:hover:shadow-[#FFD700]/20 transition-all duration-500 cursor-pointer">
                <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-[#FFD700] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{stat.icono}</div>
                <div className="text-base md:text-xl lg:text-2xl font-bold text-[#FFD700] group-hover:text-white transition-colors duration-300">{stat.numero}</div>
                <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación por pestañas - Responsive como Inicio.tsx */}
        <div className="px-4 mb-6 md:mb-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-12 pb-2 md:pb-0">
              {secciones.map((seccion) => (
                <button
                  key={seccion.id}
                  onClick={() => setSeccionActiva(seccion.id as any)}
                  className={`group relative flex items-center gap-2 px-3.5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl font-medium transition-all duration-300 text-sm md:text-base lg:text-lg flex-shrink-0 md:hover:scale-105 transform overflow-hidden ${
                    seccionActiva === seccion.id
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#C9B037] text-black shadow-lg shadow-[#FFD700]/25 scale-105 border border-[#FFD700]/60'
                      : 'bg-[#1a1a1a]/50 backdrop-blur-sm text-gray-300 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:bg-[#1a1a1a]/70'
                  }`}
                  aria-pressed={seccionActiva === seccion.id}
                >
                  {seccionActiva !== seccion.id && (
                    <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#FFD700]/10 to-transparent" />
                  )}
                  <span className={`text-sm md:text-lg lg:text-xl ${seccionActiva === seccion.id ? 'drop-shadow-sm' : 'group-hover:text-[#FFD700] transition-colors duration-300'}`}>{seccion.icono}</span>
                  <span className={`whitespace-nowrap font-semibold tracking-tight text-xs md:text-base ${seccionActiva === seccion.id ? 'text-black' : 'group-hover:text-[#FFD700] transition-colors duration-300'}`}>{seccion.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal - Responsive mejorado */}
        <div className="px-4 pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrera;
