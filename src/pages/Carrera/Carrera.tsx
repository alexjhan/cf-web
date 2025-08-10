
function Carrera() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/80 to-black/60 py-12 px-2 md:px-8 flex flex-col items-center">
      {/* Encabezado elegante */}
      <div className="w-full max-w-5xl flex flex-col items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#FFD700] drop-shadow mb-2 text-center tracking-tight" style={{letterSpacing: '-0.03em', textShadow: '0 2px 12px #18181b'}}>Ingeniería en Metalurgia</h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto text-center">Forma parte de la transformación de la industria y la investigación de materiales. Descubre una carrera con futuro, innovación y alto impacto.</p>
      </div>
      {/* Descripción y ventajas */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-black/40 rounded-2xl p-8 flex flex-col justify-center shadow-lg border border-[#FFD700]/20">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-2">¿Por qué estudiar Metalurgia?</h2>
          <p className="text-gray-200 mb-4">La Ingeniería en Metalurgia te prepara para enfrentar los desafíos de la industria moderna, con énfasis en innovación, sostenibilidad y tecnología de materiales.</p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Alta empleabilidad y proyección internacional</li>
            <li>Laboratorios de última generación</li>
            <li>Docentes con experiencia en la industria</li>
            <li>Enfoque en investigación y desarrollo</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 justify-center">
          <div className="bg-[#FFD700]/10 rounded-xl p-6 text-[#FFD700] font-semibold shadow border border-[#FFD700]/20 text-center text-lg">+90% empleabilidad</div>
          <div className="bg-[#FFD700]/10 rounded-xl p-6 text-[#FFD700] font-semibold shadow border border-[#FFD700]/20 text-center text-lg">Red de convenios con empresas</div>
          <div className="bg-[#FFD700]/10 rounded-xl p-6 text-[#FFD700] font-semibold shadow border border-[#FFD700]/20 text-center text-lg">Acreditación nacional</div>
        </div>
      </div>
      {/* Perfil de egreso */}
      <div className="w-full max-w-5xl mb-12 bg-black/40 rounded-2xl p-8 shadow-lg border border-[#FFD700]/20">
        <h2 className="text-2xl font-bold text-[#FFD700] mb-2 text-center">Perfil de Egreso</h2>
        <p className="text-gray-200 mb-2 text-center">El egresado será capaz de:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-1 max-w-2xl mx-auto">
          <li>Gestionar procesos metalúrgicos industriales</li>
          <li>Desarrollar proyectos de innovación en materiales</li>
          <li>Trabajar en equipos multidisciplinarios</li>
          <li>Aplicar principios de sostenibilidad y ética profesional</li>
        </ul>
      </div>
      {/* Plan de estudios (ejemplo visual) */}
      <div className="w-full max-w-5xl mb-12">
        <h2 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">Plan de Estudios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/40 rounded-xl p-6 text-gray-200 shadow border border-[#FFD700]/20">
            <h3 className="font-bold text-[#FFD700] mb-1 text-center">1° Año</h3>
            <ul className="text-sm text-center">
              <li>Química General</li>
              <li>Matemáticas I</li>
              <li>Introducción a la Metalurgia</li>
            </ul>
          </div>
          <div className="bg-black/40 rounded-xl p-6 text-gray-200 shadow border border-[#FFD700]/20">
            <h3 className="font-bold text-[#FFD700] mb-1 text-center">2° Año</h3>
            <ul className="text-sm text-center">
              <li>Física</li>
              <li>Termodinámica</li>
              <li>Metalurgia Física</li>
            </ul>
          </div>
          <div className="bg-black/40 rounded-xl p-6 text-gray-200 shadow border border-[#FFD700]/20">
            <h3 className="font-bold text-[#FFD700] mb-1 text-center">3° Año</h3>
            <ul className="text-sm text-center">
              <li>Procesos de Fundición</li>
              <li>Corrosión y Protección</li>
              <li>Materiales Avanzados</li>
            </ul>
          </div>
          <div className="bg-black/40 rounded-xl p-6 text-gray-200 shadow border border-[#FFD700]/20">
            <h3 className="font-bold text-[#FFD700] mb-1 text-center">4° Año</h3>
            <ul className="text-sm text-center">
              <li>Gestión de Proyectos</li>
              <li>Práctica Profesional</li>
              <li>Tesis de Grado</li>
            </ul>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="w-full max-w-5xl flex justify-center">
        <a href="#" className="px-6 py-3 rounded bg-[#FFD700] text-[#232946] font-bold shadow hover:bg-[#e6c200] transition">Descargar folleto</a>
      </div>
    </div>
  );
}

export default Carrera;
