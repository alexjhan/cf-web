import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Carrera from "./pages/Carrera/Carrera";
import Noticias from "./pages/Noticias/Noticias";
// Carga diferida de Cursos para reducir el bundle inicial (lib @xyflow/react es pesada)
const Cursos = lazy(() => import(/* webpackChunkName: "cursos" */ "./pages/Cursos/Cursos"));
import Inicio from "./pages/Inicio/Inicio";
import Oportunidades from "./pages/Oportunidades/Oportunidades";
import Documentos from "./pages/Documentos/Documentos";
import AdminNoticias from "./pages/AdminNoticias/AdminNoticias";
import ChatBot from "./pages/ChatBot/ChatBot";
import AdminSelector from "./pages/AdminSelector/AdminSelector";
import AdminEspecialidades from "./pages/AdminEspecialidades/AdminEspecialidades";
import AdminOportunidades from "./pages/AdminOportunidades/AdminOportunidades";
import Especialidades from "./pages/Especialidades/Especialidades";
import Representacion from "./pages/Representacion/Representacion";
import ResponsivePreview from "./pages/ResponsivePreview/ResponsivePreview.tsx";

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/admin-noticias" element={<AdminNoticias />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/especialidades" element={<Especialidades />} />
  <Route path="/representacion" element={<Representacion />} />
  <Route path="/responsive" element={<ResponsivePreview />} />
        <Route path="/admin" element={<AdminSelector />} />
        <Route path="/admin-selector" element={<AdminSelector />} />
        <Route path="/admin-especialidades" element={<AdminEspecialidades />} />
        <Route path="/admin-oportunidades" element={<AdminOportunidades />} />
    {/* Fallback para cualquier ruta no definida dentro del SPA */}
    <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
