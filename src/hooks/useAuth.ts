import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    // Verificar si hay una sesión activa en localStorage
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.isAuthenticated && parsed.timestamp) {
          // Verificar si la sesión no ha expirado (24 horas)
          const now = Date.now();
          const sessionAge = now - parsed.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
          
          if (sessionAge < maxAge) {
            setAuthState({
              isAuthenticated: true,
              user: parsed.user
            });
          } else {
            // Sesión expirada, limpiar
            localStorage.removeItem('adminAuth');
          }
        }
      } catch (error) {
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Credenciales hardcodeadas (en producción deberían venir de un servidor)
    if (username === 'admin' && password === 'admin') {
      const authData = {
        isAuthenticated: true,
        user: username,
        timestamp: Date.now()
      };
      
      localStorage.setItem('adminAuth', JSON.stringify(authData));
      setAuthState({
        isAuthenticated: true,
        user: username
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setAuthState({
      isAuthenticated: false,
      user: null
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};
