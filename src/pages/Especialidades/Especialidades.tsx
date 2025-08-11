import React, { useState, useEffect } from 'react';

interface Especialidad {
  id: number;
  titulo: string;
  descripcion: string;
  areas: string[];
  duracion: string;
  tipo: string;
  requisitos: string[];
  salidas: string[];
  nivel: string;
}

const Especialidades: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  useEffect(() => {
    // Cargar especialidades del localStorage
    const storedEspecialidades = localStorage.getItem('especialidades');
    if (storedEspecialidades) {
      const parsedEspecialidades = JSON.parse(storedEspecialidades);
      // Filtrar solo posgrados y especializaciones
      const filtered = parsedEspecialidades.filter((esp: Especialidad) => 
        esp.nivel === 'Posgrado' || esp.nivel === 'Especialización'
      );
      setEspecialidades(filtered);
    } else {
      // Datos iniciales predeterminados (solo posgrados y especializaciones)
      const defaultData: Especialidad[] = [
        {
          id: 1,
          titulo: "Maestría en Metalurgia Extractiva",
          descripcion: "Especialización avanzada en técnicas de extracción de metales, optimización de procesos pirometalúrgicos, hidrometalúrgicos y electrometalúrgicos para la industria minera moderna.",
          areas: ["Pirometalurgia Avanzada", "Hidrometalurgia", "Electrometalurgia", "Simulación de Procesos", "Mineralurgia"],
          duracion: "2 años",
          tipo: "Maestría",
          requisitos: ["Título universitario en Ingeniería", "Experiencia profesional de 2 años", "Tesis de grado", "Examen de admisión"],
          salidas: ["Investigador especializado", "Gerente de planta metalúrgica", "Consultor en procesos extractivos", "Docente universitario"],
          nivel: "Posgrado"
        },
        {
          id: 2,
          titulo: "Especialización en Fundición y Aleaciones",
          descripcion: "Programa intensivo sobre procesos de fundición, desarrollo de aleaciones especiales y control de calidad en productos metalúrgicos de alta precisión.",
          areas: ["Fundición de Precisión", "Aleaciones Especiales", "Control de Calidad", "Metalurgia Física", "Tratamientos Térmicos"],
          duracion: "1 año",
          tipo: "Especialización",
          requisitos: ["Título universitario", "Conocimientos básicos de metalurgia", "Experiencia laboral de 1 año"],
          salidas: ["Especialista en fundición", "Supervisor de calidad", "Desarrollador de aleaciones", "Técnico especializado"],
          nivel: "Especialización"
        },
        {
          id: 3,
          titulo: "Maestría en Ciencia de Materiales",
          descripcion: "Programa avanzado enfocado en la investigación y desarrollo de nuevos materiales metalúrgicos con aplicaciones industriales innovadoras.",
          areas: ["Nanotecnología", "Materiales Compuestos", "Caracterización de Materiales", "Investigación Aplicada"],
          duracion: "2 años",
          tipo: "Maestría",
          requisitos: ["Título universitario en Ingeniería o Ciencias", "Promedio mínimo de 14", "Proyecto de investigación"],
          salidas: ["Investigador en I+D", "Especialista en materiales", "Consultor técnico", "Gerente de innovación"],
          nivel: "Posgrado"
        }
      ];
      setEspecialidades(defaultData);
      localStorage.setItem('especialidades', JSON.stringify(defaultData));
    }
  }, []);

  return (
    <div 
      className="min-h-screen bg-gray-900"
      style={{ 
        background: 'radial-gradient(ellipse at center, #2d2d3a 0%, #1a1a1f 70%, #0f0f12 100%)'
      }}
    >
      {/* Header Simple con Logo */}
      <div className="relative overflow-hidden py-16">
        {/* Efectos de fondo sutiles */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/3"></div>
        
        {/* Contenido del Header */}
        <div className="relative z-10 text-center px-4">
          <div className="max-w-5xl mx-auto">
            {/* Logo */}
            <div className="inline-block mb-8">
              <div className="backdrop-blur-sm bg-gradient-to-br from-[#1a1a2e]/60 via-[#16213e]/40 to-[#0f0f23]/60 p-6 rounded-full border border-[#FFD700]/30 shadow-2xl hover:shadow-[#FFD700]/40 transition-all duration-500">
                <img 
                  src="/assets/logo-metalurgia.jpg" 
                  alt="Logo Metalurgia" 
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
              </div>
            </div>
            
            {/* Título simple */}
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent mb-6 tracking-wider">
              ESPECIALIDADES
            </h1>
            
            {/* Subtítulo */}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Programas de <span className="text-[#FFD700] font-bold">posgrado y especialización</span> de excelencia académica
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Estadísticas */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-5xl font-black text-[#FFD700] mb-3">2+</div>
              <div className="text-gray-300 font-medium">Años de Duración</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-5xl font-black text-[#FFD700] mb-3">100%</div>
              <div className="text-gray-300 font-medium">Empleabilidad</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-5xl font-black text-[#FFD700] mb-3">15+</div>
              <div className="text-gray-300 font-medium">Docentes Expertos</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#23232a] to-[#18181b] rounded-3xl border border-[#C9B037]/30 hover:border-[#FFD700] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-5xl font-black text-[#FFD700] mb-3">5★</div>
              <div className="text-gray-300 font-medium">Calidad Académica</div>
            </div>
          </div>
        </div>
      </div>

      {/* Especialidades en Layout Zigzag */}
      <div className="py-20 px-4">
        <div className="max-w-8xl mx-auto">
          {especialidades.length > 0 ? (
            <div className="space-y-24">
              {especialidades.map((especialidad, index) => (
                <div 
                  key={especialidad.id} 
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
                >
                  {/* Figura Futurista Premium */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {/* Container principal futurista */}
                      <div className="w-80 h-80 relative transform group-hover:scale-110 transition-all duration-500">
                        {/* Glow effect */}
                        <div className="absolute -inset-6 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        
                        {/* Container futurista principal */}
                        <div 
                          className="w-full h-full relative rounded-3xl shadow-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${index % 3 === 0 ? '#FFD700' : index % 3 === 1 ? '#C9B037' : '#B8860B'} 0%, ${index % 3 === 0 ? '#C9B037' : index % 3 === 1 ? '#B8860B' : '#FFD700'} 100%)`
                          }}
                        >
                          {/* Interior con backdrop blur */}
                          <div className="absolute inset-4 bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/90 to-[#0f0f23]/95 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-[#FFD700]/20">
                            <div className="text-center">
                              <span className="text-8xl block mb-4">
                                {especialidad.tipo === 'Maestría' ? '🎯' : especialidad.tipo === 'Especialización' ? '⚡' : '🔬'}
                              </span>
                              <div className="text-[#FFD700] font-black text-xl tracking-wider">
                                {especialidad.tipo.toUpperCase()}
                              </div>
                              <div className="text-gray-400 text-sm mt-2 font-medium">
                                {especialidad.duracion}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Partículas decorativas (sin rebote) */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FFD700] rounded-full opacity-60 animate-ping"></div>
                        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#C9B037] rounded-full opacity-80 animate-pulse"></div>
                        <div className="absolute top-1/2 -left-6 w-4 h-4 bg-[#B8860B] rounded-full opacity-70 animate-pulse delay-300"></div>
                        <div className="absolute top-1/2 -right-6 w-3 h-3 bg-[#FFD700] rounded-full opacity-60 animate-pulse delay-700"></div>
                      </div>
                    </div>
                  </div>

                  {/* Contenido de la Especialidad */}
                  <div className="flex-1 max-w-4xl">
                    <div className="bg-gradient-to-br from-[#23232a] via-[#1e1e26] to-[#18181b] rounded-[2rem] p-10 border border-[#C9B037]/30 hover:border-[#FFD700]/60 transition-all duration-500 shadow-2xl hover:shadow-[#FFD700]/10">
                      
                      {/* Badge superior */}
                      <div className="flex justify-between items-center mb-6">
                        <span 
                          className="px-6 py-3 rounded-full text-black font-bold text-base tracking-wider shadow-lg"
                          style={{ 
                            background: index % 3 === 0 ? '#FFD700' : index % 3 === 1 ? '#C9B037' : '#B8860B'
                          }}
                        >
                          {especialidad.tipo.toUpperCase()} • {especialidad.duracion}
                        </span>
                        <div className="text-4xl">
                          {index % 3 === 0 ? '🏆' : index % 3 === 1 ? '⭐' : '💎'}
                        </div>
                      </div>

                      {/* Título */}
                      <h3 
                        className="text-4xl font-bold mb-8 leading-tight"
                        style={{ color: '#FFD700' }}
                      >
                        {especialidad.titulo}
                      </h3>

                      {/* Descripción */}
                      <p className="text-gray-300 text-xl leading-relaxed mb-10 font-light">
                        {especialidad.descripcion}
                      </p>

                      {/* Grid de Información Mejorado */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Áreas de Estudio */}
                        <div className="bg-gradient-to-br from-[#1a1a20] to-[#151518] rounded-2xl p-6 border border-[#C9B037]/20">
                          <h4 className="text-[#C9B037] font-bold mb-5 flex items-center text-lg">
                            <span className="mr-3 text-2xl">📚</span>
                            Áreas de Estudio
                          </h4>
                          <ul className="space-y-3">
                            {especialidad.areas.map((area, idx) => (
                              <li key={idx} className="text-gray-300 flex items-start group">
                                <span className="text-[#FFD700] mr-3 text-lg group-hover:scale-125 transition-transform">●</span>
                                <span className="group-hover:text-white transition-colors">{area}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Salidas Profesionales */}
                        <div className="bg-gradient-to-br from-[#1a1a20] to-[#151518] rounded-2xl p-6 border border-[#C9B037]/20">
                          <h4 className="text-[#C9B037] font-bold mb-5 flex items-center text-lg">
                            <span className="mr-3 text-2xl">💼</span>
                            Salidas Profesionales
                          </h4>
                          <ul className="space-y-3">
                            {especialidad.salidas.map((salida, idx) => (
                              <li key={idx} className="text-gray-300 flex items-start group">
                                <span className="text-[#FFD700] mr-3 text-lg group-hover:scale-125 transition-transform">●</span>
                                <span className="group-hover:text-white transition-colors">{salida}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Requisitos como Tags */}
                      <div className="bg-gradient-to-r from-[#C9B037]/10 to-[#FFD700]/10 rounded-2xl p-6 border border-[#C9B037]/30 mb-8">
                        <h4 className="text-[#FFD700] font-bold mb-5 flex items-center text-lg">
                          <span className="mr-3 text-2xl">✅</span>
                          Requisitos de Ingreso
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          {especialidad.requisitos.map((requisito, idx) => (
                            <span 
                              key={idx} 
                              className="px-4 py-2 bg-[#18181b] text-gray-300 rounded-full border border-[#C9B037]/40 hover:border-[#FFD700] hover:text-white transition-all cursor-default"
                            >
                              {requisito}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          className="flex-1 px-8 py-4 bg-gradient-to-r from-[#C9B037] to-[#FFD700] text-black font-bold rounded-2xl hover:from-[#FFD700] hover:to-[#C9B037] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#FFD700]/30"
                          onClick={() => alert(`Más información sobre ${especialidad.titulo}`)}
                        >
                          Solicitar Información 📧
                        </button>
                        <button 
                          className="px-8 py-4 border-2 border-[#FFD700] text-[#FFD700] font-bold rounded-2xl hover:bg-[#FFD700] hover:text-black transition-all duration-300"
                          onClick={() => alert('Descargando plan de estudios...')}
                        >
                          Plan de Estudios 📄
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-8xl mb-8 animate-pulse">📖</div>
              <h3 className="text-3xl text-[#C9B037] font-bold mb-6">
                Especialidades en Desarrollo
              </h3>
              <p className="text-gray-400 max-w-lg mx-auto text-lg">
                Estamos trabajando en nuevos programas de especialización. 
                Pronto tendremos más opciones disponibles.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Llamativo */}
      <div className="bg-gradient-to-r from-[#1a1a1f] via-[#23232a] to-[#1a1a1f] py-20 mt-24 border-t border-[#C9B037]/30">
        <div className="max-w-5xl mx-auto text-center px-4">
          <div className="mb-8">
            <span className="text-6xl">🚀</span>
          </div>
          <h2 className="text-5xl font-bold text-[#FFD700] mb-8 leading-tight">
            ¿Listo para Especializar tu Carrera?
          </h2>
          <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Únete a la próxima generación de especialistas en metalurgia. 
            Desarrolla competencias avanzadas con los mejores profesionales del sector 
            y accede a oportunidades laborales de primer nivel.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-5 bg-[#FFD700] text-black font-bold text-lg rounded-2xl hover:bg-[#C9B037] transition-all duration-300 transform hover:scale-105 shadow-xl">
              Información de Admisiones 🎓
            </button>
            <button className="px-10 py-5 border-3 border-[#FFD700] text-[#FFD700] font-bold text-lg rounded-2xl hover:bg-[#FFD700] hover:text-black transition-all duration-300 transform hover:scale-105">
              Catálogo Completo 📚
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Especialidades;
