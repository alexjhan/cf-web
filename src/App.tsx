import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from './components/Toast/ToastContext';
import { Suspense, lazy } from "react";
import { useAuth } from "./hooks/useAuth";

// Carga diferida de Cursos para reducir el bundle inicial (lib @xyflow/react es pesada)
const Cursos = lazy(() => import(/* webpackChunkName: "cursos" */ "./pages/Cursos/Cursos"));
import Inicio from "./pages/Inicio/Inicio";
import Oportunidades from "./pages/Oportunidades/Oportunidades";
import Documentos from "./pages/Documentos/Documentos";
import Carrera from "./pages/Carrera/Carrera";
import Noticias from "./pages/Noticias/Noticias";
import ChatBot from "./pages/ChatBot/ChatBot";
import Representacion from "./pages/Representacion/Representacion";
import ResponsivePreview from "./pages/ResponsivePreview/ResponsivePreview.tsx";

// New admin consolidated pages
import AdminNoticiasPage from "./admin/pages/AdminNoticias";
import AdminDocumentosPage from "./admin/pages/AdminDocumentos";
import AdminOportunidadesPage from "./admin/pages/AdminOportunidades";
import AdminLogin from "./admin/pages/AdminLogin";

function AdminRootRedirect(){
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated? '/admin/oportunidades':'/admin/login'} replace />;
}


function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/carrera" element={<Carrera />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/cursos" element={
          <Suspense fallback={<div style={{minHeight:'60vh'}} className="flex items-center justify-center text-gray-300 animate-pulse">Cargando malla de cursos...</div>}>
            <Cursos />
          </Suspense>
        } />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/documentos" element={<Documentos />} />
  {/* Legacy single-dash admin routes redirected to new nested structure */}
  <Route path="/admin-noticias" element={<Navigate to="/admin/noticias" replace />} />
  <Route path="/admin-documentos" element={<Navigate to="/admin/documentos" replace />} />
  <Route path="/admin-oportunidades" element={<Navigate to="/admin/oportunidades" replace />} />
  <Route path="/chatbot" element={<ChatBot />} />
  <Route path="/representacion" element={<Representacion />} />
  <Route path="/responsive" element={<ResponsivePreview />} />
  <Route path="/admin" element={<AdminRootRedirect />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/panel" element={<Navigate to="/admin/oportunidades" replace />} />
  <Route path="/admin/noticias" element={<AdminNoticiasPage />} />
  <Route path="/admin/documentos" element={<AdminDocumentosPage />} />
  <Route path="/admin/oportunidades" element={<AdminOportunidadesPage />} />
  <Route path="/admin/especialidades" element={<Navigate to="/admin/oportunidades?cat=especializaciones" replace />} />
    {/* Fallback para cualquier ruta no definida dentro del SPA */}
    <Route path="*" element={<Navigate to="/inicio" replace />} />
  </Routes>
  </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
