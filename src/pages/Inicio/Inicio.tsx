import { Helmet } from 'react-helmet-async';
function Inicio() {
  return (
    <div 
      className="min-h-screen text-white overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)'
      }}
    >
      <Helmet>
        <title>Centro Federado Ingeniería Metalúrgica - Inicio</title>
        <meta name="description" content="Portal del Centro Federado de Ingeniería Metalúrgica: representación estudiantil, recursos académicos, noticias y oportunidades." />
        <link rel="canonical" href="https://centro-federado.netlify.app/inicio" />
        <meta property="og:title" content="Centro Federado Ingeniería Metalúrgica - Inicio" />
        <meta property="og:description" content="Representación estudiantil y recursos de Ingeniería Metalúrgica." />
        <meta property="og:url" content="https://centro-federado.netlify.app/inicio" />
      </Helmet>
      {/* CSS Personalizado para borde animado */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @property --border-angle {
            syntax: "<angle>";
            inherits: false;
            initial-value: 0deg;
          }
          
          @keyframes border-rotate {
            to {
              --border-angle: 360deg;
            }
          }
          
          .animate-rotate-border {
            animation: border-rotate 3s linear infinite;
          }
        `
      }} />

      {/* Efectos futuristas */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C9B037]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8860B]/6 rounded-full blur-3xl"></div>
        
        {/* Partículas flotantes */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-[#FFD700]/60 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-[#C9B037]/70 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-32 left-20 w-4 h-4 bg-[#FFD700]/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-[#B8860B]/80 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-[#C9B037]/60 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-[#FFD700]/70 rounded-full animate-pulse delay-800"></div>
      </div>

      {/* Header Responsive */}
      <div className="relative py-8 md:py-16 px-4">
        <div className="relative max-w-6xl mx-auto">
          
          {/* Logo Principal Responsive */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block relative">
              <div className="backdrop-blur-sm bg-gradient-to-br from-[#1a1a1a]/60 via-[#2a2a2a]/40 to-[#0f0f0f]/60 p-4 md:p-6 rounded-full border border-[#FFD700]/30 shadow-2xl hover:shadow-[#FFD700]/40 transition-all duration-500">
                <img 
                  src="/assets/logo-metalurgia.jpg" 
                  alt="Logo Ingeniería Metalúrgica" 
                  className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mx-auto"
                />
              </div>
              
              {/* Efectos decorativos alrededor del logo */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#FFD700] rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-[#C9B037] rounded-full opacity-80 animate-pulse delay-300"></div>
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#B8860B] rounded-full opacity-70 animate-pulse delay-600"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#FFD700]/70 rounded-full opacity-50 animate-ping delay-1000"></div>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mt-6 md:mt-8 mb-2 bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent drop-shadow-2xl tracking-wide leading-tight">
              <span className="block">CENTRO FEDERADO</span>
              <span className="block">INGENIERÍA METALÚRGICA</span>
            </h1>
            <p className="text-base md:text-xl text-[#C9B037] font-medium tracking-wider">
              UNIVERSIDAD NACIONAL DE SAN ANTONIO ABAD DEL CUSCO
            </p>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-[#FFD700] to-[#C9B037] mx-auto mt-3 md:mt-4 rounded-full"></div>
          </div>

          {/* Botón con Borde Animado */}
          <div className="text-center mt-6 md:mt-8 mb-4 md:mb-6 flex justify-center px-4">
            <a
              href="/chatbot"
              className="group relative inline-block"
            >
              {/* Container padre con gradiente cónico animado */}
              <div 
                className="bg-conic-gradient rounded-full p-px animate-rotate-border"
                style={{
                  background: 'conic-gradient(from var(--border-angle), transparent 0%, transparent 70%, #FFD700 75%, #C9B037 85%, #FFD700 90%, transparent 95%, transparent 100%)'
                }}
              >
                {/* Contenedor hijo con fondo sólido */}
                <div className="bg-black rounded-full px-8 py-3">
                  <span className="text-[#FFD700] font-medium group-hover:text-[#FFF8DC] transition-colors duration-300">
                    Consulta Inteligente
                  </span>
                </div>
              </div>
            </a>
          </div>
          
          {/* Descripción */}
          <div className="text-center mb-4 md:mb-6 px-4">
                <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto leading-snug">
                  Acompañamos a los estudiantes de Ingeniería Metalúrgica, velando por sus derechos y promoviendo su desarrollo integral con compromiso y unidad.
                </p>
              </div>
        </div>
      </div>

  {/* Separador con gradiente (espacio reducido) */}
  <div className="relative py-3 md:py-5">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFD700] rounded-full animate-pulse"></div>
      </div>

      {/* Sección de Navegación / Otras páginas */}
  <div className="relative pt-2 pb-6 md:pt-4 md:pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 place-items-center">
            
            {/* Carrera */}
            <div className="group mx-auto">
              <a href="/carrera" className="block">
                <div className="relative">
                  <div className="absolute -inset-1 sm:-inset-2 md:-inset-3 bg-gradient-to-r from-[#FFD700]/10 to-[#C9B037]/10 rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-full h-44 sm:h-52 md:h-56 lg:h-60 max-w-[220px] sm:max-w-[230px] md:max-w-[240px] relative transform group-hover:scale-[1.02] md:group-hover:scale-[1.04] transition-all duration-400 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #C9B037 100%)'
                    }}
                  >
                    <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#FFD700]/25">
                      <div className="text-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl block mb-1.5 md:mb-2 animate-pulse">🎓</span>
                        <div className="text-[#FFD700] font-black text-sm sm:text-base md:text-lg tracking-wider">CARRERA</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs mt-1">Información</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#FFD700] rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#C9B037] rounded-full opacity-80 animate-pulse delay-300"></div>
                </div>
              </a>
            </div>

            {/* Representación Estudiantil */}
            <div className="group mx-auto">
              <a href="/representacion" className="block">
                <div className="relative">
                  <div className="absolute -inset-1 sm:-inset-2 md:-inset-3 bg-gradient-to-r from-[#FFD700]/10 to-[#B8860B]/10 rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div 
                    className="w-full h-44 sm:h-52 md:h-56 lg:h-60 max-w-[220px] sm:max-w-[230px] md:max-w-[240px] relative transform group-hover:scale-[1.02] md:group-hover:scale-[1.04] transition-all duration-400 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)'
                    }}
                  >
                    <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#FFD700]/25">
                      <div className="text-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl block mb-1.5 md:mb-2 animate-pulse delay-100">🤝</span>
                        <div className="text-[#FFD700] font-black text-sm sm:text-base md:text-lg tracking-wider leading-tight">REPRESENTACIÓN</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs mt-1">Estudiantil</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#FFD700] rounded-full opacity-60 animate-ping delay-100"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#B8860B] rounded-full opacity-80 animate-pulse delay-300"></div>
                </div>
              </a>
            </div>

            {/* Documentos */}
            <div className="group mx-auto">
              <a href="/documentos" className="block">
                <div className="relative">
                  <div className="absolute -inset-1 sm:-inset-2 md:-inset-3 bg-gradient-to-r from-[#C9B037]/10 to-[#FFF8DC]/10 rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-full h-44 sm:h-52 md:h-56 lg:h-60 max-w-[220px] sm:max-w-[230px] md:max-w-[240px] relative transform group-hover:scale-[1.02] md:group-hover:scale-[1.04] transition-all duration-400 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #C9B037 0%, #FFF8DC 100%)'
                    }}
                  >
                    <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#C9B037]/25">
                      <div className="text-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl block mb-1.5 md:mb-2 animate-pulse delay-200">📋</span>
                        <div className="text-[#FFD700] font-black text-sm sm:text-base md:text-lg tracking-wider">DOCUMENTOS</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs mt-1">Recursos</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#C9B037] rounded-full opacity-60 animate-ping delay-200"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#FFF8DC] rounded-full opacity-80 animate-pulse delay-400"></div>
                </div>
              </a>
            </div>

            {/* Cursos */}
            <div className="group mx-auto">
              <a href="/cursos" className="block">
                <div className="relative">
                  <div className="absolute -inset-1 sm:-inset-2 md:-inset-3 bg-gradient-to-r from-[#B8860B]/10 to-[#FFD700]/10 rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-full h-44 sm:h-52 md:h-56 lg:h-60 max-w-[220px] sm:max-w-[230px] md:max-w-[240px] relative transform group-hover:scale-[1.02] md:group-hover:scale-[1.04] transition-all duration-400 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)'
                    }}
                  >
                    <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#B8860B]/25">
                      <div className="text-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl block mb-1.5 md:mb-2 animate-pulse delay-300">📚</span>
                        <div className="text-[#FFD700] font-black text-sm sm:text-base md:text-lg tracking-wider">CURSOS</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs mt-1">Materias</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#B8860B] rounded-full opacity-60 animate-ping delay-300"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#FFD700] rounded-full opacity-80 animate-pulse delay-500"></div>
                </div>
              </a>
            </div>

            {/* Oportunidades */}
            <div className="group mx-auto">
              <a href="/oportunidades" className="block">
                <div className="relative">
                  <div className="absolute -inset-1 sm:-inset-2 md:-inset-3 bg-gradient-to-r from-[#FFF8DC]/10 to-[#C9B037]/10 rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-full h-44 sm:h-52 md:h-56 lg:h-60 max-w-[220px] sm:max-w-[230px] md:max-w-[240px] relative transform group-hover:scale-[1.02] md:group-hover:scale-[1.04] transition-all duration-400 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FFF8DC 0%, #C9B037 100%)'
                    }}
                  >
                    <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#FFF8DC]/25">
                      <div className="text-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl block mb-1.5 md:mb-2 animate-pulse delay-400">💼</span>
                        <div className="text-[#FFD700] font-black text-sm sm:text-base md:text-lg tracking-wider text-center leading-snug">OPORTUNIDADES</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs mt-1">Trabajo & Educación</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#FFF8DC] rounded-full opacity-60 animate-ping delay-400"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#C9B037] rounded-full opacity-80 animate-pulse delay-600"></div>
                </div>
              </a>
            </div>

            {/* Noticias */}
            <div className="group mx-auto">
              <a href="/noticias" className="block">
                <div className="relative">
                  <div className="absolute -inset-1 sm:-inset-2 md:-inset-3 bg-gradient-to-r from-[#B8860B]/10 to-[#FFD700]/10 rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-full h-44 sm:h-52 md:h-56 lg:h-60 max-w-[220px] sm:max-w-[230px] md:max-w-[240px] relative transform group-hover:scale-[1.02] md:group-hover:scale-[1.04] transition-all duration-400 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)'
                    }}
                  >
                    <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#B8860B]/25">
                      <div className="text-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl block mb-1.5 md:mb-2 animate-pulse delay-500">📰</span>
                        <div className="text-[#FFD700] font-black text-sm sm:text-base md:text-lg tracking-wider">NOTICIAS</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs mt-1">Actualidad</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#B8860B] rounded-full opacity-60 animate-ping delay-500"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#FFD700] rounded-full opacity-80 animate-pulse delay-700"></div>
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>
      {/* Footer Simplificado */}
      <footer className="mt-16 md:mt-20 bg-black/40 border-t border-[#FFD700]/20">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-14">
            {/* Identidad */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <img src="/assets/logo-metalurgia.jpg" alt="Logo" className="w-12 h-12 rounded-full object-cover border border-[#FFD700]/40" />
                <div>
                  <h3 className="text-[#FFD700] font-bold text-lg leading-snug">Centro Federado<br className="hidden sm:block" /> Ing. Metalúrgica - UNSAAC</h3>
                  <p className="text-gray-400 text-xs mt-1">Representación estudiantil | Formación | Comunidad</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs max-w-md leading-relaxed">
                Espacio informativo y de apoyo académico de los estudiantes de Ingeniería Metalúrgica. Para asuntos oficiales diríjase a la Escuela Profesional o a la UNSAAC.
              </p>
            </div>

            {/* Navegación */}
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <a href="/carrera" className="text-gray-400 hover:text-[#FFD700] transition-colors">Carrera</a>
              <a href="/cursos" className="text-gray-400 hover:text-[#FFD700] transition-colors">Cursos</a>
              <a href="/documentos" className="text-gray-400 hover:text-[#FFD700] transition-colors">Documentos</a>
              <a href="/representacion" className="text-gray-400 hover:text-[#FFD700] transition-colors">Representación</a>
              <a href="/oportunidades" className="text-gray-400 hover:text-[#FFD700] transition-colors">Oportunidades</a>
              <a href="/noticias" className="text-gray-400 hover:text-[#FFD700] transition-colors">Noticias</a>
              <a href="/chatbot" className="text-gray-400 hover:text-[#FFD700] transition-colors col-span-2">Consulta Inteligente</a>
            </div>

            {/* Contacto (actualizar si se requiere) */}
            <div className="flex-1 space-y-3 text-sm">
              <h4 className="text-[#FFD700] font-semibold mb-2">Contacto</h4>
              <div className="flex items-start gap-2">
                <span className="text-[#C9B037]">📘</span>
                <a href="https://web.facebook.com/profile.php?id=100068360975655" className="text-gray-400 hover:text-[#FFD700] break-all">Facebook del CC-FF UNSAAC - Cusco</a>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#C9B037]">📱</span>
                <a href="https://whatsapp.com/channel/0029VbAySaRAzNbu2W7OFq1C" className="text-gray-400 hover:text-[#FFD700] break-all">Canal de Whatsapp de Ing. Met.  2025-2</a>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#C9B037]">📍</span>
                <span className="text-gray-400">Ciudad Universitaria de Perayoc, Cusco - Perú</span>
              </div>
            </div>
          </div>

          {/* Línea y base */}
          <div className="mt-10 pt-6 border-t border-[#FFD700]/10 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="space-y-1">
              <p className="text-gray-500 text-xs">© 2025 Centro Federado de Ingeniería Metalúrgica - UNSAAC</p>
              <p className="text-gray-600 text-[11px]">Desarrollado por <span className="text-[#FFD700] font-medium">Alex J. Geri</span></p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-xs text-gray-500">
              <a href="/politica-privacidad" className="hover:text-[#FFD700]">Privacidad</a>
              <a href="/terminos" className="hover:text-[#FFD700]">Términos</a>
              <a href="/accesibilidad" className="hover:text-[#FFD700]">Accesibilidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;
