import { Navigate } from 'react-router-dom';

// Página obsoleta: redirige a la nueva categoría dentro de Oportunidades
export default function AdminEspecialidadesPage(){
  return <Navigate to="/admin/oportunidades?cat=especializaciones" replace />;
}
