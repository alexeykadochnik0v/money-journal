import { cn } from "@/lib/utils";

const variants = {
  default: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
  secondary: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  outline: "border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}
