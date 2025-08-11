import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';

const AdminSelectorContent: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  const navigateToSection = (section: string) => {
    window.location.href = section;
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans" 
      style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header con información del usuario y logout */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: '#C9B037', textShadow: '0 2px 8px #000' }}
              >
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-400">
                Bienvenido, <span className="text-[#FFD700] font-semibold">{user}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
          <p 
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#F3F4F6' }}
          >
            Selecciona qué sección deseas administrar. Puedes editar noticias, 
            especialidades y oportunidades desde aquí.
          </p>
        </div>

        {/* Cards de selección - SELECTORES PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SELECTOR 1: Administrar Noticias */}
          <div
            onClick={() => navigateToSection('/admin-noticias')}
            className="bg-[#23232a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-700 hover:border-[#FFD700] cursor-pointer group"
          >
            <div className="bg-[#FFD700] p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">📰</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">Editor</div>
                  <div className="text-sm opacity-80">Noticias</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Administrar Noticias</h3>
              <p className="text-sm opacity-90">Gestión de contenido informativo</p>
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
                    Eliminar y organizar
                  </li>
                </ul>
              </div>
              
              <button className="w-full py-3 bg-[#FFD700] hover:bg-[#C9B037] text-black rounded-lg font-semibold transition-all duration-200 group-hover:bg-[#C9B037]">
                Editar Noticias →
              </button>
            </div>
          </div>

          {/* SELECTOR 2: Administrar Especialidades */}
          <div
            onClick={() => navigateToSection('/admin-especialidades')}
            className="bg-[#23232a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-700 hover:border-[#FFD700] cursor-pointer group"
          >
            <div className="bg-[#C9B037] p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">🧪</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">Editor</div>
                  <div className="text-sm opacity-80">Especialidades</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Administrar Especialidades</h3>
              <p className="text-sm opacity-90">Gestión de programas académicos</p>
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
                    Agregar especialidades
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
                Editar Especialidades →
              </button>
            </div>
          </div>

          {/* SELECTOR 3: Administrar Oportunidades */}
          <div
            onClick={() => navigateToSection('/admin-oportunidades')}
            className="bg-[#23232a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-700 hover:border-[#FFD700] cursor-pointer group"
          >
            <div className="bg-[#B8860B] p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">💼</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">Editor</div>
                  <div className="text-sm opacity-80">Oportunidades</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Administrar Oportunidades</h3>
              <p className="text-sm opacity-90">Gestión de ofertas laborales</p>
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
                Editar Oportunidades →
              </button>
            </div>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="mt-16 bg-[#23232a] rounded-xl p-8 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🔧 Sistema de Gestión de Contenido
            </h2>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Este panel te permite administrar todo el contenido dinámico de la página web. 
              Los cambios se guardan automáticamente y se reflejan inmediatamente en la página principal.
              <strong className="text-[#FFD700]"> Selecciona una opción arriba para comenzar a editar.</strong>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4 bg-[#18181b] rounded-lg">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold text-white mb-1">Acceso Seguro</h3>
                <p className="text-sm text-gray-300">Sistema de autenticación centralizada</p>
              </div>
              <div className="text-center p-4 bg-[#18181b] rounded-lg">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-white mb-1">Edición Rápida</h3>
                <p className="text-sm text-gray-300">Cambios instantáneos en tiempo real</p>
              </div>
              <div className="text-center p-4 bg-[#18181b] rounded-lg">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold text-white mb-1">Multi-dispositivo</h3>
                <p className="text-sm text-gray-300">Funciona en PC, tablet y móvil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones de uso */}
        <div className="mt-8 bg-gradient-to-r from-[#C9B037]/20 to-[#FFD700]/20 rounded-xl p-6 border border-[#C9B037]/30">
          <h3 className="text-lg font-bold text-[#FFD700] mb-3">📋 Instrucciones de Uso:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-[#FFD700] font-semibold">1. Seleccionar:</span> Haz clic en cualquiera de las 3 opciones de edición arriba
            </div>
            <div>
              <span className="text-[#FFD700] font-semibold">2. Editar:</span> Usa los formularios para agregar, modificar o eliminar contenido
            </div>
            <div>
              <span className="text-[#FFD700] font-semibold">3. Guardar:</span> Los cambios se guardan automáticamente
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

// Componente principal con protección de autenticación
const AdminSelector: React.FC = () => {
  return (
    <ProtectedRoute title="Panel de Administración - Ingreso Requerido">
      <AdminSelectorContent />
    </ProtectedRoute>
  );
};

export default AdminSelector;
