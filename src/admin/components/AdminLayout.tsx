import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Props { children: ReactNode; title?: string; }

// Solo tres secciones solicitadas
const navItems = [
  { to: '/admin/oportunidades', label: 'Oportunidades' },
  { to: '/admin/documentos', label: 'Documentos' },
  { to: '/admin/noticias', label: 'Noticias' },
];

export default function AdminLayout({ children, title }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => { if(confirm('¿Cerrar sesión?')) { logout(); navigate('/inicio', { replace:true }); } };
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}>
      {/* Sidebar */}
      <aside className="w-60 backdrop-blur-sm/0 bg-[#23232a]/95 border-r border-gray-800 p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <img src="/assets/logo-metalurgia.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Administración</h1>
            <p className="text-[11px] tracking-wide text-gray-400 uppercase">Centro Federado</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          {navItems.map(i => {
            const active = pathname === i.to;
            return (
              <Link
                key={i.to}
                to={i.to}
                className={`group px-3 py-2 rounded-lg border text-[13px] font-medium transition-all flex items-center gap-2 ${active ? 'border-[#C9B037] bg-[#C9B037] text-black shadow-md' : 'border-gray-700 bg-[#18181b] text-gray-300 hover:border-[#C9B037] hover:text-white hover:shadow-md'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9B037] opacity-70 group-hover:opacity-100" />
                {i.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="text-[11px] text-gray-400 leading-snug bg-[#18181b] border border-gray-700 rounded-lg p-3">
            <p className="truncate"><span className="text-gray-500">Usuario:</span> <span className="text-gray-300 font-medium">{user || '—'}</span></p>
          </div>
          <button onClick={handleLogout} className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-black hover:from-[#C9B037] hover:to-[#FFE066] transition-colors border border-[#FFD700]/60 shadow-md hover:shadow-lg">Cerrar Sesión</button>
          <div className="pt-2 text-[10px] text-gray-500 tracking-wide">© {new Date().getFullYear()} CF Metalurgia</div>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {title && <h2 className="text-2xl font-semibold mb-6 text-[#C9B037] drop-shadow">{title}</h2>}
          <div className="bg-[#23232a]/80 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
