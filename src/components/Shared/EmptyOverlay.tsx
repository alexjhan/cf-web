import React from 'react';

interface EmptyOverlayProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyOverlay: React.FC<EmptyOverlayProps> = ({ title, message, icon = 'ℹ️', actionLabel, onAction, className }) => {
  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center px-4 ${className || ''}`}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-lg mx-auto text-center space-y-6 p-8 rounded-3xl bg-gradient-to-br from-[#1a1a1a]/90 to-[#050505]/90 border border-[#FFD700]/30 shadow-[0_0_25px_-5px_rgba(255,215,0,0.25)] animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-4xl shadow-lg shadow-[#FFD700]/30">
          {icon}
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] bg-clip-text text-transparent tracking-wide">
          {title}
        </h2>
        <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-md mx-auto">
          {message}
        </p>
        {actionLabel && (
          <button
            onClick={onAction}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#FFD700] to-[#C9B037] text-black hover:from-[#C9B037] hover:to-[#B8860B] shadow-lg shadow-[#FFD700]/30 transition-all duration-300 hover:scale-105"
          >
            {actionLabel}
          </button>
        )}
        <div className="text-[11px] text-gray-500 tracking-wide">
          Estado: <span className="text-[#FFD700] font-medium">En preparación de contenidos</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyOverlay;
