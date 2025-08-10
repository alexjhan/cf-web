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
          descripcion: "Especialización avanzada en técnicas de extracción de metales, optimización de procesos pirometalúrgicos, hidrometalúrgicos y electrometalúrgicos.",
          areas: ["Pirometalurgia Avanzada", "Hidrometalurgia", "Electrometalurgia", "Simulación de Procesos"],
          duracion: "2 años",
          tipo: "Maestría",
          requisitos: ["Título universitario en Ingeniería", "Experiencia profesional de 2 años", "Tesis de grado"],
          salidas: ["Investigador especializado", "Gerente de planta metalúrgica", "Consultor en procesos extractivos"],
          nivel: "Posgrado"
        },
        {
          id: 2,
          titulo: "Especialización en Fundición y Aleaciones",
          descripcion: "Programa intensivo sobre procesos de fundición, desarrollo de aleaciones especiales y control de calidad en productos metalúrgicos.",
          areas: ["Fundición de Precisión", "Aleaciones Especiales", "Control de Calidad", "Metalurgia Física"],
          duracion: "1 año",
          tipo: "Especialización",
          requisitos: ["Título universitario", "Conocimientos básicos de metalurgia"],
          salidas: ["Especialista en fundición", "Supervisor de calidad", "Desarrollador de aleaciones"],
          nivel: "Especialización"
        },
        {
          id: 3,
          titulo: "Maestría en Materiales Avanzados",
          descripcion: "Programa de posgrado enfocado en el desarrollo, caracterización y aplicación de materiales metálicos avanzados para la industria moderna.",
          areas: ["Nanomateriales", "Biomateriales", "Materiales Inteligentes", "Caracterización Avanzada"],
          duracion: "2 años",
          tipo: "Maestría",
          requisitos: ["Título universitario en ciencias o ingeniería", "Conocimientos de física y química", "Inglés intermedio"],
          salidas: ["Investigador en materiales", "Desarrollador de productos", "Especialista en I+D"],
          nivel: "Posgrado"
        },
        {
          id: 4,
          titulo: "Especialización en Soldadura Industrial",
          descripcion: "Programa especializado en técnicas avanzadas de soldadura, inspección de soldaduras y gestión de procesos de unión metalúrgica.",
          areas: ["Soldadura por Arco", "Soldadura por Resistencia", "Inspección de Soldaduras", "Metalurgia de la Soldadura"],
          duracion: "1 año",
          tipo: "Especialización",
          requisitos: ["Título técnico o universitario", "Experiencia en soldadura básica"],
          salidas: ["Inspector de soldaduras certificado", "Supervisor de soldadura", "Consultor en procesos de unión"],
          nivel: "Especialización"
        }
      ];
      setEspecialidades(defaultData);
      localStorage.setItem('especialidades', JSON.stringify(defaultData));
    }
  }, []);

  const getNivelColor = (nivel: string): string => {
    switch (nivel) {
      case 'Posgrado':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Especialización':
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Especialidades y Posgrados
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Amplía tus conocimientos con nuestros programas de especialización y posgrado en metalurgia
          </p>
        </div>

        {especialidades.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay especialidades disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {especialidades.map((especialidad) => (
              <div
                key={especialidad.id}
                className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`h-2 ${getNivelColor(especialidad.nivel)}`}></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {especialidad.titulo}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getNivelColor(especialidad.nivel)}`}>
                      {especialidad.nivel}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {especialidad.descripcion}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Áreas de Estudio:</h4>
                      <div className="flex flex-wrap gap-1">
                        {especialidad.areas.map((area, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-yellow-400 font-semibold">Duración:</span>
                        <span className="text-gray-300 ml-2">{especialidad.duracion}</span>
                      </div>
                      <div>
                        <span className="text-yellow-400 font-semibold">Tipo:</span>
                        <span className="text-gray-300 ml-2">{especialidad.tipo}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Requisitos:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {especialidad.requisitos.map((requisito, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            {requisito}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Salidas Profesionales:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {especialidad.salidas.map((salida, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            {salida}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                      Más Información
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Especialidades;
