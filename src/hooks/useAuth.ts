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

    const login = async (username: string, password: string): Promise<boolean> => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const { token } = await res.json();
          const authData = {
            isAuthenticated: true,
            user: username,
            timestamp: Date.now()
          };
          localStorage.setItem('adminAuth', JSON.stringify(authData));
          localStorage.setItem('adminToken', token);
          setAuthState({
            isAuthenticated: true,
            user: username
          });
          return true;
        }
      } catch (error) {
        // Puedes mostrar un mensaje de error aquí si lo deseas
      }
      return false;
    };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminToken');
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
