function Inicio() {
  return (
    <div 
      className="min-h-screen text-white overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)'
      }}
    >
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
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mt-6 md:mt-8 mb-2 bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent drop-shadow-2xl tracking-wide">
              INGENIERÍA METALÚRGICA
            </h1>
            <p className="text-base md:text-xl text-[#C9B037] font-medium tracking-wider">
              UNIVERSIDAD MAYOR DE SAN ANDRÉS
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
          <div className="text-center mb-8 md:mb-12 px-4">
            <p className="text-sm md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Formamos ingenieros especializados en la transformación de minerales, 
              procesos metalúrgicos y desarrollo de materiales avanzados con tecnología de vanguardia.
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas mejoradas */}
      <div className="relative py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[#FFD700]">
            📊 Nuestra Excelencia en Números
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { number: "25+", label: "Años de Excelencia", delay: "0" },
              { number: "500+", label: "Graduados Exitosos", delay: "200" },
              { number: "15+", label: "Laboratorios Especializados", delay: "400" },
              { number: "98%", label: "Inserción Laboral", delay: "600" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group relative"
                style={{ animationDelay: `${stat.delay}ms` }}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative backdrop-blur-sm bg-gradient-to-br from-[#1a1a1a]/70 via-[#2a2a2a]/50 to-[#0f0f0f]/70 p-4 md:p-6 rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 text-center group-hover:scale-105">
                  <div className="text-2xl md:text-4xl font-black text-[#FFD700] mb-1 md:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separador con gradiente */}
      <div className="relative py-8 md:py-12">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFD700] rounded-full animate-pulse"></div>
      </div>

      {/* Grid de Navegación Mejorado */}
      <div className="relative py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            
            {/* Carrera */}
            <div className="group mx-auto">
              <a href="/carrera" className="block">
                <div className="relative">
                  <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-56 h-56 md:w-64 md:h-64 relative transform group-hover:scale-105 transition-all duration-500 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #C9B037 100%)'
                    }}
                  >
                    <div className="absolute inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#FFD700]/20">
                      <div className="text-center">
                        <span className="text-5xl md:text-7xl block mb-2 md:mb-3 animate-pulse">🎓</span>
                        <div className="text-[#FFD700] font-black text-lg md:text-xl tracking-wider">CARRERA</div>
                        <div className="text-gray-400 text-xs mt-1">Información</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#FFD700] rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#C9B037] rounded-full opacity-80 animate-pulse delay-300"></div>
                </div>
              </a>
            </div>

            {/* Cursos */}
            <div className="group mx-auto">
              <a href="/cursos" className="block">
                <div className="relative">
                  <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#B8860B]/20 to-[#FFD700]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-56 h-56 md:w-64 md:h-64 relative transform group-hover:scale-105 transition-all duration-500 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)'
                    }}
                  >
                    <div className="absolute inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#B8860B]/20">
                      <div className="text-center">
                        <span className="text-5xl md:text-7xl block mb-2 md:mb-3 animate-pulse delay-100">📚</span>
                        <div className="text-[#FFD700] font-black text-lg md:text-xl tracking-wider">CURSOS</div>
                        <div className="text-gray-400 text-xs mt-1">Materias</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#B8860B] rounded-full opacity-60 animate-ping delay-100"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#FFD700] rounded-full opacity-80 animate-pulse delay-300"></div>
                </div>
              </a>
            </div>

            {/* Documentos */}
            <div className="group mx-auto">
              <a href="/documentos" className="block">
                <div className="relative">
                  <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#C9B037]/20 to-[#FFF8DC]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-56 h-56 md:w-64 md:h-64 relative transform group-hover:scale-105 transition-all duration-500 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #C9B037 0%, #FFF8DC 100%)'
                    }}
                  >
                    <div className="absolute inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#C9B037]/20">
                      <div className="text-center">
                        <span className="text-5xl md:text-7xl block mb-2 md:mb-3 animate-pulse delay-200">📋</span>
                        <div className="text-[#FFD700] font-black text-lg md:text-xl tracking-wider">DOCUMENTOS</div>
                        <div className="text-gray-400 text-xs mt-1">Recursos</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#C9B037] rounded-full opacity-60 animate-ping delay-200"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#FFF8DC] rounded-full opacity-80 animate-pulse delay-400"></div>
                </div>
              </a>
            </div>

            {/* Docentes */}
            <div className="group mx-auto">
              <a href="/docentes" className="block">
                <div className="relative">
                  <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#FFD700]/20 to-[#B8860B]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-56 h-56 md:w-64 md:h-64 relative transform group-hover:scale-105 transition-all duration-500 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)'
                    }}
                  >
                    <div className="absolute inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#FFD700]/20">
                      <div className="text-center">
                        <span className="text-5xl md:text-7xl block mb-2 md:mb-3 animate-pulse delay-300">👥</span>
                        <div className="text-[#FFD700] font-black text-lg md:text-xl tracking-wider">DOCENTES</div>
                        <div className="text-gray-400 text-xs mt-1">Profesores</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-3 h-3 md:w-5 md:h-5 bg-[#FFD700] rounded-full opacity-60 animate-ping delay-300"></div>
                  <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-2 h-2 md:w-4 md:h-4 bg-[#B8860B] rounded-full opacity-80 animate-pulse delay-500"></div>
                </div>
              </a>
            </div>

            {/* Oportunidades */}
            <div className="group mx-auto">
              <a href="/oportunidades" className="block">
                <div className="relative">
                  <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#FFF8DC]/20 to-[#C9B037]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-56 h-56 md:w-64 md:h-64 relative transform group-hover:scale-105 transition-all duration-500 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FFF8DC 0%, #C9B037 100%)'
                    }}
                  >
                    <div className="absolute inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#FFF8DC]/20">
                      <div className="text-center">
                        <span className="text-5xl md:text-7xl block mb-2 md:mb-3 animate-pulse delay-400">💼</span>
                        <div className="text-[#FFD700] font-black text-lg md:text-xl tracking-wider">OPORTUNIDADES</div>
                        <div className="text-gray-400 text-xs mt-1">Trabajo & Educación</div>
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
                  <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#B8860B]/20 to-[#FFD700]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div 
                    className="w-56 h-56 md:w-64 md:h-64 relative transform group-hover:scale-105 transition-all duration-500 shadow-xl rounded-2xl mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)'
                    }}
                  >
                    <div className="absolute inset-3 bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#0f0f0f]/95 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#B8860B]/20">
                      <div className="text-center">
                        <span className="text-5xl md:text-7xl block mb-2 md:mb-3 animate-pulse delay-500">📰</span>
                        <div className="text-[#FFD700] font-black text-lg md:text-xl tracking-wider">NOTICIAS</div>
                        <div className="text-gray-400 text-xs mt-1">Actualidad</div>
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

      {/* Sección de Contacto */}
      <div className="relative py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-sm bg-gradient-to-br from-[#1a1a1a]/70 via-[#2a2a2a]/50 to-[#0f0f0f]/70 p-6 md:p-8 rounded-3xl border border-[#FFD700]/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#FFD700]">
              Contáctanos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm md:text-base">
              <div className="flex items-center justify-center md:justify-start">
                <span className="mr-2">📧</span>
                <span>metalurgia@umsa.bo</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="mr-2">📞</span>
                <span>+591 2 2591234</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="mr-2">📍</span>
                <span>Ciudad Universitaria, La Paz</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="mr-2">💼</span>
                <span>Facultad de Ingeniería</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Mejorado */}
      <footer className="relative py-12 md:py-16 px-4 mt-16 md:mt-20">
        {/* Separador superior */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent mb-12"></div>
        
        <div className="max-w-6xl mx-auto">
          {/* Contenido principal del footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            
            {/* Información de la Universidad */}
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-4">
                <div className="backdrop-blur-sm bg-gradient-to-br from-[#1a1a1a]/60 via-[#2a2a2a]/40 to-[#0f0f0f]/60 p-3 rounded-full border border-[#FFD700]/30">
                  <img 
                    src="/assets/logo-metalurgia.jpg" 
                    alt="Logo Ingeniería Metalúrgica" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-[#FFD700] font-bold text-lg mb-3">
                Ingeniería Metalúrgica
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Formando profesionales de excelencia en metalurgia, procesamiento de minerales y desarrollo de materiales avanzados.
              </p>
            </div>

            {/* Enlaces Rápidos */}
            <div className="text-center md:text-left">
              <h4 className="text-[#FFD700] font-semibold text-lg mb-4">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/carrera" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    📚 Información de la Carrera
                  </a>
                </li>
                <li>
                  <a href="/cursos" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    📖 Materias y Cursos
                  </a>
                </li>
                <li>
                  <a href="/docentes" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    👥 Cuerpo Docente
                  </a>
                </li>
                <li>
                  <a href="/oportunidades" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    � Oportunidades y Especializaciones
                  </a>
                </li>
              </ul>
            </div>

            {/* Recursos */}
            <div className="text-center md:text-left">
              <h4 className="text-[#FFD700] font-semibold text-lg mb-4">
                Recursos
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/documentos" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    📋 Documentos Académicos
                  </a>
                </li>
                <li>
                  <a href="/oportunidades" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    💼 Oportunidades Laborales
                  </a>
                </li>
                <li>
                  <a href="/noticias" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    📰 Noticias y Eventos
                  </a>
                </li>
                <li>
                  <a href="/chatbot" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    🤖 Consulta Inteligente
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="text-center md:text-left">
              <h4 className="text-[#FFD700] font-semibold text-lg mb-4">
                Contacto
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">📧</span>
                  <a href="mailto:metalurgia@umsa.bo" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                    metalurgia@umsa.bo
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">📞</span>
                  <span className="text-gray-400">+591 2 2591234</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">📍</span>
                  <span className="text-gray-400">Ciudad Universitaria</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-[#C9B037] mr-2">🏛️</span>
                  <span className="text-gray-400">La Paz, Bolivia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent mb-8"></div>

          {/* Información de copyright y enlaces adicionales */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-1">
                © 2025 Ingeniería Metalúrgica - Universidad Mayor de San Andrés
              </p>
              <p className="text-gray-500 text-xs">
                Todos los derechos reservados | Desarrollado con tecnología de vanguardia
              </p>
            </div>
            
            {/* Enlaces de políticas */}
            <div className="flex space-x-6 text-xs">
              <a href="/politica-privacidad" className="text-gray-500 hover:text-[#FFD700] transition-colors duration-300">
                Política de Privacidad
              </a>
              <a href="/terminos" className="text-gray-500 hover:text-[#FFD700] transition-colors duration-300">
                Términos de Uso
              </a>
              <a href="/accesibilidad" className="text-gray-500 hover:text-[#FFD700] transition-colors duration-300">
                Accesibilidad
              </a>
            </div>
          </div>

          {/* Universidad Mayor de San Andrés */}
          <div className="text-center mt-8 pt-6 border-t border-[#FFD700]/10">
            <p className="text-[#C9B037] text-sm font-medium">
              🏛️ Universidad Mayor de San Andrés
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Fundada en 1830 | Excelencia Académica y Tradición
            </p>
          </div>
        </div>
        
        {/* Efectos decorativos del footer */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#FFD700]/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-[#C9B037]/4 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-[#FFD700]/2 rounded-full blur-3xl"></div>
        
        {/* Partículas decorativas */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#FFD700]/60 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-[#C9B037]/50 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-10 left-20 w-2 h-2 bg-[#FFD700]/40 rounded-full animate-pulse delay-1000"></div>
      </footer>
    </div>
  );
}

export default Inicio;
