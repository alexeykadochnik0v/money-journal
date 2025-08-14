import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const Ctx = createContext(null);

export function Select({ value, defaultValue, onValueChange, children, className }) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value !== undefined ? value : inner;
  const setValue = (v) => {
    onValueChange?.(v);
    if (value === undefined) setInner(v);
  };
  const [open, setOpen] = useState(false);
  const ctx = useMemo(() => ({ value: current, setValue, open, setOpen }), [current, open]);
  return (
    <Ctx.Provider value={ctx}>
      <div className={cn("relative", className)}>{children}</div>
    </Ctx.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = useContext(Ctx) || {};
  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen?.(!open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-zinc-700 dark:focus-visible:ring-white",
        className
      )}
      {...props}
    >
      <span className="truncate flex-1 text-left">{children}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" className="ml-2 opacity-60" aria-hidden>
        <path fill="currentColor" d="M7 10l5 5 5-5z"></path>
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder = "Выбрать" }) {
  const { value } = useContext(Ctx) || {};
  return <span className={cn(!value && "opacity-50")}>{value || placeholder}</span>;
}

export function SelectContent({ className, children }) {
  const { open } = useContext(Ctx) || {};
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 mt-1 w-full rounded-md border bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900", className)}>
      <ul role="listbox" className="max-h-60 overflow-auto text-sm">
        {children}
      </ul>
    </div>
  );
}

export function SelectItem({ value, className, children }) {
  const { value: current, setValue, setOpen } = useContext(Ctx) || {};
  const isActive = current === value;
  const onClick = () => {
    setValue?.(value);
    setOpen?.(false);
  };
  return (
    <li
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-sm px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        isActive && "bg-zinc-100 dark:bg-zinc-800",
        className
      )}
    >
      {children}
    </li>
  );
}
