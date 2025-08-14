import { cn } from "@/lib/utils";

const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-3";

const variants = {
  default: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
  secondary: "bg-zinc-100 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:hover:bg-zinc-800/80",
  outline: "border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800/40",
  destructive: "bg-rose-600 text-white hover:bg-rose-600/90",
  ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
};

export function Button({ className, variant = "default", size = "default", ...props }) {
  const sizeCls = size === "icon" ? "h-9 w-9 p-0" : "h-9 px-3";
  return <button className={cn(base, variants[variant] || variants.default, sizeCls, className)} {...props} />;
}
