import React, { useState } from 'react';

const Representacion: React.FC = () => {
  const [seccionActiva, setSeccionActiva] = useState<'general' | 'directiva' | 'comisiones' | 'contacto'>('general');

  const secciones = [
    {
      id: 'general',
      nombre: 'Información General',
      icono: '🏛️',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'directiva',
      nombre: 'Directiva 2025-2',
      icono: '👥',
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'comisiones',
      nombre: 'Comisiones',
      icono: '🛠️',
      color: 'from-purple-500/20 to-violet-500/20'
    },
    {
      id: 'contacto',
      nombre: 'Contacto',
      icono: '📱',
      color: 'from-orange-500/20 to-red-500/20'
    }
  ];

  const estadisticas = [
    { numero: '15', texto: 'Integrantes', icono: '👥' },
    { numero: '2025-2', texto: 'Periodo', icono: '📅' },
    { numero: '+320', texto: 'Estudiantes', icono: '🎓' },
    { numero: '15 Ago', texto: 'Juramentación', icono: '🏆' }
  ];

  // Directiva oficial Centro Federado EPIMT 2025-2
  const directivaActual = [
    { cargo: 'Presidente', nombre: 'Álvaro Huiza Flores', codigo: '183172' },
    { cargo: 'Vicepresidenta', nombre: 'Barra Huacho María Fernanda', codigo: '215859' },
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
    'Comisión Académica',
    'Comisión de Arte y Cultura',
    'Comisión de Recreación y Deportes',
    'Comisión de Eventos Sociales',
    'Comisión de Ambiente',
    'Comisión de Proyección Social',
    'Comisión de Infraestructura',
    'Comisión de Medios y Difusión',
    'Comisión de Investigación',
    'Comisión de Acreditación'
  ];

  const renderContent = () => {
    switch (seccionActiva) {
      case 'general':
        return (
          <div className="space-y-8">
            {/* Misión y Visión */}
            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
                <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                  <span className="text-2xl md:text-3xl">🎯</span> Misión
                </h3>
                <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                  Representar de manera transparente y democrática a los estudiantes de la Escuela Profesional 
                  de Ingeniería Metalúrgica, promoviendo su bienestar académico, social y cultural, 
                  fomentando la participación activa en la vida universitaria y trabajando por el 
                  desarrollo integral de la comunidad estudiantil.
                </p>
              </div>
              
              <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
                <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                  <span className="text-2xl md:text-3xl">🌟</span> Visión
                </h3>
                <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                  Ser un Centro Federado líder en representación estudiantil, reconocido por su gestión 
                  transparente, innovadora y comprometida con la excelencia académica, que contribuya 
                  al fortalecimiento de la identidad profesional y el desarrollo de líderes metalúrgicos 
                  con responsabilidad social.
                </p>
              </div>
            </div>

            {/* Juramentación */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-2xl md:text-3xl">📜</span> Ceremonia de Juramentación
              </h3>
              <div className="space-y-3 md:space-y-4 text-gray-200 leading-relaxed text-sm md:text-base">
                <p>
                  Por medio de la presente, y a nombre del Centro Federado de la Escuela Profesional de Ingeniería Metalúrgica, 
                  nos es grato informar sobre la <strong className="text-[#FFD700]">ceremonia de juramentación y acreditación oficial</strong> 
                  del nuevo Centro Federado, electo democráticamente para el semestre académico 2025-2.
                </p>
                <p>
                  La ceremonia se llevó a cabo el <strong className="text-[#FFD700]">viernes 15 de agosto de 2025</strong>, 
                  con la participación de la Federación Universitaria del Cusco y autoridades universitarias, 
                  formalizando el reconocimiento de la nueva directiva ante la comunidad universitaria.
                </p>
                <p>
                  Este evento tuvo como propósito dar inicio oficial a las funciones de representación 
                  del estudiantado de nuestra escuela profesional, estableciendo un compromiso de 
                  servicio transparente y dedicado al bienestar estudiantil.
                </p>
              </div>
            </div>

            {/* Lema */}
            <div className="text-center bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#FFD700]/30">
              <h2 className="text-2xl md:text-4xl font-black text-[#FFD700] mb-3 md:mb-4">
                "Representación transparente, compromiso estudiantil"
              </h2>
              <p className="text-gray-300 text-base md:text-lg">
                Lema del Centro Federado EPIMT 2025-2
              </p>
            </div>
          </div>
        );

      case 'directiva':
        return (
          <div className="space-y-8">
            {/* Información de la Directiva */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">👥</span> Directiva Electa 2025-2
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Proceso Democrático</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Elección democrática estudiantil
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Juramentación oficial el 15 de agosto
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Reconocimiento por la FUC
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Compromiso de Gestión</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Transparencia en todas las decisiones
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Participación activa estudiantil
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">▸</span>
                      Mejora continua de servicios
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Lista completa de la directiva */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-2xl md:text-3xl">📋</span> Integrantes Oficiales
              </h3>
              <p className="text-gray-200 mb-4 md:mb-6 text-base md:text-lg">
                La directiva está conformada por 15 estudiantes comprometidos con la representación 
                y el bienestar de toda la comunidad estudiantil de Ingeniería Metalúrgica.
              </p>
              
              <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {directivaActual.map((miembro, index) => (
                  <div key={index} className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-colors">
                    <div className="text-2xl md:text-3xl mb-3 md:mb-4">
                      {index === 0 ? '👑' : index === 1 ? '🥈' : '👨‍💼'}
                    </div>
                    <h4 className="text-[#FFD700] font-bold mb-2 text-sm md:text-base">{miembro.cargo}</h4>
                    <p className="text-gray-300 text-xs md:text-sm font-medium mb-2">{miembro.nombre}</p>
                    <p className="text-gray-400 text-xs">Cód. {miembro.codigo}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-2xl md:text-3xl">⚡</span> Estructura Organizacional
              </h3>
              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#FFD700] mb-3 md:mb-4">Áreas de Responsabilidad</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {comisiones.map((comision, index) => (
                      <div key={index} className="bg-[#1a1a1a]/40 rounded-lg md:rounded-xl p-2 md:p-3 border border-[#FFD700]/10">
                        <span className="text-gray-200 text-xs md:text-sm font-medium">{comision}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#FFD700] mb-3 md:mb-4">Funciones Principales</h4>
                  <ul className="space-y-2 md:space-y-3 text-gray-200 text-sm md:text-base">
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Representación ante autoridades universitarias</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Gestión de bienestar estudiantil</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Coordinación de actividades académicas</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Promoción de eventos culturales y deportivos</span>
                    </li>
                    <li className="flex items-start gap-2 md:gap-3">
                      <span className="text-green-400 text-base md:text-lg">✓</span>
                      <span>Comunicación transparente con estudiantes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'comisiones':
        return (
          <div className="space-y-8">
            {/* Información General de Comisiones */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-2xl md:text-3xl">🛠️</span> Comisiones de Trabajo
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">🎓</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Académica</div>
                  <div className="text-gray-400 text-xs md:text-sm">Coordinación</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">🎨</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Cultura</div>
                  <div className="text-gray-400 text-xs md:text-sm">Arte y Eventos</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">⚽</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Deportes</div>
                  <div className="text-gray-400 text-xs md:text-sm">Recreación</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">🌱</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Ambiente</div>
                  <div className="text-gray-400 text-xs md:text-sm">Sostenibilidad</div>
                </div>
              </div>
            </div>

            {/* Estructura de Comisiones por Áreas */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-2xl md:text-3xl">📊</span> Organización por Áreas
              </h3>
              <p className="text-gray-200 mb-6 md:mb-8 text-center">
                Cada comisión está dirigida por un secretario especializado y trabaja de manera 
                coordinada para el bienestar integral de los estudiantes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  { area: 'Académica', responsables: ['Asuntos Académicos', 'Acreditación'], icon: '📚' },
                  { area: 'Bienestar', responsables: ['Eventos Sociales', 'Recreación y Deportes'], icon: '🎉' },
                  { area: 'Comunicación', responsables: ['Medios y Difusión', 'Organización'], icon: '📢' },
                  { area: 'Desarrollo', responsables: ['Infraestructura', 'Investigación'], icon: '🏗️' },
                  { area: 'Cultural', responsables: ['Arte y Cultura', 'Proyección Social'], icon: '🎭' },
                  { area: 'Gestión', responsables: ['Economía', 'Actas y Archivos'], icon: '💼' }
                ].map((area, index) => (
                  <div key={index} className="bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#FFD700]/10 text-center group hover:border-[#FFD700]/30 transition-all duration-300">
                    <div className="text-3xl md:text-4xl mb-3 md:mb-4">{area.icon}</div>
                    <h4 className="text-[#FFD700] font-bold text-base md:text-lg mb-2 md:mb-3">{area.area}</h4>
                    <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                      {area.responsables.map((resp, i) => (
                        <li key={i}>• {resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Proyectos Actuales */}
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-3xl p-8 border border-[#FFD700]/30">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">🚀</span> Proyectos en Desarrollo
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#FFD700] mb-3">Proyectos Prioritarios</h4>
                  <ul className="space-y-2 text-gray-200 text-sm">
                    <li>• Mejora de espacios de estudio</li>
                    <li>• Programa de tutoría académica</li>
                    <li>• Festival cultural EPIMT 2025</li>
                    <li>• Campaña de sostenibilidad ambiental</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#FFD700] mb-3">Iniciativas Sociales</h4>
                  <ul className="space-y-2 text-gray-200 text-sm">
                    <li>• Apoyo social estudiantil</li>
                    <li>• Intercambio académico</li>
                    <li>• Competencias deportivas</li>
                    <li>• Actividades de integración</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contacto':
        return (
          <div className="space-y-8">
            {/* Información de Contacto */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#FFD700]/20">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">📱</span> Canales de Comunicación
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Contacto Directo</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">📧</span>
                      <span>presidente.cf.epimt@unsaac.edu.pe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">📞</span>
                      <span>+51 984 123 456 (WhatsApp)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">📍</span>
                      <span>Oficina EPIMT, 2do piso</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#FFD700] mb-3">Redes Sociales</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">📘</span>
                      <span>Facebook: CF EPIMT UNSAAC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">📷</span>
                      <span>Instagram: @cf_epimt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-1">🐦</span>
                      <span>Twitter: @CF_EPIMT</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Horarios de Atención */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#FFD700]/20">
              <h3 className="text-xl md:text-2xl font-bold text-[#FFD700] mb-4 md:mb-6 flex items-center gap-3">
                <span className="text-2xl md:text-3xl">🕒</span> Horarios de Atención
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">📅</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Lunes a Viernes</div>
                  <div className="text-gray-400 text-xs md:text-sm">8:00 AM - 5:00 PM</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-[#1a1a1a]/40 rounded-xl md:rounded-2xl border border-[#FFD700]/10">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">📅</div>
                  <div className="text-[#FFD700] font-bold text-base md:text-lg">Sábados</div>
                  <div className="text-gray-400 text-xs md:text-sm">9:00 AM - 1:00 PM</div>
                </div>
              </div>
            </div>

            {/* Buzón de Sugerencias */}
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-3xl p-8 border border-[#FFD700]/30">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-3">
                <span className="text-3xl">💡</span> Participación Estudiantil
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#FFD700] mb-3">Canales de Participación</h4>
                  <ul className="space-y-2 text-gray-200 text-sm">
                    <li>• Buzón de sugerencias digital</li>
                    <li>• Asambleas estudiantiles mensuales</li>
                    <li>• Consultas públicas en redes</li>
                    <li>• Reuniones abiertas semanales</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#FFD700] mb-3">Compromiso de Respuesta</h4>
                  <ul className="space-y-2 text-gray-200 text-sm">
                    <li>• Respuesta en máximo 48 horas</li>
                    <li>• Seguimiento de propuestas</li>
                    <li>• Transparencia en decisiones</li>
                    <li>• Informes de gestión periódicos</li>
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
      {/* Efectos de fondo mejorados */}
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
              <span className="text-3xl sm:text-4xl">🏛️</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide mb-3 sm:mb-4 md:mb-6">
            <span className="block">Centro</span>
            <span className="block">Federado</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#C9B037] font-medium tracking-wide max-w-2xl mx-auto mb-6 md:mb-8">
            Escuela Profesional de Ingeniería Metalúrgica
          </p>

          {/* Stats rápidas épicas */}
          <div className="flex justify-center gap-8 text-center mb-8">
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-2xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">15</div>
              <div className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors duration-300">Directivos</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-2xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">10</div>
              <div className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors duration-300">Comisiones</div>
            </div>
            <div className="group cursor-pointer hover:scale-110 transition-all duration-500">
              <div className="text-2xl font-bold text-[#FFD700] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">2025</div>
              <div className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors duration-300">Gestión</div>
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

        {/* Navegación por pestañas - Responsive */}
        <div className="px-4 mb-6 md:mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto no-scrollbar pb-2 md:pb-0 snap-x snap-mandatory">
              {secciones.map((seccion) => (
                <button
                  key={seccion.id}
                  onClick={() => setSeccionActiva(seccion.id as any)}
                  className={`flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-2xl font-medium transition-all duration-300 text-xs sm:text-sm md:text-base flex-shrink-0 snap-start ${
                    seccionActiva === seccion.id
                      ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/25'
                      : 'bg-[#1a1a1a]/60 text-gray-300 hover:bg-[#1a1a1a]/80 border border-[#FFD700]/20'
                  }`}
                  aria-pressed={seccionActiva === seccion.id}
                >
                  <span className="text-sm sm:text-base md:text-lg">{seccion.icono}</span>
                  <span className="hidden sm:inline whitespace-nowrap">{seccion.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="px-4 pb-12 md:pb-16">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Representacion;
