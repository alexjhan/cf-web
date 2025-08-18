import { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Toast {
  id: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // ms
}
interface ToastContextValue {
  push: (t: Omit<Toast,'id'>) => string;
  remove: (id: string) => void;
  clear: () => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
};

function nextId(){ return Math.random().toString(36).slice(2,10); }

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast,'id'>) => {
    const id = nextId();
    setToasts(prev => [...prev, { id, duration: 3500, type: 'info', ...t }]);
    return id;
  }, []);
  const remove = useCallback((id: string) => setToasts(prev => prev.filter(t=> t.id!==id)), []);
  const clear = useCallback(()=> setToasts([]), []);

  useEffect(() => {
    if(!toasts.length) return;
    const timers = toasts.map(t => setTimeout(()=> remove(t.id), t.duration));
    return () => { timers.forEach(clearTimeout); };
  }, [toasts, remove]);

  return (
    <ToastContext.Provider value={{ push, remove, clear }}>
      {children}
      <div className="fixed z-[2000] top-4 right-4 flex flex-col gap-3 max-w-sm">
        {toasts.map(t => {
          const color = t.type==='success'? 'border-green-400 text-green-200 bg-green-900/40':
                        t.type==='error'? 'border-red-400 text-red-200 bg-red-900/40':
                        t.type==='warning'? 'border-amber-400 text-amber-200 bg-amber-900/40':
                        'border-[#FFD700]/50 text-[#FFD700] bg-black/60';
          return (
            <div key={t.id} className={`group relative overflow-hidden px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg text-sm flex items-start gap-3 animate-fade-in ${color}`}>
              <div className="flex-1 leading-snug pr-6">{t.message}</div>
              <button onClick={()=> remove(t.id)} className="absolute top-1 right-1 p-1 rounded hover:bg-white/10 text-xs">✕</button>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] animate-toast-bar" />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// Animations (simple CSS via injected style if not present)
if(typeof document !== 'undefined' && !document.getElementById('__toast_styles')){
  const style = document.createElement('style');
  style.id='__toast_styles';
  style.innerHTML = `@keyframes fade-in { from { opacity:0; transform: translateY(-4px); } to { opacity:1; transform: translateY(0); } }
  .animate-fade-in{ animation: fade-in .25s ease-out; }
  @keyframes toast-bar { from { transform: translateX(-100%);} to { transform: translateX(0);} }
  .animate-toast-bar{ animation: toast-bar 3.5s linear forwards; }`;
  document.head.appendChild(style);
}
