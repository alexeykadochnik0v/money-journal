import React from "react";

export function Sheet({ open, onOpenChange, children, backdrop = true, widthClass = "w-80 max-w-[90%]" }){
  return open ? (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {backdrop && (
        <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={()=>onOpenChange(false)} />
      )}
      <div className={`absolute inset-y-0 left-0 ${widthClass} bg-white shadow-xl border-r rounded-r-2xl p-4 overflow-y-auto pointer-events-auto`}>
        {children}
      </div>
    </div>
  ) : null;
}

export function SheetHeader({ children }){ return <div className="mb-3">{children}</div>; }
export function SheetTitle({ children }){ return <h3 className="text-lg font-semibold leading-tight">{children}</h3>; }
