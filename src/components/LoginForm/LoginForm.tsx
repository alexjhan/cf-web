import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  title?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, title = "Admin Login" }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = await onLogin(username, password);
    
    if (!success) {
      setError('Usuario o contraseña incorrectos');
      setPassword(''); // Limpiar contraseña en caso de error
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans" style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/assets/logo-metalurgia.jpg" alt="Logo" className="w-16 h-16 rounded-full object-cover mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">Centro Federado</h1>
              <p className="text-gray-400 text-sm">Ingeniería Metalúrgica</p>
            </div>
          </div>
        </div>

        {/* Formulario de login */}
        <div className="bg-[#23232a] p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#C9B037' }}>
            {title}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#18181b] text-white border border-gray-700 focus:border-[#C9B037] focus:outline-none transition-colors"
                placeholder="Ingresa tu usuario"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#18181b] text-white border border-gray-700 focus:border-[#C9B037] focus:outline-none transition-colors pr-12"
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-[#FFD700] focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.875-2.25A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.875 2.25A9.956 9.956 0 0112 21c-1.657 0-3.22-.403-4.575-1.125m-2.25-1.875A10.05 10.05 0 013 12c0-1.657.403-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.09 2.354M15.54 15.54A5.978 5.978 0 0112 17c-3.314 0-6-2.686-6-6 0-.828.162-1.618.458-2.354" /></svg>
                )}
              </button>
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-[#C9B037] text-black font-bold hover:bg-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-xs text-center">
              Acceso restringido solo para administradores
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ¿Problemas para acceder?{' '}
            <a href="/contacto" className="text-[#C9B037] hover:text-[#FFD700] transition-colors">
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
