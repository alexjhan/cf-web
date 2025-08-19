import { Link } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../components/AdminLayout';

export default function AdminPanel(){
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute title="Panel de Administración">
      <AdminLayout title="Panel de Administración">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold">Bienvenido {user}</h2>
            <p className="text-sm text-gray-400">Selecciona una sección para administrar el contenido.</p>
          </div>
          <button onClick={()=> { if(confirm('¿Cerrar sesión?')) logout(); }} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-medium">Cerrar Sesión</button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <PanelCard to="/admin/noticias" icon="📰" title="Noticias" color="bg-yellow-600" desc="Crear y editar noticias públicas" />
          <PanelCard to="/admin/oportunidades" icon="💼" title="Oportunidades" color="bg-amber-700" desc="Gestionar ofertas, becas y eventos" />
          <PanelCard to="/admin/especialidades" icon="🧪" title="Especialidades" color="bg-yellow-500" desc="Administrar programas y descripciones" />
          <PanelCard to="/admin/documentos" icon="📄" title="Documentos" color="bg-blue-600" desc="Subir y catalogar documentos" />
        </div>
        <div className="mt-10 text-sm text-gray-500">
          Consejo: Usa la barra lateral para cambiar rápidamente entre secciones.
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

function PanelCard({ to, icon, title, desc, color }: { to:string; icon:string; title:string; desc:string; color:string }){
  return (
    <Link to={to} className="group rounded-lg border border-gray-800 bg-gray-900 hover:border-gray-600 transition-colors flex flex-col overflow-hidden">
      <div className={`p-4 ${color} text-black flex items-center justify-between`}>
        <span className="text-4xl leading-none">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-gray-300 text-sm flex-1">{desc}</p>
        <span className="mt-4 text-xs text-blue-400 group-hover:underline">Entrar →</span>
      </div>
    </Link>
  );
}
