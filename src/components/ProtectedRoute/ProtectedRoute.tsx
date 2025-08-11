import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../LoginForm/LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  title?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, title }) => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} title={title} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
