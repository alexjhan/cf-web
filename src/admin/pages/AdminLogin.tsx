import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin(){
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if(isAuthenticated){
    navigate('/admin/oportunidades', { replace:true });
    return null;
  }

  // Adaptar onLogin para ser asíncrono
  const handleLogin = async (u: string, p: string) => {
    const ok = await login(u, p);
    if(ok) navigate('/admin/oportunidades', { replace:true });
    return ok;
  };

  return (
    <LoginForm onLogin={handleLogin} title="Acceso Administrador" />
  );
}
