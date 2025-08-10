// src/pages/Inicio/Inicio.tsx

function Inicio() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans" style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}>
       {/* Encabezado */}
        <div className="text-left sm:text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight font-extrabold mb-4 animate-fade-in" style={{ color: '#C9B037', textShadow: '0 2px 8px #000' }}>
            CF de Ingeniería Metalúrgica
          </h1>
          <h2 className="text-base sm:text-2xl md:text-3xl font-medium mb-3 animate-fade-in" style={{ color: '#F3F4F6' }}>
            Descubre todo sobre nuestra escuela y accede a información relevante en segundos.
          </h2>
          <p className="text-sm sm:text-base md:text-lg animate-fade-in" style={{ color: '#A5B4FC' }}>
            Utiliza nuestra IA para resolver tus dudas académicas, conocer especialidades, docentes, cursos y mucho más. ¡Explora y aprende con nosotros!
          </p>
        </div>
    {/* Botón de IA con borde animado */}
        <div className="text-center mt-6 sm:mt-8 mb-6 sm:mb-8 flex justify-center px-4">
          <div
            className="relative rounded-4xl p-[1px] w-full sm:w-auto"
            style={{
              background: 'conic-gradient(from var(--border-angle, 0deg), #FFD700 0%, #000 50%, #FFD700 100%)',
              animation: 'border-rotate 3s linear infinite'
            }}
          >
            <a
              href="/chatbot"
              className="inline-block w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#23232a] hover:bg-[#FFD700] hover:text-black text-white font-semibold rounded-4xl shadow-lg transition duration-200 text-base sm:text-lg tracking-wide"
              style={{ display: 'block', position: 'relative', zIndex: 2 }}
            >
              Haz tu consulta inteligente
            </a>
          </div>
        </div>
        
    {/* Línea separadora formal */}
    <div className="relative w-full my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t" style={{ borderColor: '#A3A3A3', borderWidth: '1px' }}></div>
      </div>
      <div className="relative flex justify-center">
        <span className="text-base font-semibold text-gray-300 bg-[#23232a] px-6 py-2 rounded-full border shadow-sm" style={{ borderColor: '#A3A3A3', borderWidth: '1px' }}>
          Páginas de Interés
        </span>
      </div>
    </div>

    {/* Tarjetas de navegación formales */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Fila 1: Carrera + Noticias */}
        <a href="/carrera" className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-6 p-6 sm:p-8 h-auto sm:h-56 text-white rounded-2xl shadow-lg bg-[#23232a] border border-gray-700 flex flex-col justify-center items-center hover:border-[#FFD700] hover:shadow-xl transition-all duration-300">
          <div className="text-4xl sm:text-5xl mb-2">🎓</div>
          <h2 className="text-xl font-semibold">Carrera</h2>
        </a>
        <a href="/noticias" className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-6 p-6 sm:p-8 h-auto sm:h-56 text-white rounded-2xl shadow-lg bg-[#23232a] border border-gray-700 flex flex-col justify-center items-center hover:border-[#FFD700] hover:shadow-xl transition-all duration-300">
          <div className="text-4xl sm:text-5xl mb-2">📰</div>
          <h2 className="text-xl font-semibold">Noticias</h2>
        </a>
        {/* Fila 2: Cursos + Documentos + Especialidades */}
        <a href="/cursos" className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-4 p-6 sm:p-8 h-auto sm:h-52 text-white rounded-2xl shadow-lg bg-[#23232a] border border-gray-700 flex flex-col justify-center items-center hover:border-[#FFD700] hover:shadow-xl transition-all duration-300">
          <div className="text-3xl sm:text-4xl mb-2">📚</div>
          <h2 className="text-lg font-medium">Cursos</h2>
        </a>
        <a href="/documentos" className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-4 p-6 sm:p-8 h-auto sm:h-52 text-white rounded-2xl shadow-lg bg-[#23232a] border border-gray-700 flex flex-col justify-center items-center hover:border-[#FFD700] hover:shadow-xl transition-all duration-300">
          <div className="text-3xl sm:text-4xl mb-2">📄</div>
          <h2 className="text-lg font-medium">Documentos</h2>
        </a>
        <a href="/especialidades" className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-4 p-6 sm:p-8 h-auto sm:h-52 text-white rounded-2xl shadow-lg bg-[#23232a] border border-gray-700 flex flex-col justify-center items-center hover:border-[#FFD700] hover:shadow-xl transition-all duration-300">
          <div className="text-3xl sm:text-4xl mb-2">🧪</div>
          <h2 className="text-lg font-medium">Especialidades</h2>
        </a>
        {/* Fila 3: Oportunidades */}
        <a href="/oportunidades" className="col-span-2 md:col-span-3 lg:col-span-6 xl:col-span-12 p-6 sm:p-8 h-auto sm:h-60 text-white rounded-2xl shadow-lg bg-[#23232a] border border-gray-700 flex flex-col justify-center items-center hover:border-[#FFD700] hover:shadow-xl transition-all duration-300">
          <div className="text-4xl sm:text-5xl mb-2">💼</div>
          <h2 className="text-lg font-medium">Oportunidades</h2>
        </a>
        {/* Fila 4: Contacto */}
        <a href="/contacto" className="col-span-2 md:col-span-3 lg:col-span-6 xl:col-span-12 p-6 sm:p-8 h-auto sm:h-40 text-white rounded-2xl shadow-lg bg-[#23232a] border border-gray-700 flex flex-col justify-center items-center hover:border-[#FFD700] hover:shadow-xl transition-all duration-300">
          <div className="text-3xl sm:text-4xl mb-2">📞</div>
          <h2 className="text-lg font-medium">Contacto</h2>
        </a>
      </div>
    </div>

    {/* Pie de página formal (responsive) */}
    <footer className="mt-16 sm:mt-20 w-full flex justify-center items-center">
      <div className="w-full max-w-7xl rounded-[2.5rem] mx-4 sm:mx-8 lg:mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-14 bg-[#18181b] relative shadow-2xl border border-[#23232a] overflow-hidden mb-8">
        {/* Fondo SVG decorativo */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full -z-10" viewBox="0 0 500 500" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ opacity: 0.08 }}>
          <path d="M426.771 73.1847C329.201 -24.3949 170.868 -24.3949 73.2292 73.1847C-24.4097 170.834 -24.4097 329.114 73.2292 426.763C170.868 524.412 329.132 524.412 426.771 426.763C524.41 329.114 524.41 170.834 426.771 73.1847ZM80.5903 286.818C42.6042 248.828 58.0208 171.876 114.965 114.925C171.91 57.9748 248.854 42.5565 286.84 80.5466C324.826 118.537 309.41 195.489 252.465 252.439C195.521 309.39 118.576 324.808 80.5903 286.818ZM382.604 382.592C350.035 415.165 306.076 423.916 284.41 402.247C262.674 380.508 271.493 336.615 304.062 304.042C336.632 271.469 380.59 262.718 402.257 284.387C423.993 306.126 415.174 350.019 382.604 382.592Z" fill="#FAFBFF" fillOpacity="0.04"></path>
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Logo y nombre */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img src="/assets/logo-metalurgia.jpg" alt="Logo Ingeniería Metalúrgica UNSAAC" className="w-12 h-12 mr-3 rounded-full object-cover" />
              <span className="text-2xl font-bold text-white">Centro Federado</span>
            </div>
            <span className="text-gray-400 text-sm">© 2025 Centro Federado de Ingeniería Metalúrgica. Todos los derechos reservados.</span>
          </div>

          {/* Enlaces */}
          <div className="grid grid-cols-2 gap-8 justify-items-center md:justify-items-end text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Social Media</h3>
              <ul className="space-y-1">
                <li><a href="https://web.facebook.com/p/Centro-Federado-de-Ingenier%C3%ADa-Metal%C3%BArgica-Unsaac-cusco-100068360975655/?_rdc=1&_rdr#" className="text-gray-300 hover:text-[#FFD700] transition">Facebook</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition">Instagram</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition">LinkedIn</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Legal</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition">Términos de Servicio</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
      </div>
  );
}

export default Inicio;
