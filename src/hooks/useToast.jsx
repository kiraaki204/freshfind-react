import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const showToast = useCallback((msg, type = 'success') => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`ff-toast ${t.type}`}>
            <Icon name={t.type === 'error' ? 'alert' : t.type === 'info' ? 'info' : 'checkc'} size={16} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
