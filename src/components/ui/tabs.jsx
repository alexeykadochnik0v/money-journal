import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const TabsCtx = createContext(null);

export function Tabs({ defaultValue, value: controlled, onValueChange, className, children }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const setValue = (v) => {
    if (onValueChange) onValueChange(v);
    if (controlled === undefined) setUncontrolled(v);
  };
  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800", className)} {...props} />;
}

export function TabsTrigger({ value, className, ...props }) {
  const ctx = useContext(TabsCtx);
  const isActive = ctx?.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-zinc-900 shadow dark:bg-zinc-900 dark:text-zinc-100" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ value, className, ...props }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return <div className={cn("mt-3", className)} {...props} />;
}
