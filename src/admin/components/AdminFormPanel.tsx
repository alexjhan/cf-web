import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AdminFormPanelProps {
  title: string;
  editing: boolean;
  onReset: () => void;
  children: ReactNode;
  newLabel?: string;
  className?: string;
  mode?: 'inline' | 'modal';
  open?: boolean; // usado en modo modal
  onClose?: () => void; // usado en modo modal
}

export default function AdminFormPanel({ title, editing, onReset, children, newLabel='Nuevo', className='', mode='inline', open=true, onClose }: AdminFormPanelProps){
  if(mode === 'modal'){
    // Scroll lock mientras está abierto
    useEffect(()=>{
      if(open){ const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; return ()=> { document.body.style.overflow = prev; }; }
    }, [open]);
    if(!open) return null;
    return createPortal(
      <div className="fixed inset-0 z-[1000] w-screen h-screen" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <div className="relative flex min-h-screen items-center justify-center p-4">
          <div className="relative w-full max-w-[900px] max-h-[94vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-700/80 rounded-2xl p-6 shadow-[0_12px_48px_-8px_rgba(0,0,0,0.85)] animate-fadeIn">
            <div className="flex items-start justify-between mb-4 sticky top-0 bg-gradient-to-b from-gray-900 to-gray-900/90 backdrop-blur-sm pb-2 z-10">
              <h2 className="font-semibold text-lg text-[#FFD700]">{editing? 'Editar':'Nuevo'} {title}</h2>
              <div className="flex items-center gap-3">
                {editing && <button onClick={onReset} type="button" className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600">{newLabel}</button>}
                <button onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-200 text-xl leading-none px-2 rounded hover:bg-gray-800/70">×</button>
              </div>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>,
      document.body
    );
  }
  return (
    <div className={`bg-gray-900 p-4 rounded border border-gray-700 h-fit ${className}`}>
      <h2 className="font-semibold mb-3 text-lg flex items-center justify-between text-[#FFD700]">
        <span>{editing? 'Editar':'Nuevo'} {title}</span>
        {editing && <button onClick={onReset} type="button" className="text-xs text-gray-400 hover:text-gray-200">{newLabel}</button>}
      </h2>
      {children}
    </div>
  );
}

// Animación ligera (utilizar tailwind custom si existe; fallback simple)
// Se puede complementar con clases en el tailwind config si se desea.
