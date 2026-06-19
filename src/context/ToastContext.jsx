import { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext(() => {});
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3000);
  }, []);
  const colors = { success: 'bg-emerald-500', error: 'bg-rose-500', info: 'bg-sky-500', warning: 'bg-amber-500' };
  const icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', info: 'fa-info-circle', warning: 'fa-triangle-exclamation' };
  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white ${colors[t.type]} min-w-[300px] transition-all duration-300`}>
            <i className={`fa-solid ${icons[t.type]}`} /><span className="font-medium text-sm">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);
