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
  return (
    <LoginForm onLogin={(u,p)=> { const ok = login(u,p); if(ok) navigate('/admin/oportunidades', { replace:true }); return ok; }} title="Acceso Administrador" />
  );
}
