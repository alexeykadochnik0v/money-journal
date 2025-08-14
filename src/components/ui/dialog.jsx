import React, { createContext, useContext, useState } from "react";

const DialogCtx = createContext(null);

export function Dialog({ open, onOpenChange, children }){
  return (
    <DialogCtx.Provider value={{ open, onOpenChange }}>
      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>onOpenChange(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border bg-white p-4 shadow-xl">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </DialogCtx.Provider>
  );
}

export function DialogHeader({ children }){ return <div className="mb-2">{children}</div>; }
export function DialogFooter({ children }){ return <div className="mt-4 flex justify-end gap-2">{children}</div>; }
export function DialogTitle({ children }){ return <h3 className="text-lg font-semibold leading-tight">{children}</h3>; }
export function DialogDescription({ children }){ return <p className="text-sm text-zinc-600">{children}</p>; }
