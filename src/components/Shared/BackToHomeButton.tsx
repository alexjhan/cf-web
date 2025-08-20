import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToHomeButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')}
      className="fixed bottom-5 right-5 z-[120] bg-[#FFD700]/90 hover:bg-[#FFD700] text-black shadow-lg rounded-full p-3 transition-all duration-200 border border-[#FFD700]/60 hover:scale-105 group"
      title="Volver al inicio"
      aria-label="Volver al inicio"
      style={{ boxShadow: '0 2px 16px 0 #FFD70033' }}
    >
      <span className="text-2xl align-middle">🏠</span>
      <span className="sr-only">Volver al inicio</span>
      <span className="absolute opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs rounded px-2 py-1 left-1/2 -translate-x-1/2 bottom-12 pointer-events-none transition-opacity duration-200">Volver al inicio</span>
    </button>
  );
};

export default BackToHomeButton;
