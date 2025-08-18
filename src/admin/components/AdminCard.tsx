import React from 'react';

interface AdminCardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  padded?: boolean;
}

// Contenedor reutilizable para estandarizar estilo de secciones en el panel admin
export default function AdminCard({ title, children, actions, className='', padded=true }: AdminCardProps){
  return (
    <section className={`relative rounded-xl border border-gray-700 bg-[#18181b]/70 backdrop-blur-sm shadow-lg shadow-black/30 ${padded? 'p-5 md:p-6':''} ${className}`}>
      {(title || actions) && (
        <header className={`mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${padded? '':'p-5 pb-0'}`}>
          {title && <h3 className="text-lg font-semibold tracking-wide text-[#FFD700] drop-shadow">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
