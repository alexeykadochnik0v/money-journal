import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((t) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, ...t }]);
    const ttl = t.ttl ?? 3000;
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), ttl);
  }, []);
  const value = useMemo(() => ({ toast: push }), [push]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto rounded-xl border bg-white/90 backdrop-blur p-3 shadow-lg ${t.variant==='destructive'?'border-rose-300':'border-zinc-200'}`}>
            {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
            {t.description && <div className="text-sm text-zinc-600">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(){
  const ctx = useContext(ToastCtx);
  if(!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
