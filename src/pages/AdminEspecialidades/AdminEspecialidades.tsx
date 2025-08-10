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
  icono: string;
  nivel: 'Posgrado' | 'Especialización';
}

const AdminEspecialidades: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState<Partial<Especialidad>>({
    titulo: '',
    descripcion: '',
    areas: [],
    duracion: '',
    tipo: '',
    requisitos: [],
    salidas: [],
    icono: '',
    nivel: 'Especialización'
  });

  // Cargar especialidades desde localStorage
  useEffect(() => {
    const especialidadesGuardadas = localStorage.getItem('especialidades');
    if (especialidadesGuardadas) {
      setEspecialidades(JSON.parse(especialidadesGuardadas));
    } else {
      // Datos iniciales
      const especialidadesIniciales: Especialidad[] = [
        {
          id: 1,
          titulo: "Maestría en Metalurgia Extractiva",
          descripcion: "Especialización avanzada en técnicas de extracción de metales, optimización de procesos pirometalúrgicos, hidrometalúrgicos y electrometalúrgicos.",
          areas: ["Pirometalurgia Avanzada", "Hidrometalurgia", "Electrometalurgia", "Simulación de Procesos"],
          duracion: "2 años",
          tipo: "Posgrado",
          requisitos: ["Título de Ingeniero Metalurgista o afín", "Experiencia profesional mínima de 2 años", "Proyecto de investigación"],
          salidas: ["Especialista en extracción metalúrgica", "Gerente de operaciones mineras", "Consultor internacional", "Docente universitario"],
          icono: "🏭",
          nivel: "Posgrado"
        },
        {
          id: 2,
          titulo: "Especialización en Soldadura",
          descripcion: "Formación especializada en técnicas avanzadas de soldadura, inspección y certificación de procesos de unión de materiales metálicos.",
          areas: ["Soldadura por Arco", "Soldadura Especializada", "Inspección de Soldadura", "Certificación AWS"],
          duracion: "1 año",
          tipo: "Especialización Técnica",
          requisitos: ["Título de Ingeniero Metalurgista o Mecánico", "Conocimientos básicos de soldadura", "Certificación médica para soldadura"],
          salidas: ["Inspector de soldadura certificado", "Supervisor de soldadura", "Consultor en procesos de unión", "Instructor en soldadura"],
          icono: "⚡",
          nivel: "Especialización"
        }
      ];
      setEspecialidades(especialidadesIniciales);
      localStorage.setItem('especialidades', JSON.stringify(especialidadesIniciales));
    }
  }, []);

  // Guardar especialidades en localStorage
  const guardarEspecialidades = (nuevasEspecialidades: Especialidad[]) => {
    setEspecialidades(nuevasEspecialidades);
    localStorage.setItem('especialidades', JSON.stringify(nuevasEspecialidades));
  };

  // Manejar envío del formulario
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formulario.titulo || !formulario.descripcion) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (editandoId) {
      // Editar especialidad existente
      const especialidadesActualizadas = especialidades.map(esp =>
        esp.id === editandoId
          ? { ...formulario, id: editandoId } as Especialidad
          : esp
      );
      guardarEspecialidades(especialidadesActualizadas);
    } else {
      // Crear nueva especialidad
      const nuevaEspecialidad: Especialidad = {
        ...formulario,
        id: Date.now(),
      } as Especialidad;
      guardarEspecialidades([...especialidades, nuevaEspecialidad]);
    }

    // Resetear formulario
    setFormulario({
      titulo: '',
      descripcion: '',
      areas: [],
      duracion: '',
      tipo: '',
      requisitos: [],
      salidas: [],
      icono: '',
      nivel: 'Especialización'
    });
    setMostrarFormulario(false);
    setEditandoId(null);
  };

  // Editar especialidad
  const editarEspecialidad = (especialidad: Especialidad) => {
    setFormulario(especialidad);
    setEditandoId(especialidad.id);
    setMostrarFormulario(true);
  };

  // Eliminar especialidad
  const eliminarEspecialidad = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta especialidad?')) {
      const especialidadesFiltradas = especialidades.filter(esp => esp.id !== id);
      guardarEspecialidades(especialidadesFiltradas);
    }
  };

  const manejarCambioArrays = (campo: 'areas' | 'requisitos' | 'salidas', valor: string) => {
    const items = valor.split('\n').filter(item => item.trim() !== '');
    setFormulario({ ...formulario, [campo]: items });
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans" 
      style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: '#C9B037', textShadow: '0 2px 8px #000' }}
            >
              Administrar Especialidades
            </h1>
            <p className="text-xl" style={{ color: '#F3F4F6' }}>
              Gestiona las especialidades de posgrado y técnicas
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => {
                setMostrarFormulario(!mostrarFormulario);
                setEditandoId(null);
                setFormulario({
                  titulo: '',
                  descripcion: '',
                  areas: [],
                  duracion: '',
                  tipo: '',
                  requisitos: [],
                  salidas: [],
                  icono: '',
                  nivel: 'Especialización'
                });
              }}
              className="px-6 py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-colors"
            >
              {mostrarFormulario ? 'Cancelar' : '+ Nueva Especialidad'}
            </button>
            
            <button
              onClick={() => window.location.href = '/admin'}
              className="px-6 py-3 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black rounded-lg font-semibold transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-[#23232a] rounded-xl p-8 mb-12 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editandoId ? 'Editar Especialidad' : 'Nueva Especialidad'}
            </h2>
            
            <form onSubmit={manejarEnvio} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Título */}
                <div>
                  <label className="block text-white font-semibold mb-2">Título *</label>
                  <input
                    type="text"
                    value={formulario.titulo}
                    onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: Maestría en Metalurgia Extractiva"
                    required
                  />
                </div>

                {/* Nivel */}
                <div>
                  <label className="block text-white font-semibold mb-2">Nivel *</label>
                  <select
                    value={formulario.nivel}
                    onChange={(e) => setFormulario({ ...formulario, nivel: e.target.value as 'Posgrado' | 'Especialización' })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                  >
                    <option value="Especialización">Especialización</option>
                    <option value="Posgrado">Posgrado</option>
                  </select>
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-white font-semibold mb-2">Duración *</label>
                  <input
                    type="text"
                    value={formulario.duracion}
                    onChange={(e) => setFormulario({ ...formulario, duracion: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: 2 años"
                    required
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-white font-semibold mb-2">Tipo *</label>
                  <input
                    type="text"
                    value={formulario.tipo}
                    onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: Posgrado, Especialización Técnica"
                    required
                  />
                </div>

                {/* Icono */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">Icono (Emoji)</label>
                  <input
                    type="text"
                    value={formulario.icono}
                    onChange={(e) => setFormulario({ ...formulario, icono: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: 🏭, ⚡, 🔬"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-white font-semibold mb-2">Descripción *</label>
                <textarea
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none h-24"
                  placeholder="Descripción detallada de la especialidad"
                  required
                />
              </div>

              {/* Áreas de estudio */}
              <div>
                <label className="block text-white font-semibold mb-2">Áreas de Estudio (una por línea)</label>
                <textarea
                  value={formulario.areas?.join('\n') || ''}
                  onChange={(e) => manejarCambioArrays('areas', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none h-24"
                  placeholder="Pirometalurgia Avanzada&#10;Hidrometalurgia&#10;Electrometalurgia"
                />
              </div>

              {/* Requisitos */}
              <div>
                <label className="block text-white font-semibold mb-2">Requisitos (uno por línea)</label>
                <textarea
                  value={formulario.requisitos?.join('\n') || ''}
                  onChange={(e) => manejarCambioArrays('requisitos', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none h-24"
                  placeholder="Título de Ingeniero Metalurgista&#10;Experiencia mínima de 2 años"
                />
              </div>

              {/* Salidas profesionales */}
              <div>
                <label className="block text-white font-semibold mb-2">Salidas Profesionales (una por línea)</label>
                <textarea
                  value={formulario.salidas?.join('\n') || ''}
                  onChange={(e) => manejarCambioArrays('salidas', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none h-24"
                  placeholder="Especialista en extracción metalúrgica&#10;Gerente de operaciones mineras"
                />
              </div>

              {/* Botones del formulario */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-colors"
                >
                  {editandoId ? 'Actualizar' : 'Guardar'} Especialidad
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setEditandoId(null);
                    setFormulario({
                      titulo: '',
                      descripcion: '',
                      areas: [],
                      duracion: '',
                      tipo: '',
                      requisitos: [],
                      salidas: [],
                      icono: '',
                      nivel: 'Especialización'
                    });
                  }}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-300 hover:border-gray-500 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de especialidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {especialidades.map((especialidad) => (
            <div
              key={especialidad.id}
              className="bg-[#23232a] rounded-xl overflow-hidden border border-gray-700 hover:border-[#FFD700] transition-colors"
            >
              {/* Header */}
              <div className={`p-4 ${especialidad.nivel === 'Posgrado' ? 'bg-[#FFD700]' : 'bg-[#C9B037]'} text-black`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{especialidad.icono}</span>
                  <span className="text-sm font-semibold">{especialidad.nivel}</span>
                </div>
                <h3 className="text-lg font-bold">{especialidad.titulo}</h3>
                <p className="text-sm opacity-80">{especialidad.duracion}</p>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {especialidad.descripcion}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-white font-semibold text-sm mb-2">Áreas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {especialidad.areas.slice(0, 2).map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        {area}
                      </span>
                    ))}
                    {especialidad.areas.length > 2 && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-400 rounded text-xs">
                        +{especialidad.areas.length - 2} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => editarEspecialidad(especialidad)}
                    className="flex-1 px-3 py-2 bg-[#C9B037] hover:bg-[#FFD700] text-black rounded text-sm font-semibold transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarEspecialidad(especialidad.id)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay especialidades */}
        {especialidades.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧪</div>
            <h3 className="text-2xl font-bold text-white mb-2">No hay especialidades</h3>
            <p className="text-gray-300 mb-6">Comienza agregando tu primera especialidad</p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="px-6 py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-colors"
            >
              + Agregar Primera Especialidad
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEspecialidades;
