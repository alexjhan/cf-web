import React, { useState, useEffect } from 'react';

interface Oportunidad {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'Empleo' | 'Beca' | 'Concurso' | 'Evento' | 'Práctica';
  empresa: string;
  ubicacion: string;
  fechaPublicacion: string;
  fechaVencimiento: string;
  requisitos: string[];
  beneficios: string[];
  contacto: string;
  link?: string;
  salario?: string;
  modalidad: 'Presencial' | 'Remoto' | 'Híbrido';
  experiencia: string;
  activa: boolean;
}

const AdminOportunidades: React.FC = () => {
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [formulario, setFormulario] = useState<Partial<Oportunidad>>({
    titulo: '',
    descripcion: '',
    tipo: 'Empleo',
    empresa: '',
    ubicacion: '',
    fechaPublicacion: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    requisitos: [],
    beneficios: [],
    contacto: '',
    link: '',
    salario: '',
    modalidad: 'Presencial',
    experiencia: '',
    activa: true
  });

  // Cargar oportunidades desde localStorage
  useEffect(() => {
    const oportunidadesGuardadas = localStorage.getItem('oportunidades');
    if (oportunidadesGuardadas) {
      setOportunidades(JSON.parse(oportunidadesGuardadas));
    } else {
      // Datos iniciales
      const oportunidadesIniciales: Oportunidad[] = [
        {
          id: 1,
          titulo: "Ingeniero Metalurgista Jr.",
          descripcion: "Únete a nuestro equipo como Ingeniero Metalurgista Junior. Participarás en proyectos de extracción y procesamiento de minerales.",
          tipo: "Empleo",
          empresa: "Minera Las Bambas",
          ubicacion: "Cusco, Perú",
          fechaPublicacion: "2025-08-01",
          fechaVencimiento: "2025-09-15",
          requisitos: ["Título de Ingeniero Metalurgista", "Experiencia mínima 1 año", "Conocimientos en AutoCAD"],
          beneficios: ["Seguro médico completo", "Bonificaciones por desempeño", "Capacitación continua"],
          contacto: "rrhh@minera.com",
          link: "https://minera.com/empleos",
          salario: "S/ 4,500 - S/ 6,000",
          modalidad: "Presencial",
          experiencia: "1-3 años",
          activa: true
        },
        {
          id: 2,
          titulo: "Beca de Maestría en Metalurgia",
          descripcion: "Beca completa para estudios de maestría en universidades internacionales. Cubre matrícula, manutención y materiales.",
          tipo: "Beca",
          empresa: "Ministerio de Educación",
          ubicacion: "Internacional",
          fechaPublicacion: "2025-07-20",
          fechaVencimiento: "2025-10-30",
          requisitos: ["Título universitario con promedio mínimo 14", "Carta de motivación", "Referencias académicas"],
          beneficios: ["Matrícula completa", "Gastos de manutención", "Seguro estudiantil"],
          contacto: "becas@minedu.gob.pe",
          link: "https://pronabec.gob.pe",
          modalidad: "Presencial",
          experiencia: "Egresado reciente",
          activa: true
        }
      ];
      setOportunidades(oportunidadesIniciales);
      localStorage.setItem('oportunidades', JSON.stringify(oportunidadesIniciales));
    }
  }, []);

  // Guardar oportunidades en localStorage
  const guardarOportunidades = (nuevasOportunidades: Oportunidad[]) => {
    setOportunidades(nuevasOportunidades);
    localStorage.setItem('oportunidades', JSON.stringify(nuevasOportunidades));
  };

  // Manejar envío del formulario
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formulario.titulo || !formulario.descripcion || !formulario.empresa) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (editandoId) {
      // Editar oportunidad existente
      const oportunidadesActualizadas = oportunidades.map(oport =>
        oport.id === editandoId
          ? { ...formulario, id: editandoId } as Oportunidad
          : oport
      );
      guardarOportunidades(oportunidadesActualizadas);
    } else {
      // Crear nueva oportunidad
      const nuevaOportunidad: Oportunidad = {
        ...formulario,
        id: Date.now(),
      } as Oportunidad;
      guardarOportunidades([...oportunidades, nuevaOportunidad]);
    }

    // Resetear formulario
    resetearFormulario();
  };

  const resetearFormulario = () => {
    setFormulario({
      titulo: '',
      descripcion: '',
      tipo: 'Empleo',
      empresa: '',
      ubicacion: '',
      fechaPublicacion: new Date().toISOString().split('T')[0],
      fechaVencimiento: '',
      requisitos: [],
      beneficios: [],
      contacto: '',
      link: '',
      salario: '',
      modalidad: 'Presencial',
      experiencia: '',
      activa: true
    });
    setMostrarFormulario(false);
    setEditandoId(null);
  };

  // Editar oportunidad
  const editarOportunidad = (oportunidad: Oportunidad) => {
    setFormulario(oportunidad);
    setEditandoId(oportunidad.id);
    setMostrarFormulario(true);
  };

  // Eliminar oportunidad
  const eliminarOportunidad = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta oportunidad?')) {
      const oportunidadesFiltradas = oportunidades.filter(oport => oport.id !== id);
      guardarOportunidades(oportunidadesFiltradas);
    }
  };

  // Alternar estado activo
  const alternarEstado = (id: number) => {
    const oportunidadesActualizadas = oportunidades.map(oport =>
      oport.id === id ? { ...oport, activa: !oport.activa } : oport
    );
    guardarOportunidades(oportunidadesActualizadas);
  };

  const manejarCambioArrays = (campo: 'requisitos' | 'beneficios', valor: string) => {
    const items = valor.split('\n').filter(item => item.trim() !== '');
    setFormulario({ ...formulario, [campo]: items });
  };

  // Filtrar oportunidades
  const oportunidadesFiltradas = filtroTipo === 'todas' 
    ? oportunidades 
    : oportunidades.filter(oport => oport.tipo === filtroTipo);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Empleo': return 'bg-[#FFD700]';
      case 'Beca': return 'bg-[#C9B037]';
      case 'Concurso': return 'bg-[#B8860B]';
      case 'Evento': return 'bg-[#DAA520]';
      case 'Práctica': return 'bg-[#F0E68C]';
      default: return 'bg-[#FFD700]';
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans" 
      style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: '#C9B037', textShadow: '0 2px 8px #000' }}
            >
              Administrar Oportunidades
            </h1>
            <p className="text-xl" style={{ color: '#F3F4F6' }}>
              Gestiona empleos, becas, concursos y eventos
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => {
                setMostrarFormulario(!mostrarFormulario);
                if (!mostrarFormulario) resetearFormulario();
              }}
              className="px-6 py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-colors"
            >
              {mostrarFormulario ? 'Cancelar' : '+ Nueva Oportunidad'}
            </button>
            
            <button
              onClick={() => window.location.href = '/admin'}
              className="px-6 py-3 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black rounded-lg font-semibold transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['todas', 'Empleo', 'Beca', 'Concurso', 'Evento', 'Práctica'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroTipo === tipo
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#23232a] text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tipo === 'todas' ? 'Todas' : tipo}
              {tipo !== 'todas' && (
                <span className="ml-2 text-sm">
                  ({oportunidades.filter(o => o.tipo === tipo).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-[#23232a] rounded-xl p-8 mb-12 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editandoId ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
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
                    placeholder="Ej: Ingeniero Metalurgista Jr."
                    required
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-white font-semibold mb-2">Tipo *</label>
                  <select
                    value={formulario.tipo}
                    onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value as Oportunidad['tipo'] })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                  >
                    <option value="Empleo">Empleo</option>
                    <option value="Beca">Beca</option>
                    <option value="Concurso">Concurso</option>
                    <option value="Evento">Evento</option>
                    <option value="Práctica">Práctica</option>
                  </select>
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-white font-semibold mb-2">Empresa/Institución *</label>
                  <input
                    type="text"
                    value={formulario.empresa}
                    onChange={(e) => setFormulario({ ...formulario, empresa: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: Minera Las Bambas"
                    required
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-white font-semibold mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={formulario.ubicacion}
                    onChange={(e) => setFormulario({ ...formulario, ubicacion: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: Lima, Perú"
                  />
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-white font-semibold mb-2">Modalidad</label>
                  <select
                    value={formulario.modalidad}
                    onChange={(e) => setFormulario({ ...formulario, modalidad: e.target.value as Oportunidad['modalidad'] })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>

                {/* Experiencia */}
                <div>
                  <label className="block text-white font-semibold mb-2">Experiencia Requerida</label>
                  <input
                    type="text"
                    value={formulario.experiencia}
                    onChange={(e) => setFormulario({ ...formulario, experiencia: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: 1-3 años, Sin experiencia"
                  />
                </div>

                {/* Salario */}
                <div>
                  <label className="block text-white font-semibold mb-2">Salario (opcional)</label>
                  <input
                    type="text"
                    value={formulario.salario}
                    onChange={(e) => setFormulario({ ...formulario, salario: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Ej: S/ 4,500 - S/ 6,000"
                  />
                </div>

                {/* Fecha de vencimiento */}
                <div>
                  <label className="block text-white font-semibold mb-2">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={formulario.fechaVencimiento}
                    onChange={(e) => setFormulario({ ...formulario, fechaVencimiento: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                  />
                </div>

                {/* Contacto */}
                <div>
                  <label className="block text-white font-semibold mb-2">Contacto</label>
                  <input
                    type="text"
                    value={formulario.contacto}
                    onChange={(e) => setFormulario({ ...formulario, contacto: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="Email o teléfono de contacto"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-white font-semibold mb-2">Link (opcional)</label>
                  <input
                    type="url"
                    value={formulario.link}
                    onChange={(e) => setFormulario({ ...formulario, link: e.target.value })}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none"
                    placeholder="https://..."
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
                  placeholder="Descripción detallada de la oportunidad"
                  required
                />
              </div>

              {/* Requisitos */}
              <div>
                <label className="block text-white font-semibold mb-2">Requisitos (uno por línea)</label>
                <textarea
                  value={formulario.requisitos?.join('\n') || ''}
                  onChange={(e) => manejarCambioArrays('requisitos', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none h-24"
                  placeholder="Título universitario&#10;Experiencia en el área&#10;Conocimiento de AutoCAD"
                />
              </div>

              {/* Beneficios */}
              <div>
                <label className="block text-white font-semibold mb-2">Beneficios (uno por línea)</label>
                <textarea
                  value={formulario.beneficios?.join('\n') || ''}
                  onChange={(e) => manejarCambioArrays('beneficios', e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none h-24"
                  placeholder="Seguro médico&#10;Bonificaciones&#10;Capacitación continua"
                />
              </div>

              {/* Botones del formulario */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-colors"
                >
                  {editandoId ? 'Actualizar' : 'Guardar'} Oportunidad
                </button>
                <button
                  type="button"
                  onClick={resetearFormulario}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-300 hover:border-gray-500 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de oportunidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {oportunidadesFiltradas.map((oportunidad) => (
            <div
              key={oportunidad.id}
              className={`bg-[#23232a] rounded-xl overflow-hidden border border-gray-700 hover:border-[#FFD700] transition-colors ${
                !oportunidad.activa ? 'opacity-60' : ''
              }`}
            >
              {/* Header */}
              <div className={`p-4 ${getTipoColor(oportunidad.tipo)} text-black`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{oportunidad.tipo}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    oportunidad.activa ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {oportunidad.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{oportunidad.titulo}</h3>
                <p className="text-sm opacity-80">{oportunidad.empresa}</p>
                <p className="text-xs opacity-70">{oportunidad.ubicacion}</p>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {oportunidad.descripcion}
                </p>
                
                {oportunidad.salario && (
                  <div className="mb-3">
                    <span className="text-[#FFD700] font-semibold text-sm">💰 {oportunidad.salario}</span>
                  </div>
                )}

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-xs text-gray-400">
                    <span>📍 {oportunidad.modalidad}</span>
                    {oportunidad.experiencia && (
                      <span className="ml-3">👥 {oportunidad.experiencia}</span>
                    )}
                  </div>
                  {oportunidad.fechaVencimiento && (
                    <div className="text-xs text-gray-400">
                      📅 Vence: {new Date(oportunidad.fechaVencimiento).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => editarOportunidad(oportunidad)}
                    className="flex-1 px-3 py-2 bg-[#C9B037] hover:bg-[#FFD700] text-black rounded text-sm font-semibold transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => alternarEstado(oportunidad.id)}
                    className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${
                      oportunidad.activa 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {oportunidad.activa ? 'Pausar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => eliminarOportunidad(oportunidad.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay oportunidades */}
        {oportunidadesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {filtroTipo === 'todas' ? 'No hay oportunidades' : `No hay ${filtroTipo.toLowerCase()}s`}
            </h3>
            <p className="text-gray-300 mb-6">
              {filtroTipo === 'todas' 
                ? 'Comienza agregando tu primera oportunidad' 
                : `Agrega la primera ${filtroTipo.toLowerCase()}`
              }
            </p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="px-6 py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-colors"
            >
              + Agregar Oportunidad
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOportunidades;
