import React, { useState } from 'react';

type AdminSection = 'noticias' | 'especialidades' | 'oportunidades';

const AdminSelector: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<AdminSection | null>(null);

  if (selectedSection === 'noticias') {
    // Importar y renderizar el componente de administración de noticias
    window.location.href = '/admin-noticias';
    return null;
  }

  if (selectedSection === 'especialidades') {
    // Importar y renderizar el componente de administración de especialidades
    window.location.href = '/admin-especialidades';
    return null;
  }

  if (selectedSection === 'oportunidades') {
    // Importar y renderizar el componente de administración de oportunidades
    window.location.href = '/admin-oportunidades';
    return null;
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-sans" 
      style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: '#C9B037', textShadow: '0 2px 8px #000' }}
          >
            Panel de Administración
          </h1>
          <p 
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#F3F4F6' }}
          >
            Selecciona qué sección deseas administrar. Puedes editar noticias, 
            especialidades y oportunidades desde aquí.
          </p>
        </div>

        {/* Cards de selección */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Administrar Noticias */}
          <div
            onClick={() => setSelectedSection('noticias')}
            className="bg-[#23232a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-700 hover:border-[#FFD700] cursor-pointer group"
          >
            <div className="bg-[#FFD700] p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">📰</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">Gestión</div>
                  <div className="text-sm opacity-80">Contenido</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Administrar Noticias</h3>
              <p className="text-sm opacity-90">Editor de noticias</p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Crea, edita y administra las noticias que se muestran en la página principal. 
                Gestiona el contenido informativo para mantener actualizada la comunidad.
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Funciones disponibles:</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Agregar nuevas noticias
                  </li>
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Editar noticias existentes
                  </li>
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Eliminar noticias
                  </li>
                </ul>
              </div>
              
              <button className="w-full py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-all duration-200 group-hover:bg-[#C9B037]">
                Administrar Noticias
              </button>
            </div>
          </div>

          {/* Administrar Especialidades */}
          <div
            onClick={() => setSelectedSection('especialidades')}
            className="bg-[#23232a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-700 hover:border-[#FFD700] cursor-pointer group"
          >
            <div className="bg-[#C9B037] p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">🧪</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">Gestión</div>
                  <div className="text-sm opacity-80">Académica</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Administrar Especialidades</h3>
              <p className="text-sm opacity-90">Editor de especialidades</p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Gestiona las especialidades de posgrado y técnicas disponibles. 
                Actualiza información sobre programas académicos y requisitos.
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Funciones disponibles:</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Agregar nuevas especialidades
                  </li>
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Editar información académica
                  </li>
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Actualizar requisitos
                  </li>
                </ul>
              </div>
              
              <button className="w-full py-3 bg-[#C9B037] hover:bg-[#FFD700] text-black rounded-lg font-semibold transition-all duration-200 group-hover:bg-[#FFD700]">
                Administrar Especialidades
              </button>
            </div>
          </div>

          {/* Administrar Oportunidades */}
          <div
            onClick={() => setSelectedSection('oportunidades')}
            className="bg-[#23232a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-700 hover:border-[#FFD700] cursor-pointer group"
          >
            <div className="bg-[#B8860B] p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">💼</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">Gestión</div>
                  <div className="text-sm opacity-80">Laboral</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Administrar Oportunidades</h3>
              <p className="text-sm opacity-90">Editor de oportunidades</p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Publica y gestiona oportunidades laborales, becas, concursos y 
                eventos relevantes para la comunidad metalúrgica.
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Funciones disponibles:</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Publicar ofertas laborales
                  </li>
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Gestionar becas y concursos
                  </li>
                  <li className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#C9B037] mr-2">✓</span>
                    Administrar eventos
                  </li>
                </ul>
              </div>
              
              <button className="w-full py-3 bg-[#B8860B] hover:bg-[#FFD700] text-white rounded-lg font-semibold transition-all duration-200 group-hover:bg-[#FFD700] group-hover:text-black">
                Administrar Oportunidades
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-16 bg-[#23232a] rounded-xl p-8 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Sistema de Gestión de Contenido
            </h2>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Este panel te permite administrar todo el contenido dinámico de la página web. 
              Los cambios se guardan automáticamente y se reflejan inmediatamente en la página principal.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold text-white mb-1">Seguro</h3>
                <p className="text-sm text-gray-300">Datos guardados localmente</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-white mb-1">Rápido</h3>
                <p className="text-sm text-gray-300">Cambios instantáneos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold text-white mb-1">Responsivo</h3>
                <p className="text-sm text-gray-300">Funciona en todos los dispositivos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="mt-12 text-center">
          <button 
            className="px-8 py-3 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black rounded-lg font-semibold transition-colors"
            onClick={() => window.location.href = '/'}
          >
            ← Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSelector;
