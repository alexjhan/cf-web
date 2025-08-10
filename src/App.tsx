import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Carrera from "./pages/Carrera/Carrera";
import Contacto from "./pages/Contacto/Contacto";
import Noticias from "./pages/Noticias/Noticias";
import Cursos from "./pages/Cursos/Cursos";
import Inicio from "./pages/Inicio/Inicio";
import Oportunidades from "./pages/Oportunidades/Oportunidades";
import Documentos from "./pages/Documentos/Documentos";
import AdminNoticias from "./pages/AdminNoticias/AdminNoticias";
import ChatBot from "./pages/ChatBot/ChatBot";
import AdminSelector from "./pages/AdminSelector/AdminSelector";
import AdminEspecialidades from "./pages/AdminEspecialidades/AdminEspecialidades";
import AdminOportunidades from "./pages/AdminOportunidades/AdminOportunidades";
import Especialidades from "./pages/Especialidades/Especialidades";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/carrera" element={<Carrera />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/admin-noticias" element={<AdminNoticias />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/admin" element={<AdminSelector />} />
        <Route path="/admin-especialidades" element={<AdminEspecialidades />} />
        <Route path="/admin-oportunidades" element={<AdminOportunidades />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
